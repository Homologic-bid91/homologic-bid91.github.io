import os
import json
import datetime
import io
import re
import struct
import base64
import random
import requests
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Body, File, UploadFile, Form, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pypdf import PdfReader
from Crypto.Cipher import AES
from Crypto.Util import Counter
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

# Mega decryption helpers
def base64_url_decode(data: str) -> bytes:
    data += '=='[(2 - len(data) * 3) % 4:]
    for search, replace in (('-', '+'), ('_', '/'), (',', '')):
        data = data.replace(search, replace)
    return base64.b64decode(data)

def base64_to_a32(s: str):
    return str_to_a32(base64_url_decode(s))

def str_to_a32(b: bytes):
    if len(b) % 4:
        b += b'\0' * (4 - len(b) % 4)
    return struct.unpack('>%dI' % (len(b) / 4), b)

def a32_to_str(a):
    return struct.pack('>%dI' % len(a), *a)

def get_chunks(size: int):
    p = 0
    s = 0x20000
    while p + s < size:
        yield (p, s)
        p += s
        if s < 0x100000:
            s += 0x20000
    yield (p, size - p)

def decrypt_mega_file(url: str) -> bytes:
    if "#" in url:
        parts = url.replace("https://mega.nz/file/", "").replace("https://mega.nz/#!", "").split("#")
        file_id = parts[0]
        file_key_str = parts[1]
    elif "!" in url:
        parts = url.split("!")
        file_id = parts[1]
        file_key_str = parts[2]
    else:
        raise ValueError("Invalid Mega URL format")

    seq_num = random.randint(0, 0xFFFFFFFF)
    # The folder ID for the shared folder containing Irfan's resume is Pw5Fja7R
    api_url = f"https://g.api.mega.co.nz/cs?id={seq_num}&n=Pw5Fja7R"
    payload = [{"a": "g", "g": 1, "n": file_id}]
    
    res = requests.post(api_url, json=payload, timeout=30)
    res_data = res.json()[0]
    
    if isinstance(res_data, int) or "g" not in res_data:
        raise Exception(f"Mega file not accessible (code {res_data})")
        
    file_url = res_data["g"]
    file_size = res_data["s"]
    
    file_key = base64_to_a32(file_key_str)
    k = (file_key[0] ^ file_key[4], file_key[1] ^ file_key[5],
         file_key[2] ^ file_key[6], file_key[3] ^ file_key[7])
    iv = file_key[4:6] + (0, 0)
    
    input_file = requests.get(file_url, stream=True, timeout=30).raw
    
    k_str = a32_to_str(k)
    counter = Counter.new(128, initial_value=((iv[0] << 32) + iv[1]) << 64)
    aes = AES.new(k_str, AES.MODE_CTR, counter=counter)
    
    decrypted_bytes = bytearray()
    for chunk_start, chunk_size in get_chunks(file_size):
        chunk = input_file.read(chunk_size)
        if not chunk:
            break
        decrypted_bytes.extend(aes.decrypt(chunk))
        
    return bytes(decrypted_bytes)

@app.get("/api/pdf-proxy")
def pdf_proxy(url: str):
    if not url:
        raise HTTPException(status_code=400, detail="Missing url parameter")
    
    if url == "#" or url.endswith("placeholder.pdf"):
        placeholder_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            "frontend",
            "public",
            "pdfs",
            "placeholder.pdf"
        )
        if os.path.exists(placeholder_path):
            with open(placeholder_path, "rb") as f:
                return Response(content=f.read(), media_type="application/pdf")
        raise HTTPException(status_code=404, detail="Placeholder PDF not found")
        
    try:
        if "mega.nz" in url:
            pdf_data = decrypt_mega_file(url)
            return Response(
                content=pdf_data,
                media_type="application/pdf",
                headers={
                    "Content-Disposition": "inline; filename=document.pdf",
                    "Cache-Control": "public, max-age=3600"
                }
            )
        else:
            res = requests.get(url, timeout=30)
            if res.status_code == 200:
                return Response(
                    content=res.content,
                    media_type="application/pdf",
                    headers={
                        "Content-Disposition": "inline; filename=document.pdf"
                    }
                )
            raise HTTPException(status_code=res.status_code, detail="Failed to fetch remote PDF")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Proxy error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
