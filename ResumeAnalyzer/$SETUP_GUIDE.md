# Resume Upload Feature - Complete Setup Guide

This guide provides step-by-step instructions to set up and run the Resume Upload feature in your MERN Resume Analyzer project.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Database Configuration](#database-configuration)
5. [Running the Application](#running-the-application)
6. [Testing the Feature](#testing-the-feature)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Git

---

## Backend Setup

### Step 1: Install Additional Dependencies

Navigate to the server directory and install required packages:

```bash
cd server
npm install pdf-parse mammoth axios
```

**What these packages do:**
- `pdf-parse`: Extracts text from PDF files
- `mammoth`: Extracts text from DOCX files
- `axios`: HTTP client (already used in the project)

### Step 2: Update package.json Scripts (Optional)

Your `server/package.json` should have these scripts:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### Step 3: Environment Variables

Create a `.env` file in the `server` directory with:

```env
MONGO_URI=mongodb://localhost:27017/resumeanalyzer
JWT_SECRET=your-secret-key-here
PORT=5000
```

**Important**: Replace `your-secret-key-here` with a strong secret key!

### Step 4: Verify Backend Files

Check that these files exist in your server:

```
server/
├── config/
│   └── multerConfig.js          (NEW - Created)
├── middleware/
│   └── authMiddleware.js         (UPDATED)
├── models/
│   ├── Resume.js                 (Already exists)
│   └── User.js                   (Already exists)
├── controllers/
│   └── resumeController.js       (COMPLETELY UPDATED)
├── routes/
│   └── resumeRoutes.js           (UPDATED)
├── utils/
│   └── atsAnalyzer.js            (COMPLETELY UPDATED)
├── uploads/                      (Created automatically)
├── server.js                     (UPDATED)
└── package.json
```

---

## Frontend Setup

### Step 1: Install Additional Dependencies

Navigate to the client directory:

```bash
cd client
npm install axios
```

**Note**: Axios might already be installed. If you get an error, verify it's in `package.json`.

### Step 2: Verify Frontend Files

Check that these files exist:

```
client/
├── src/
│   ├── pages/
│   │   ├── Dashboard.js          (UPDATED)
│   │   └── UploadResume.js       (COMPLETELY REWRITTEN)
│   ├── styles/
│   │   └── UploadResume.css      (NEW - Created)
│   ├── components/
│   │   └── Sidebar.js            (Already exists)
│   └── services/
│       └── api.js                (UPDATED)
└── package.json
```

### Step 3: Verify Routes in App.js

Your `client/src/App.js` should already have these routes:

```javascript
<Route path="/dashboard" element={<Dashboard />} />
<Route path="/upload" element={<UploadResume />} />
```

---

## Database Configuration

### MongoDB Connection

The application uses MongoDB. You can use either:

#### Option 1: Local MongoDB
```bash
# Start MongoDB service
mongod
```

#### Option 2: MongoDB Atlas (Cloud)
Update `.env` in server with your Atlas connection string:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/resumeanalyzer
```

### Create Collections

Collections will be created automatically by Mongoose when you:
1. Register a user
2. Upload a resume

---

## Running the Application

### Terminal 1: Start Backend Server

```bash
cd server
npm start
# or for development with auto-reload:
npm run dev
```

You should see:
```
MongoDB connected
Server running on port 5000
Frontend URL: http://localhost:3000
```

### Terminal 2: Start Frontend Server

```bash
cd client
npm start
```

The frontend will open at `http://localhost:3000`

---

## Testing the Feature

### Complete Workflow:

1. **Register Account**
   - Go to http://localhost:3000/register
   - Create a new account

2. **Login**
   - Go to http://localhost:3000/login
   - Use your credentials

3. **Navigate to Upload**
   - Click "Dashboard" in navbar
   - Click "Upload Resume" in sidebar

4. **Upload Resume**
   - Click the upload box
   - Select a PDF, DOC, or DOCX file (max 5MB)
   - Click "Upload & Analyze Resume"

5. **View Analysis**
   - See ATS Score (0-100)
   - View extracted skills
   - Check education, experience, projects
   - Read improvement suggestions
   - Review missing keywords

6. **Manage Resumes**
   - Go to Dashboard to see all uploads
   - View details or delete resumes

### Test Files

Create or use sample resume files:
- PDF format: Any PDF resume file
- DOCX format: Save a resume as .docx
- DOC format: Legacy Word document

---

## Code Changes Summary

### Backend Changes

#### 1. **authMiddleware.js** - User Authentication
- Extracts user ID from JWT token
- Validates token on protected routes

#### 2. **multerConfig.js** (NEW)
- Configures file upload handling
- Accepts only PDF, DOC, DOCX
- Limits file size to 5MB
- Stores files in `uploads/` directory

#### 3. **atsAnalyzer.js** - Resume Analysis Engine
- `extractEducation()` - Finds education details
- `extractExperience()` - Finds work experience
- `extractSkills()` - Identifies technical and soft skills
- `extractProjects()` - Finds project descriptions
- `calculateATSScore()` - Scores resume 0-100
- `generateSuggestions()` - Provides improvement tips
- `generateMissingKeywords()` - Lists important missing keywords

#### 4. **resumeController.js** - File Processing
- `uploadResume()` - Handles file upload, text extraction, analysis
- `getResumes()` - Retrieves user's resumes
- `getResume()` - Gets single resume details
- `deleteResume()` - Removes a resume

#### 5. **resumeRoutes.js** - API Routes
- POST `/api/resumes/upload` - Upload and analyze
- GET `/api/resumes` - List user resumes
- GET `/api/resumes/:id` - Get resume details
- DELETE `/api/resumes/:id` - Delete resume

#### 6. **server.js** - Server Configuration
- CORS configuration for localhost:3000
- Static file serving for uploads
- Error handling middleware
- Health check endpoint

### Frontend Changes

#### 1. **UploadResume.js** - Complete Component
Features:
- File picker with drag-drop support
- File type validation (PDF, DOC, DOCX)
- File size validation (max 5MB)
- Display selected filename
- Upload button with loading state
- Success/error toast messages
- Display analysis results:
  - ATS Score with color coding
  - Skills badges
  - Education details
  - Experience entries
  - Projects list
  - Missing keywords
  - Improvement suggestions
- Upload another resume option

#### 2. **UploadResume.css** (NEW) - Styling
- Beautiful gradient backgrounds
- Responsive design for mobile
- Card-based layout
- Color-coded scores
- Hover animations
- Professional UI

#### 3. **api.js** - API Service
- Token injection in request headers
- `resumeAPI.uploadResume(file)` - Upload with FormData
- `resumeAPI.getResumes()` - Fetch user resumes
- `resumeAPI.getResume(id)` - Get resume details
- `resumeAPI.deleteResume(id)` - Delete resume

#### 4. **Dashboard.js** - Updated Dashboard
- Fetches and displays all user resumes
- Shows resume preview cards
- ATS Score display
- Skills, education counts
- View details button
- Delete button with confirmation

---

## API Endpoints

### Upload Resume
```
POST /api/resumes/upload
Content-Type: multipart/form-data
Authorization: Bearer {token}

Body:
- resume: File (PDF, DOC, DOCX)

Response:
{
  "message": "Resume uploaded and analyzed successfully",
  "resume": {
    "id": "...",
    "filename": "my-resume.pdf",
    "uploadedAt": "2024-...",
    "analysis": {
      "atsScore": 85,
      "skills": ["React", "Node.js", ...],
      "education": ["Bachelor of Computer Science", ...],
      "experience": ["Worked on...", ...],
      "projects": ["Created...", ...],
      "suggestions": ["Add more skills", ...],
      "missingKeywords": ["Docker", "Kubernetes", ...]
    }
  }
}
```

### Get Resumes
```
GET /api/resumes
Authorization: Bearer {token}

Response:
{
  "resumes": [{...}, {...}]
}
```

### Delete Resume
```
DELETE /api/resumes/{id}
Authorization: Bearer {token}

Response:
{
  "message": "Resume deleted successfully"
}
```

---

## File Structure After Setup

```
ResumeAnalyzer/
├── client/
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── ProtectedRoute.js
│   │   │   ├── ResumeCard.js
│   │   │   └── Sidebar.js
│   │   ├── pages/
│   │   │   ├── Dashboard.js (UPDATED)
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── UploadResume.js (REWRITTEN)
│   │   ├── styles/
│   │   │   └── UploadResume.css (NEW)
│   │   └── services/
│   │       └── api.js (UPDATED)
│   ├── public/
│   │   └── index.html
│   └── package.json
├── server/
│   ├── config/
│   │   └── multerConfig.js (NEW)
│   ├── controllers/
│   │   ├── authController.js
│   │   └── resumeController.js (UPDATED)
│   ├── middleware/
│   │   └── authMiddleware.js (UPDATED)
│   ├── models/
│   │   ├── Resume.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── resumeRoutes.js (UPDATED)
│   ├── utils/
│   │   └── atsAnalyzer.js (UPDATED)
│   ├── uploads/
│   ├── server.js (UPDATED)
│   ├── package.json
│   └── .env
├── README.md
└── SETUP_GUIDE.md (this file)
```

---

## Troubleshooting

### Issue: "Cannot find module 'pdf-parse'"
**Solution**: Install missing packages in server:
```bash
cd server
npm install pdf-parse mammoth
```

### Issue: "CORS error" or "Network error"
**Solution**: 
- Ensure backend is running on port 5000
- Check backend CORS configuration in server.js
- Restart both frontend and backend

### Issue: "File upload fails with 401"
**Solution**:
- Ensure you're logged in
- Check token in localStorage
- Verify authMiddleware is working

### Issue: "Resume text not extracted"
**Solution**:
- Ensure pdf-parse and mammoth are installed
- Try a different resume file
- Check browser console for errors

### Issue: "MongoDB connection error"
**Solution**:
- Start MongoDB: `mongod`
- Or use MongoDB Atlas connection string in .env
- Check MONGO_URI format

### Issue: "Port 5000 already in use"
**Solution**: Change PORT in .env:
```env
PORT=5001
```

### Issue: "Front-end doesn't connect to backend"
**Solution**:
- Check that backend is running on correct port
- Verify baseURL in client/src/services/api.js
- Check CORS settings in server.js

---

## Performance Tips

1. **Resume Parsing**: Larger PDFs may take longer to parse. This is normal.
2. **Database**: Use MongoDB Atlas for cloud hosting
3. **File Storage**: Currently stores files in `server/uploads/`. Consider S3/cloud storage for production.
4. **Token Storage**: Currently uses localStorage. Consider httpOnly cookies for security.

---

## Security Notes

1. Update JWT_SECRET in .env to a strong value
2. Add rate limiting to upload endpoint for production
3. Validate file contents on backend (check for malicious files)
4. Consider virus scanning for production
5. Use HTTPS in production
6. Add file size limits (already set to 5MB)

---

## Next Steps

1. Test the complete workflow
2. Customize ATS analysis rules in atsAnalyzer.js
3. Add more resume fields/sections as needed
4. Deploy to production with proper hosting

---

## Support

If you encounter issues:
1. Check the console for error messages
2. Review the troubleshooting section
3. Verify all files are updated correctly
4. Ensure all dependencies are installed

---

**Setup Complete! Your Resume Upload feature is ready to use.** 🎉
