# Resume Analyzer - MERN Stack

A full-featured resume analyzer built with MongoDB, Express, React, and Node.js. Upload your resume and get instant ATS score, skill analysis, and improvement suggestions.

## Features

✅ **User Authentication** - Register and login with JWT
✅ **Resume Upload** - Upload PDF, DOC, or DOCX files
✅ **ATS Score** - Get a 0-100 score based on ATS compatibility
✅ **Skill Extraction** - Automatically identify technical and soft skills
✅ **Education Parsing** - Extract education details
✅ **Experience Analysis** - Parse work experience entries
✅ **Project Detection** - Identify projects in resume
✅ **Smart Suggestions** - Get personalized improvement tips
✅ **Missing Keywords** - Identify important keywords to add
✅ **Resume Management** - View, manage, and delete uploaded resumes
✅ **Responsive Design** - Works on desktop, tablet, and mobile

## Quick Start

### Prerequisites
- Node.js 14+
- MongoDB (local or Atlas)
- npm or yarn

### Installation & Setup

**Complete setup guide with step-by-step instructions:**
👉 See [SETUP_GUIDE.md](SETUP_GUIDE.md)

**Detailed code changes and implementation:**
👉 See [CODE_CHANGES.md](CODE_CHANGES.md)

### Quick Setup (TL;DR)

**Backend**:
```bash
cd server
npm install pdf-parse mammoth
echo "MONGO_URI=mongodb://localhost:27017/resumeanalyzer
JWT_SECRET=your-secret-key
PORT=5000" > .env
npm start
```

**Frontend**:
```bash
cd client
npm install
npm start
```

Visit http://localhost:3000

## Project Structure

```
ResumeAnalyzer/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.js       (View uploaded resumes)
│   │   │   ├── UploadResume.js    (Upload & analyze)
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Sidebar.js
│   │   │   └── ProtectedRoute.js
│   │   ├── services/
│   │   │   └── api.js             (API calls)
│   │   ├── styles/
│   │   │   └── UploadResume.css
│   │   └── App.js
│   └── package.json
├── server/
│   ├── config/
│   │   └── multerConfig.js        (File upload config)
│   ├── controllers/
│   │   ├── authController.js
│   │   └── resumeController.js    (Upload, analyze, manage)
│   ├── middleware/
│   │   └── authMiddleware.js      (JWT validation)
│   ├── models/
│   │   ├── Resume.js              (Resume schema)
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── resumeRoutes.js        (Resume endpoints)
│   ├── utils/
│   │   └── atsAnalyzer.js         (Resume analysis engine)
│   ├── uploads/                   (Uploaded resumes)
│   ├── server.js
│   ├── package.json
│   └── .env
├── README.md                      (This file)
├── SETUP_GUIDE.md                 (Detailed setup steps)
└── CODE_CHANGES.md                (Detailed changes list)
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Resume Management
- `POST /api/resumes/upload` - Upload and analyze resume
- `GET /api/resumes` - Get all user's resumes
- `GET /api/resumes/:id` - Get single resume details
- `DELETE /api/resumes/:id` - Delete resume

## Resume Analysis Details

### ATS Score (0-100)
Evaluates your resume based on:
- Complete sections (contact, education, experience, skills)
- Number of relevant skills
- Action verbs in descriptions
- Project/certifications
- Formatting and clarity

### Extracted Information
- **Skills**: Technical and soft skills found in resume
- **Education**: Degree, institution, and details
- **Experience**: Job titles, responsibilities, achievements
- **Projects**: Portfolio projects and accomplishments

### Suggestions
- Missing key sections
- Weak language to improve
- Skills to highlight
- Format recommendations

### Missing Keywords
Important industry keywords not found in your resume

## Workflow

1. **Register/Login** → Create account and authenticate
2. **Upload Resume** → Select PDF/DOC/DOCX file
3. **Instant Analysis** → Get ATS score and detailed breakdown
4. **Review Results** → Check skills, education, experience extracted
5. **Improve** → Follow suggestions and add missing keywords
6. **Manage** → View, compare, and manage multiple resumes

## Tech Stack

**Frontend**:
- React 18
- React Router DOM
- Axios
- Bootstrap 5
- CSS3 (Responsive design)

**Backend**:
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Multer (File uploads)
- pdf-parse (PDF parsing)
- mammoth (DOCX parsing)

## File Upload Specifications

- **Allowed Formats**: PDF, DOC, DOCX
- **Max File Size**: 5MB
- **Storage**: Server filesystem (`server/uploads/`)
- **Validation**: File type and size checks

## Security Features

- JWT token-based authentication
- Password hashing with bcryptjs
- File type validation
- File size limits
- CORS protection
- User ownership verification for resume access

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Troubleshooting

**Issue**: Backend fails to start
- Check MongoDB is running
- Verify port 5000 is available
- Check .env configuration

**Issue**: File upload fails
- Ensure file is PDF/DOC/DOCX
- Check file size < 5MB
- Verify backend is running

**Issue**: Frontend can't connect to backend
- Ensure backend runs on port 5000
- Check CORS settings
- Verify token is in localStorage

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for complete troubleshooting.

## Performance

- PDF parsing: ~1-3 seconds per file
- Resume analysis: ~0.5 seconds
- Database operations: ~100-500ms
- Frontend rendering: Optimized with React hooks

## Future Enhancements

- [ ] AI-powered skill matching
- [ ] Job description comparison
- [ ] Multiple resume comparison
- [ ] LinkedIn integration
- [ ] Export analysis as PDF
- [ ] Resume templates
- [ ] Real-time scoring feedback
- [ ] Mock interview questions
- [ ] Career recommendations

## License

MIT

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

## Support

For issues or questions:
1. Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for setup help
2. Review [CODE_CHANGES.md](CODE_CHANGES.md) for implementation details
3. Check console and terminal for error messages
4. Verify all dependencies are installed
