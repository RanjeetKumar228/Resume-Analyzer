import React, { useState, useRef } from 'react';
import { resumeAPI } from '../services/api';
import '../styles/UploadResume.css';

function UploadResume() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      if (allowedTypes.includes(file.type)) {
        if (file.size <= 5 * 1024 * 1024) {
          setSelectedFile(file);
          setMessage({ type: '', text: '' });
        } else {
          setMessage({ type: 'error', text: 'File size must be less than 5MB' });
        }
      } else {
        setMessage({ type: 'error', text: 'Only PDF, DOC, and DOCX files are allowed' });
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Please select a file first' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await resumeAPI.uploadResume(selectedFile);
      const { resume } = response.data;
      
      setAnalysis(resume);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setMessage({ type: 'success', text: 'Resume uploaded and analyzed successfully!' });
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to upload resume. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="upload-resume-container">
      <div className="upload-section">
        <h2>Upload & Analyze Your Resume</h2>
        <p className="subtitle">Get detailed feedback on your resume to improve your ATS score</p>

        {/* Message Display */}
        {message.text && (
          <div className={`alert alert-${message.type}`} role="alert">
            {message.type === 'success' && '✓ '}
            {message.type === 'error' && '✕ '}
            {message.text}
          </div>
        )}

        {/* File Upload Area */}
        <div className="upload-area">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="file-input"
            disabled={loading}
          />

          <div className="upload-box">
            <div className="upload-icon">📄</div>
            <p className="upload-text">
              {selectedFile ? (
                <>
                  <strong>Selected:</strong> {selectedFile.name}
                </>
              ) : (
                <>
                  <strong>Click to browse</strong> or drag and drop
                  <br />
                  <small>PDF, DOC, or DOCX (Max 5MB)</small>
                </>
              )}
            </p>
            <button
              className="btn btn-primary mt-3"
              onClick={handleBrowseClick}
              disabled={loading}
            >
              {selectedFile ? 'Choose Different File' : 'Select File'}
            </button>
          </div>

          <button
            className="btn btn-success btn-lg mt-4"
            onClick={handleUpload}
            disabled={!selectedFile || loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Analyzing...
              </>
            ) : (
              'Upload & Analyze Resume'
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="analysis-section">
          <h3>Resume Analysis Results</h3>

          {/* ATS Score */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="card score-card">
                <div className="card-body text-center">
                  <h5 className="card-title">ATS Score</h5>
                  <div className={`score-display score-${getScoreColor(analysis.analysis.atsScore)}`}>
                    {analysis.analysis.atsScore}
                  </div>
                  <small className="text-muted">Out of 100</small>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card info-card">
                <div className="card-body">
                  <h5 className="card-title">Resume Info</h5>
                  <p><strong>File:</strong> {analysis.filename}</p>
                  <p><strong>Uploaded:</strong> {new Date(analysis.uploadedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          {analysis.analysis.skills && analysis.analysis.skills.length > 0 && (
            <div className="card mb-3">
              <div className="card-header">
                <h5 className="mb-0">Extracted Skills ({analysis.analysis.skills.length})</h5>
              </div>
              <div className="card-body">
                <div className="skills-container">
                  {analysis.analysis.skills.map((skill, index) => (
                    <span key={index} className="badge bg-primary">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Education */}
          {analysis.analysis.education && analysis.analysis.education.length > 0 && (
            <div className="card mb-3">
              <div className="card-header">
                <h5 className="mb-0">Education ({analysis.analysis.education.length})</h5>
              </div>
              <div className="card-body">
                {analysis.analysis.education.map((edu, index) => (
                  <div key={index} className="mb-2">
                    <p className="mb-1">{edu}</p>
                    {index < analysis.analysis.education.length - 1 && <hr />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {analysis.analysis.experience && analysis.analysis.experience.length > 0 && (
            <div className="card mb-3">
              <div className="card-header">
                <h5 className="mb-0">Experience ({analysis.analysis.experience.length})</h5>
              </div>
              <div className="card-body">
                {analysis.analysis.experience.map((exp, index) => (
                  <div key={index} className="mb-2">
                    <p className="mb-1">{exp}</p>
                    {index < analysis.analysis.experience.length - 1 && <hr />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {analysis.analysis.projects && analysis.analysis.projects.length > 0 && (
            <div className="card mb-3">
              <div className="card-header">
                <h5 className="mb-0">Projects ({analysis.analysis.projects.length})</h5>
              </div>
              <div className="card-body">
                {analysis.analysis.projects.map((project, index) => (
                  <div key={index} className="mb-2">
                    <p className="mb-1">{project}</p>
                    {index < analysis.analysis.projects.length - 1 && <hr />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing Keywords */}
          {analysis.analysis.missingKeywords && analysis.analysis.missingKeywords.length > 0 && (
            <div className="card mb-3 border-warning">
              <div className="card-header bg-warning bg-opacity-10">
                <h5 className="mb-0">⚠️ Missing Keywords ({analysis.analysis.missingKeywords.length})</h5>
              </div>
              <div className="card-body">
                <div className="keywords-container">
                  {analysis.analysis.missingKeywords.map((keyword, index) => (
                    <span key={index} className="badge bg-warning text-dark">
                      {keyword}
                    </span>
                  ))}
                </div>
                <p className="mt-3 mb-0 text-muted">
                  <small>Consider adding these keywords to improve your ATS score.</small>
                </p>
              </div>
            </div>
          )}

          {/* Suggestions */}
          {analysis.analysis.suggestions && analysis.analysis.suggestions.length > 0 && (
            <div className="card border-info">
              <div className="card-header bg-info bg-opacity-10">
                <h5 className="mb-0">💡 Suggestions for Improvement</h5>
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  {analysis.analysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="list-group-item">
                      <span className="suggestion-number">{index + 1}</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Upload Another */}
          <div className="mt-4 text-center">
            <button
              className="btn btn-outline-primary"
              onClick={() => {
                setAnalysis(null);
                setSelectedFile(null);
                setMessage({ type: '', text: '' });
              }}
            >
              Upload Another Resume
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to determine score color
function getScoreColor(score) {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'fair';
  return 'poor';
}

export default UploadResume;
