# Candidate Registration App (React + Vite)

A multi-step candidate signup form built with React + Vite, React Router,
React Hook Form, Yup validation, and Axios. 

**Now with JWT authentication & resume upload!**

Connects to a **Spring Boot 4.1 + MySQL** REST API backend 
(see the separate `candidate-registration-backend` project).

## Features

- ✅ **JWT Authentication** — Login required, tokens managed securely
- ✅ Multi-step form (Personal → Education → Experience/Review → Submit)
- ✅ Dynamic education & experience fields
- ✅ Fresher/Experienced candidate flows
- ✅ **Resume upload** (PDF, DOC, DOCX — max 5MB per candidate)
- ✅ Client-side + server-side file validation
- ✅ View all registrations & download resumes
- ✅ Delete registrations with confirmation
- ✅ Progress stepper UI
- ✅ Full error handling & loading states

## Setup

```bash
npm install
```

## Run

Terminal 1 (backend — from the `candidate-registration-backend` folder):

```bash
mvn spring-boot:run
```

Backend starts on **https://100.27.185.163:8080/api**

Terminal 2 (frontend — from this folder):

```bash
npm run dev
```

Frontend opens at **https://100.27.185.163:5173**

### Login Credentials

Use the credentials for your existing account.

### Prerequisites

- MySQL running locally (or connection configured in the backend's `application.properties`)
- Java 17+ and Maven for the backend
- Node.js 20.19+ or 22.12+ for the frontend (Node 24 is supported)

## How Authentication Works

1. **Login page** (`/login`) — Enter email & password
2. **Backend validates** credentials against `users` table
3. **JWT token returned** — Valid for 24 hours by default
4. **Token stored** in `localStorage` with key `authToken`
5. **Token auto-appended** to all API requests via `Authorization: Bearer {token}`
6. **Protected routes** redirect to login if token missing/expired
7. **Logout** clears token and redirects to login page

## JWT Features

- **Expiration:** 24 hours (configured in `app.jwt.expiration`)
- **Secret:** Change `app.jwt.secret` in `application.properties` (production)
- **Automatic attachment:** All API requests include `Authorization: Bearer {token}`
- **Auto-refresh on 401:** If token expires, user is redirected to login
- **Secure storage:** Token in localStorage (not ideal for production; consider secure HTTP-only cookies)

## Authentication Flow

```
User → Login Page
  ↓ (enter email/password)
Backend validates in users table
  ↓ (success)
Returns JWT token
  ↓ (stored in localStorage)
Can access /signup, /registrations, etc.
  ↓ (click logout)
Token cleared, redirect to /login
```

## File Structure

```
src/
├── api/candidateApi.js          # API calls with JWT interceptors
├── components/
│   ├── Header.jsx               # Updated with logout dropdown
│   ├── ProtectedRoute.jsx       # Guards authenticated routes (NEW)
│   ├── PersonalDetailsForm.jsx
│   ├── EducationDetailsForm.jsx
│   ├── ExperienceDetailsForm.jsx
│   ├── ReviewDetails.jsx
│   ├── ProgressStepper.jsx
│   ├── FormInput.jsx
│   └── LoadingSpinner.jsx
├── pages/
│   ├── LoginPage.jsx            # NEW — authentication entry point
│   ├── SignupPage.jsx           # Multi-step form
│   ├── SuccessPage.jsx
│   ├── RegistrationsPage.jsx
│   ├── RegistrationDetailsPage.jsx
│   └── HomePage.jsx             (deprecated, kept for reference)
├── validation/validationSchemas.js
├── App.jsx                      # Updated routes + ProtectedRoute
├── main.jsx
└── index.css
```

## Resume Feature

- **Upload during registration:** Resume file validated client-side & sent as multipart
- **Server-side validation:** Spring Boot re-validates file type & size
- **Unique filename storage:** File stored with UUID name on disk
- **One resume per candidate:** Enforced structurally
- **Download:** Click Resume button from registrations list or details page

## Common Issues

### "Login failed — Invalid email or password"
→ Check the email and password for your account.

### "Unauthorized (401)" on API call
→ Token expired or missing. Redirect to login happens automatically.

### "Resume file is required"
→ Make sure you selected a file before clicking Next.

### "Cannot access /signup — redirects to /login"
→ Token invalid or missing. Log in first.

### Backend returns 401 on resume download
→ Ensure Authorization header with Bearer token is sent. Check if endpoint is protected.

## Security Notes

✅ Passwords stored as bcrypt hashes (Spring Security)  
✅ JWT tokens validated on every protected request  
✅ CORS configured for frontend origin only  
✅ Multipart uploads validated (extension + size)  
⚠️ JWT in localStorage (production: use secure HTTP-only cookies)  
⚠️ Change `app.jwt.secret` in production (use strong random key)

## Logging Out

Click the **user email dropdown** in the navbar → **Logout**  
Token is cleared and you're redirected to the login page.

## Test Workflow

1. Open https://100.27.185.163:5173 → redirects to /login
2. Have an existing account available
3. Log in with credentials
4. Redirects to /registrations (empty list)
5. Click **Candidate Registration** link
6. Complete multi-step form with resume
7. Success page with registration ID
8. Back to /registrations, see your record
9. Download resume from table
10. Click username → Logout
11. Back to login page

---

For backend documentation, see the `candidate-registration-backend` project README.

## Admin signup

Admin registration displays a confirmation message without storing a JWT or signing in.
Verify the registered email using its emailed link and wait for the configured approver's
approval. Both steps are required before login; either may happen first. Pending,
unverified, and rejected accounts receive a specific login error from the backend.

## Local and production API environments

- `npm run dev` loads `.env.development` and uses `http://localhost:8080`.
- `npm run build` loads `.env.production` and uses `https://candidate-registration-api-production.up.railway.app`.
- `npm run preview` serves the already-built production bundle, so it uses the production API.

Keep common settings in `.env`. Restart the dev server after editing environment files.
API URLs are embedded at build time; rebuild/redeploy after changing the production URL.
Hosting or shell variables named `VITE_API_BASE_URL` override the files, so set any deployment
variable to the Railway URL or remove it to use `.env.production`.

## Home information page

Home (`/`) displays learning paths, current training schedules, open job opportunities,
previous calendar month's confirmed placements (India timezone), and published reviews.
Training schedules and jobs load independently from the backend, with loading, empty,
and retry states. Closed/expired jobs and completed/cancelled training are excluded.

Confirmed placements and consented reviews can be published in `src/pages/homeContent.js`.
Each placement needs `id`, `name`, `technology`, `company`, `role`, and an ISO `placedOn`
date (`YYYY-MM-DD`). Each review needs `id`, `name`, `role`, `technology`, `quote`, and
`rating` (1–5). These arrays are initially empty because no verified records were supplied.
Rebuild the frontend after editing this content. Placement results are separate from job
openings; no placement numbers or testimonials are inferred from existing registrations.
