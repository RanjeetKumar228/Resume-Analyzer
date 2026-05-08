import React from 'react';

function ResumeCard({ resume }) {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">{resume.title || 'Resume'}</h5>
        <p className="card-text">{resume.summary || 'No summary available.'}</p>
      </div>
    </div>
  );
}

export default ResumeCard;
