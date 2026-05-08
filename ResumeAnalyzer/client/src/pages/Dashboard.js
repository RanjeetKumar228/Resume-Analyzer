import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { resumeAPI } from '../services/api';

function Dashboard() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const response = await resumeAPI.getResumes();
      setResumes(response.data.resumes || []);
    } catch (error) {
      console.error('Fetch resumes error:', error);
      setMessage({ type: 'error', text: 'Failed to load resumes' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await resumeAPI.deleteResume(id);
        setResumes(resumes.filter(r => r.id !== id));
        setMessage({ type: 'success', text: 'Resume deleted successfully' });
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to delete resume' });
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-3">
          <Sidebar />
        </div>
        <div className="col-md-9">
          <h2>Dashboard</h2>
          <p className="text-muted">View your uploaded resumes and analysis results here.</p>

          {message.text && (
            <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
              {message.text}
              <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })}></button>
            </div>
          )}

          {!loading && resumes.length === 0 ? (
            <div className="alert alert-info mt-4">
              <h5>No resumes uploaded yet</h5>
              <p>Get started by uploading your first resume for analysis.</p>
              <button className="btn btn-primary" onClick={() => navigate('/upload')}>
                Upload Resume
              </button>
            </div>
          ) : (
            <div className="row mt-4 justify-content-center">
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                resumes.map((resume) => (
                  <div key={resume.id} className="col-md-6 mb-4">
                    <div className="card h-100">
                      <div className="card-header bg-primary text-white">
                        <h5 className="card-title mb-0">{resume.filename}</h5>
                      </div>
                      <div className="card-body">
                        <p className="card-text">
                          <strong>Uploaded:</strong> {new Date(resume.uploadedAt).toLocaleDateString()}
                        </p>
                        <p className="card-text">
                          <strong>ATS Score:</strong> <span className="badge bg-success">{resume.analysis.atsScore}/100</span>
                        </p>
                        {resume.analysis.skills && (
                          <p className="card-text">
                            <strong>Skills Found:</strong> {resume.analysis.skills.length}
                          </p>
                        )}
                        {resume.analysis.education && (
                          <p className="card-text">
                            <strong>Education:</strong> {resume.analysis.education.length}
                          </p>
                        )}
                      </div>
                      <div className="card-footer">
                        <button
                          className="btn btn-sm btn-info me-2"
                          onClick={() => navigate(`/resume/${resume.id}`)}
                        >
                          View Details
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(resume.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
