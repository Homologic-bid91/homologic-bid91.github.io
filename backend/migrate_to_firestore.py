import os
import json
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

def main():
    # Load credentials
    key_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "serviceAccountKey.json")
    if not os.path.exists(key_path):
        print(f"Error: serviceAccountKey.json not found at {key_path}")
        print("Please download it from the Firebase Console (Project Settings -> Service Accounts) and place it here.")
        return
        
    cred = credentials.Certificate(key_path)
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    
    # Load local data.json
    data_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data.json")
    if not os.path.exists(data_path):
        print(f"Error: data.json not found at {data_path}")
        return
        
    with open(data_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    print("Starting migration to Firestore...")
    
    # 1. Channel stats
    if "channel" in data:
        print("Uploading channel stats...")
        db.collection("channel").document("stats").set(data["channel"])
        
    # 2. Playlists
    if "playlists" in data:
        print("Uploading playlists...")
        for pl in data["playlists"]:
            db.collection("playlists").document(pl["id"]).set(pl)
            
    # 3. Videos
    if "videos" in data:
        print("Uploading videos...")
        for vid in data["videos"]:
            db.collection("videos").document(vid["id"]).set(vid)
            
    # 4. Resources
    if "resources" in data:
        print("Uploading resources...")
        for res in data["resources"]:
            db.collection("resources").document(res["id"]).set(res)
            
    # 5. Experiences
    if "experiences" in data:
        print("Uploading experiences...")
        for exp in data["experiences"]:
            db.collection("experiences").document(exp["id"]).set(exp)
            
    # 6. Flashcards
    if "flashcards" in data:
        print("Uploading flashcards...")
        for fc in data["flashcards"]:
            db.collection("flashcards").document(fc["id"]).set(fc)
            
    # 7. Onboarding Stages
    if "onboardingStages" in data:
        print("Uploading onboarding stages...")
        for company, stages in data["onboardingStages"].items():
            db.collection("onboardingStages").document(company).set({"stages": stages})
            
    print("Migration completed successfully!")

if __name__ == "__main__":
    main()
