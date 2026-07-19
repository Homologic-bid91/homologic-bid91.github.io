# Virtual Gyans Website Portal

A beautiful, high-performance, and responsive landing and resources website for the [Virtual Gyans YouTube Channel](https://www.youtube.com/c/virtualgyans) (focused on tech placement preparation, recruitment updates, and coding tutorials). 

This portal is hosted on [https://www.virtualgyans.me/](https://www.virtualgyans.me/) using **GitHub Pages** (frontend) and powered by an optional **Python FastAPI** backend (or fallback to static daily-updated json files).

---

## 🚀 Architecture Highlights

To run on **GitHub Pages** completely for free (without hosting costs for a database or backend server), we use a **hybrid model**:
1. **Frontend (React)**: Statically built SPA using React (Vite) and Vanilla CSS (custom properties, glassmorphism, responsive grids, and 3D card flips). It loads content dynamically from a local `data.json` database.
2. **Backend & Static Exporter (Python)**: A FastAPI server and a compilation utility (`build_static.py`) that queries the YouTube Data API for your channel's real-time statistics (subscribers, views, video counts), playlists, and uploads.
3. **Daily Automatic Updates (GitHub Actions)**: A automated CI/CD workflow (`deploy.yml`) is scheduled to run every day at midnight (and on every git push). It automatically runs the Python builder script to fetch new videos, compiles the static files, builds React, and publishes it to GitHub Pages.

---

## 📁 Repository Structure

```text
├── .github/workflows/deploy.yml   # GitHub Actions build & deploy script
├── frontend/                      # React Vite Frontend App
│   ├── public/
│   │   ├── CNAME                  # Custom domain mapping for pages
│   │   └── data.json              # Main compiled database (compiled by Python)
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   │   ├── Header.jsx         # Navigation with animated logo
│   │   │   ├── Hero.jsx           # Glowing gauges displaying channel stats
│   │   │   ├── VideoGrid.jsx      # Video catalog (search, categories, detail modals)
│   │   │   ├── PlacementHub.jsx   # Curated roadmaps & PDF download cards
│   │   │   ├── InterviewExperiences.jsx # Crowdsourced candidate interview logs
│   │   │   ├── InteractiveTools.jsx # Timeline tracker and 3D flashcards
│   │   │   └── Footer.jsx         # Brand, social links, and navigation
│   │   ├── App.jsx                # Main router, fetching, and global states
│   │   ├── index.css              # Custom HSL design tokens & transitions
│   │   └── main.jsx               # React entry point
│   ├── index.html                 # Main HTML configured for SEO
│   └── vite.config.js             # Vite configurations
└── backend/                       # Python Backend & Scripts
    ├── app.py                     # FastAPI server for local/live testing
    ├── build_static.py            # Local and Action compiler utility
    └── requirements.txt           # Python backend dependencies
```

---

## 🛠️ Local Development

### 1. Running the React Frontend
Navigate to the frontend folder and start the Vite dev server:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser. It will load content from `frontend/public/data.json`.

### 2. Running the Python Backend (Optional)
Navigate to the backend folder, initialize a virtual environment, install requirements, and start the FastAPI server:
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python3 app.py
```
The API server will run at `http://localhost:8000`. You can configure your React environment `.env` to point to it:
```env
VITE_API_URL=http://localhost:8000
```
This lets you test dynamic features (like submitting new interview experiences which write back to the local database file).

---

## 🔑 Fetching Live YouTube Channel Data

To compile real-time statistics instead of the built-in mock data:

1. Obtain a **YouTube Data API Key** from the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a `.env` file in the `backend/` folder:
   ```env
   YOUTUBE_API_KEY=YOUR_YOUTUBE_API_KEY_HERE
   CHANNEL_ID=UCnN6Q5H7b8r8WjD757mR9yQ
   ```
3. Run the compiler script:
   ```bash
   python backend/build_static.py
   ```
   This will query the YouTube API and update the `frontend/public/data.json` database file with your channel's actual videos, counts, and descriptions.

---

## 📦 Deploying to GitHub Pages (`www.virtualgyans.me`)

The included GitHub Actions file handles everything automatically!

### Step 1: Configure Repository Secrets
On GitHub, go to your repository's **Settings > Secrets and variables > Actions** and add:
- `YOUTUBE_API_KEY`: Your YouTube Developer API Key.
- `CHANNEL_ID`: `UCnN6Q5H7b8r8WjD757mR9yQ` (Optional, defaults to this anyway).

### Step 2: Push to GitHub
Commit your changes and push to the `main` branch. 
```bash
git add .
git commit -m "feat: initial commit of Virtual Gyans portal site"
git push origin main
```
This triggers the Action. It compiles the static data, builds React, and deploys it to the `gh-pages` branch.

### Step 3: Configure Domain in GitHub Settings
1. Go to your repository settings under the **Pages** tab.
2. Under "Build and deployment", select **Deploy from a branch** and choose `gh-pages` branch, directory `/ (root)`.
3. In "Custom domain", write `www.virtualgyans.me` and save it. (Since the `CNAME` file is already in our repository, this setting will remain active on all subsequent commits).

### Step 4: Configure DNS Records
Configure your DNS provider (e.g. GoDaddy, Namecheap, Google Domains) for `virtualgyans.me`:
- **A Records** (pointing to GitHub Pages server IPs):
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`
- **CNAME Record** (for `www` subdomain):
  - Points `www` to `<your-github-username>.github.io`

---

## ⚡ Deploying the Python Backend on Vercel (Free)

Vercel provides native support for Python Serverless Functions. Since the project includes a `vercel.json` file inside the `backend/` directory, Vercel will build and host your FastAPI app for free.

### Step 1: Connect your Repository to Vercel
1. Go to [Vercel](https://vercel.com) and sign in.
2. Click **Add New** > **Project** and import your GitHub repository.
3. In the project configuration:
   * **Framework Preset**: Select **Other**.
   * **Root Directory**: Click **Edit** and choose the **`backend`** folder.
   * **Environment Variables**: Add your API keys if you want live updates:
     * `YOUTUBE_API_KEY`: Your YouTube Developer API Key.
     * `CHANNEL_ID`: `UCnN6Q5H7b8r8WjD757mR9yQ`
     * `PYO3_USE_ABI3_FORWARD_COMPATIBILITY`: `1` (required for Python 3.14+ dependencies compatibility).

### Step 2: Deploy and Get your API URL
1. Click **Deploy**.
2. Once the build finishes, copy your live backend deployment URL (e.g., `https://virtual-gyans-backend.vercel.app`).

### Step 3: Link Vercel Backend with GitHub Pages Frontend
To configure your static GitHub Pages React site to fetch data from your new Vercel backend dynamically:
1. Go to your GitHub repository > **Settings > Secrets and variables > Actions**.
2. Create a new repository secret:
   * **Name**: `VITE_API_URL`
   * **Value**: Your Vercel URL (e.g., `https://virtual-gyans-backend.vercel.app` - do not add a trailing slash).
3. The next time the GitHub Actions deployment workflow runs, it will inject your Vercel backend URL into the React build, enabling real-time features like persistent user-submitted interview logs!
