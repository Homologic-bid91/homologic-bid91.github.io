import os
import json
import datetime
import io
import re
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Body, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pypdf import PdfReader
import docx

app = FastAPI(
    title="Virtual Gyans API Server",
    description="API backend for Virtual Gyans YouTube platform website",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "data.json"
)

def load_data():
    if not os.path.exists(DATA_PATH):
        # Trigger mock compilation if data.json doesn't exist yet
        try:
            from build_static import main as run_build
            run_build()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Data file missing and regeneration failed: {e}")

    try:
        with open(DATA_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse database file: {e}")

def save_data(data):
    try:
        with open(DATA_PATH, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to write to database file: {e}")

# Pydantic models for validation
class RoundDetail(BaseModel):
    name: str = Field(..., example="Technical Interview")
    summary: str = Field(..., example="Basic Java and SQL questions.")

class InterviewExperienceCreate(BaseModel):
    candidate: str = Field(..., example="Rahul Sharma")
    role: str = Field(..., example="Cognizant GenC Developer")
    company: str = Field(..., example="Cognizant")
    date: str = Field(..., example="June 2026")
    verdict: str = Field(..., example="Selected")
    difficulty: str = Field(..., example="Medium")
    rounds: List[RoundDetail]
    tips: str = Field(..., example="Revise OOPs and practice SQL Joins.")

@app.get("/")
def read_root():
    return {
        "message": "Welcome to Virtual Gyans API Server",
        "endpoints": [
            "/api/stats",
            "/api/videos",
            "/api/playlists",
            "/api/resources",
            "/api/experiences",
            "/api/flashcards",
            "/api/onboarding"
        ]
    }

@app.get("/api/all")
def get_all_data():
    return load_data()

@app.get("/api/stats")
def get_channel_stats():
    data = load_data()
    return data.get("channel", {})

@app.get("/api/playlists")
def get_playlists():
    data = load_data()
    return data.get("playlists", [])

@app.get("/api/videos")
def get_videos(category: Optional[str] = None, search: Optional[str] = None):
    data = load_data()
    videos = data.get("videos", [])
    
    if category:
        videos = [v for v in videos if v.get("category", "").lower() == category.lower()]
    
    if search:
        search_lower = search.lower()
        videos = [
            v for v in videos 
            if search_lower in v.get("title", "").lower() or search_lower in v.get("description", "").lower()
        ]
        
    return videos

@app.get("/api/resources")
def get_resources(company: Optional[str] = None):
    data = load_data()
    resources = data.get("resources", [])
    if company:
        resources = [r for r in resources if r.get("company", "").lower() == company.lower()]
    return resources

@app.get("/api/experiences")
def get_experiences(company: Optional[str] = None):
    data = load_data()
    experiences = data.get("experiences", [])
    if company:
        experiences = [e for e in experiences if e.get("company", "").lower() == company.lower()]
    return experiences

@app.post("/api/experiences")
def create_experience(exp: InterviewExperienceCreate):
    data = load_data()
    experiences = data.get("experiences", [])
    
    new_id = f"exp-{len(experiences) + 1}"
    new_exp = exp.dict()
    new_exp["id"] = new_id
    
    experiences.insert(0, new_exp)  # Prepend new experience to show first
    data["experiences"] = experiences
    save_data(data)
    
    return {"message": "Interview experience submitted successfully!", "experience": new_exp}

@app.get("/api/flashcards")
def get_flashcards(category: Optional[str] = None):
    data = load_data()
    cards = data.get("flashcards", [])
    if category:
        cards = [c for c in cards if c.get("category", "").lower() == category.lower()]
    return cards

@app.get("/api/onboarding")
def get_onboarding_stages(company: Optional[str] = None):
    data = load_data()
    stages = data.get("onboardingStages", {})
    if company:
        if company in stages:
            return {company: stages[company]}
        raise HTTPException(status_code=404, detail=f"Onboarding data for {company} not found")
    return stages

def extract_text_from_pdf(file_bytes: bytes) -> str:
    try:
        reader = PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse PDF: {e}")

def extract_text_from_docx(file_bytes: bytes) -> str:
    try:
        doc = docx.Document(io.BytesIO(file_bytes))
        text = ""
        for para in doc.paragraphs:
            text += para.text + "\n"
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse DOCX: {e}")

@app.post("/api/analyze-resume")
async def analyze_resume(
    file: Optional[UploadFile] = File(None),
    text: Optional[str] = Form(None),
    company: str = Form("General")
):
    resume_text = ""
    
    if file:
        file_bytes = await file.read()
        filename = file.filename.lower()
        if filename.endswith(".pdf"):
            resume_text = extract_text_from_pdf(file_bytes)
        elif filename.endswith(".docx"):
            resume_text = extract_text_from_docx(file_bytes)
        elif filename.endswith(".txt"):
            resume_text = file_bytes.decode("utf-8", errors="ignore")
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format. Please upload PDF, DOCX or TXT.")
    elif text:
        resume_text = text
    else:
        raise HTTPException(status_code=400, detail="No resume content provided.")
        
    analysis_text = resume_text.lower()
    
    # 1. Contact checks
    has_email = "@" in analysis_text and any(ext in analysis_text for ext in [".com", ".in", ".org", ".edu"])
    phone_pattern = re.compile(r'\+?\d[\d\s-]{8,12}\d')
    has_phone = bool(phone_pattern.search(analysis_text))
    has_linkedin = "linkedin.com" in analysis_text
    has_github = "github.com" in analysis_text
    
    # 2. Sections checks
    has_education = any(keyword in analysis_text for keyword in ["education", "school", "university", "college", "btech", "cgpa"])
    has_experience = any(keyword in analysis_text for keyword in ["experience", "work", "intern", "employment", "job"])
    has_projects = "project" in analysis_text
    has_skills = any(keyword in analysis_text for keyword in ["skill", "skills", "languages", "technologies"])
    
    # 3. Action Verbs checks
    action_verbs_list = [
        'led', 'developed', 'designed', 'created', 'optimized', 
        'implemented', 'managed', 'built', 'solved', 'reduced', 
        'increased', 'achieved', 'initiated', 'engineered', 'formulated'
    ]
    found_verbs = [verb for verb in action_verbs_list if verb in analysis_text]
    verb_count = len(found_verbs)
    
    # 4. Score Calculation
    score = 40
    if has_email: score += 10
    if has_phone: score += 10
    if has_linkedin: score += 10
    if has_github: score += 10
    if has_education: score += 5
    if has_experience: score += 5
    if has_projects: score += 5
    if has_skills: score += 5
    if verb_count >= 4:
        score += 10
    elif verb_count >= 2:
        score += 5
        
    score = min(100, score)
    
    # 5. Recommendations
    recommendations = []
    if not has_email or not has_phone:
        recommendations.append("Add clear contact info (Email and Phone) at the top of your resume so recruiters can reach out.")
    if not has_linkedin:
        recommendations.append("Include a link to your LinkedIn profile. It helps recruiters verify your professional credentials.")
    if not has_github:
        recommendations.append("Add your GitHub profile link. For tech roles, recruiters look for repositories showing actual coding projects.")
    if not has_education:
        recommendations.append("Clearly outline an 'Education' section detailing your Degree, Stream, Year of Graduation, and CGPA/Percentage.")
    if not has_experience and not has_projects:
        recommendations.append("Add a 'Projects' or 'Work Experience' section. Detail at least 2 software projects showing what you built.")
    if not has_skills:
        recommendations.append("Create a designated 'Technical Skills' section grouping your languages (Java, Python, Javascript) and tools (Git, SQL).")
    if verb_count < 3:
        recommendations.append("Start your project and work descriptions with strong action verbs (e.g. 'Optimized app load time...' instead of 'I was responsible for...').")
        
    # 6. Company Advice
    company_advice = ""
    if company == "Cognizant":
        company_advice = "Cognizant looks for strong fundamentals in Object Oriented Programming (Java/Python) and Database Systems (SQL). Ensure these keywords are prominently listed. For GenC Elevate, emphasize full-stack project architectures."
    elif company == "TCS":
        company_advice = "TCS NQT evaluates logical reasoning and programming proficiency. Focus on highlighting Data Structures, Algorithms, and core academic projects on your resume. Make sure to specify languages used in each project."
    elif company == "Accenture":
        company_advice = "Accenture values modern development methodologies (Agile, SDLC), Cloud awareness (AWS/Azure), and frontend/backend frameworks. Adding terms like 'REST API', 'Git version control', or 'Cloud deployment' will boost compatibility."
    else:
        company_advice = "For general ATS parsers, ensure you use simple fonts, standard section headers, and avoid complex table borders or double-column layouts that confuse reader bots."
        
    return {
        "score": score,
        "hasEmail": has_email,
        "hasPhone": has_phone,
        "hasLinkedIn": has_linkedin,
        "hasGitHub": has_github,
        "hasEducation": has_education,
        "hasExperience": has_experience,
        "hasProjects": has_projects,
        "hasSkills": has_skills,
        "verbCount": verb_count,
        "recommendations": recommendations,
        "companyAdvice": company_advice
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
