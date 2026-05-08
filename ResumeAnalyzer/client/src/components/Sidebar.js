import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="list-group">
      <Link to="/dashboard" className="list-group-item list-group-item-action">Dashboard</Link>
      <Link to="/upload" className="list-group-item list-group-item-action">Upload Resume</Link>
    </div>
  );
}

export default Sidebar;
