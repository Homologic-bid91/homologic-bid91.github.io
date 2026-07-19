import os
import json
import datetime
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
