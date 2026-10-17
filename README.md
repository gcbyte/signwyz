# SignWyz

**Live app → [signwyz.vercel.app](https://signwyz.vercel.app)**

SignWyz is an AI-powered web application that helps users understand legal documents — contracts, terms and conditions, privacy policies, and more.

Rather than only flagging risks, SignWyz also surfaces favorable terms and benefits, giving users a complete picture of any document before they sign or agree.

---

## Features

- User registration and sign in (email/password and Google OAuth)
- JWT-based authentication with session expiry handling
- Upload documents (PDF, DOCX, TXT) or paste text directly
- Client-side document parsing — no raw file sent to the server
- AI-powered analysis using Google Gemini
- Risk findings ranked as high, medium, or low
- Identification of favorable terms and benefits
- Explanation of why each finding matters and what to review
- Full document history with saved analyses
- Deep-linkable analysis results (`/analysis/:id`)
- Password reset via email (powered by Resend)
- User profile management with avatar upload and removal
- Dark mode
- Responsive design — works on mobile and desktop

---

## How It Works

1. Create an account or sign in.
2. Choose a document type: Contract, Terms & Conditions, Privacy Policy, or Other.
3. Upload a file or paste your document text.
4. SignWyz extracts the text client-side and sends it to the backend for AI analysis.
5. Google Gemini identifies risks, obligations, and favorable terms.
6. Results are presented as ranked findings — each with a plain-English explanation and review guidance.
7. Analyses are saved to your account and accessible any time from the Documents page.

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite | Build tool and dev server |
| React Router v7 | Client-side routing |
| PDF.js | Client-side PDF text extraction |
| Mammoth | Client-side DOCX text extraction |
| Google OAuth (`@react-oauth/google`) | Google sign-in |
| Lucide React | Icons |

### Backend

| Technology | Purpose |
|---|---|
| Python / FastAPI | REST API |
| SQLAlchemy | ORM |
| PostgreSQL (production) / SQLite (dev) | Database |
| python-jose | JWT token generation and validation |
| bcrypt | Password hashing |
| google-genai | Google Gemini AI integration |
| Resend | Transactional email (password reset) |
| uvicorn | ASGI server |

### AI

- Google Gemini via the `google-genai` SDK

### Hosting

| Layer | Platform |
|---|---|
| Frontend | [Vercel](https://signwyz.vercel.app) |
| Backend | [Render](https://render.com) |
| Database | [Neon](https://neon.tech) (PostgreSQL) |

---

## Project Structure

```text
signwyz/
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   │   ├── auth.py         # Sign up, sign in, Google OAuth, password reset
│   │   │   ├── documents.py    # Document upload and analysis endpoints
│   │   │   └── users.py        # User profile and avatar endpoints
│   │   ├── services/
│   │   │   ├── ai_service.py   # Google Gemini integration
│   │   │   └── email_service.py # Resend email integration
│   │   ├── config.py           # Environment variable config
│   │   ├── database.py         # SQLAlchemy setup
│   │   ├── dependencies.py     # Auth dependency injection
│   │   ├── models.py           # Database models
│   │   ├── schemas.py          # Pydantic request/response schemas
│   │   └── security.py         # Password hashing and JWT utilities
│   ├── requirements.txt
│   └── uploads/                # Avatar file storage
├── public/
├── src/
│   ├── components/
│   │   ├── ErrorBoundary.jsx
│   │   ├── GoogleAuthButton.jsx  # Shared Google OAuth button
│   │   └── Navbar.jsx
│   ├── context/
│   │   └── AuthContext.jsx     # Auth state, current user, login/logout
│   ├── pages/
│   │   ├── Analysis.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Documents.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── LandingPage.jsx
│   │   ├── NotFound.jsx
│   │   ├── Profile.jsx
│   │   ├── ResetPassword.jsx
│   │   ├── SignIn.jsx
│   │   └── SignUp.jsx
│   ├── utils/
│   │   └── fileParser.js       # PDF, DOCX, and plain-text extraction
│   ├── api.js                  # Centralised fetch wrapper
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
└── README.md
```

---

## Running Locally

### Prerequisites

- Node.js 18+
- Python 3.10+
- A Google Gemini API key
- A Google OAuth client ID (for Google sign-in)
- A Resend API key (for password reset emails)

### Frontend

From the project root:

```bash
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`.

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The backend runs at `http://localhost:8000`.

### Environment Variables

#### Frontend (`/.env`)

```env
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

#### Backend (`/backend/.env`)

```env
DATABASE_URL=sqlite:///./signwyz.db
SECRET_KEY=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_CLIENT_ID=your_google_client_id
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=SignWyz <noreply@yourdomain.com>
FRONTEND_URL=http://localhost:5173
```

> Never commit `.env` files or API keys to version control.
>
> If `RESEND_API_KEY` is not set, the backend will print the reset link to the console instead of sending an email — useful for local development.

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/signup` | Register a new user |
| POST | `/auth/signin` | Sign in with email and password |
| POST | `/auth/google` | Sign in or register with Google |
| POST | `/auth/forgot-password` | Request a password reset email |
| POST | `/auth/reset-password` | Reset password using a valid token |
| GET | `/users/me` | Get the current user's profile |
| PATCH | `/users/me` | Update first name and last name |
| POST | `/users/me/avatar` | Upload a profile avatar |
| DELETE | `/users/me/avatar` | Remove the profile avatar |
| POST | `/documents` | Submit a document for analysis |
| GET | `/documents` | List all documents for the current user |
| GET | `/documents/{id}` | Get a single document with its findings |
| GET | `/health` | Health check |

---

## Important Note

SignWyz is an AI-assisted document analysis tool. Its findings are intended to help users understand documents and identify areas that may deserve closer attention. The analysis is not a substitute for professional legal advice.
