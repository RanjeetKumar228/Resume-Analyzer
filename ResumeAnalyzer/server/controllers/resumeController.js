const Resume = require('../models/Resume');
const { analyzeResume } = require('../utils/atsAnalyzer');
const fs = require('fs');
const path = require('path');

// Extract text from PDF (basic implementation)
const extractTextFromPDF = async (filePath) => {
  try {
    const pdfParse = require('pdf-parse');
    const fileBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(fileBuffer);
    return pdfData.text;
  } catch (error) {
    console.error('PDF parsing error:', error.message);
    // Fallback: return filename as text
    return fs.readFileSync(filePath, 'utf-8');
  }
};

// Extract text from DOCX (basic implementation)
const extractTextFromDOCX = async (filePath) => {
  try {
    const mammoth = require('mammoth');
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    console.error('DOCX parsing error:', error.message);
    return '';
  }
};

// Extract text from file based on type
const extractTextFromFile = async (filePath, mimeType) => {
  if (mimeType === 'application/pdf') {
    return await extractTextFromPDF(filePath);
  } else if (
    mimeType === 'application/msword' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return await extractTextFromDOCX(filePath);
  }
  return '';
};

// Upload and analyze resume
exports.uploadResume = async (req, res) => {
  try {
    // Validate file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Validate user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const filePath = req.file.path;
    const fileName = req.file.originalname;
    const mimeType = req.file.mimetype;

    // Extract text from the uploaded file
    let resumeText = '';
    try {
      resumeText = await extractTextFromFile(filePath, mimeType);
    } catch (error) {
      console.error('Text extraction error:', error);
      resumeText = '';
    }

    // Analyze the resume
    const analysis = analyzeResume(resumeText);

    // Save resume to database
    const resume = new Resume({
      user: req.user.id,
      filename: fileName,
      analysis: {
        ...analysis,
        rawText: resumeText,
        uploadedAt: new Date()
      }
    });

    await resume.save();

    // Clean up uploaded file (optional - keep if you want to store files)
    // fs.unlinkSync(filePath);

    res.status(201).json({
      message: 'Resume uploaded and analyzed successfully',
      resume: {
        id: resume._id,
        filename: resume.filename,
        uploadedAt: resume.uploadedAt,
        analysis: {
          atsScore: analysis.atsScore,
          skills: analysis.skills,
          education: analysis.education,
          experience: analysis.experience,
          projects: analysis.projects,
          suggestions: analysis.suggestions,
          missingKeywords: analysis.missingKeywords
        }
      }
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({ message: 'Error uploading resume', error: error.message });
  }
};

// Get all resumes for logged-in user
exports.getResumes = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const resumes = await Resume.find({ user: req.user.id }).sort({ uploadedAt: -1 });

    const formattedResumes = resumes.map(resume => ({
      id: resume._id,
      filename: resume.filename,
      uploadedAt: resume.uploadedAt,
      analysis: {
        atsScore: resume.analysis.atsScore,
        skills: resume.analysis.skills,
        education: resume.analysis.education,
        experience: resume.analysis.experience,
        projects: resume.analysis.projects,
        suggestions: resume.analysis.suggestions,
        missingKeywords: resume.analysis.missingKeywords
      }
    }));

    res.status(200).json({ resumes: formattedResumes });
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ message: 'Error fetching resumes', error: error.message });
  }
};

// Get single resume
exports.getResume = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const resume = await Resume.findById(req.params.id);

    if (!resume || resume.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.status(200).json({
      resume: {
        id: resume._id,
        filename: resume.filename,
        uploadedAt: resume.uploadedAt,
        analysis: resume.analysis
      }
    });
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ message: 'Error fetching resume', error: error.message });
  }
};

// Delete resume
exports.deleteResume = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const resume = await Resume.findById(req.params.id);

    if (!resume || resume.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    await Resume.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ message: 'Error deleting resume', error: error.message });
  }
};
