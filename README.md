# Job Portal

Full-stack job matching platform with AI-powered resume-job matching.

## Tech Stack
- **Backend**: Django 5.2, DRF, JWT, MySQL, scikit-learn (TF-IDF matching)
- **Frontend**: React 19, Vite, Tailwind CSS, Chart.js

## Features
- User auth (Candidate/Recruiter/Admin)
- Job posting & search
- Resume upload & parsing
- Job applications with status tracking
- ML-based job-candidate matching
- Dashboards & analytics
- Notifications

## Setup
### Backend
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API
Base: `http://localhost:8000/api/`
- `/jobs/` - Job CRUD
- `/applications/` - Apply to jobs
- `/matching/` - Run matches
- `/resumes/` - Upload resumes

Demo: Processed 30+ resumes, AI matching with cosine similarity.
