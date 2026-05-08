const express = require('express');
const router = express.Router();
const { uploadResume, getResumes, getResume, deleteResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../config/multerConfig');

// Get all resumes for logged-in user
router.get('/', protect, getResumes);

// Get single resume by ID
router.get('/:id', protect, getResume);

// Upload resume with file
router.post('/upload', protect, upload.single('resume'), uploadResume);

// Delete resume
router.delete('/:id', protect, deleteResume);

module.exports = router;
