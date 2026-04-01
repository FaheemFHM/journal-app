
import { useState, useEffect } from "react";
import "./projects.css";

import Dropdown from "./dropdown";

export default function ProjectsPanel() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/projects")
    .then(res => res.json())
    .then(data => setProjects(data))
    .catch(err => console.error(err))
  }, []);

  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/notes")
      .then(res => res.json())
      .then(setNotes)
      .catch(console.error);
  }, []);

  const filterOptions = ["All", "Pinned", "Starred", "Archived"];
  const sortOptions = ["Modified", "Created", "Size"];
  const [sortDir, setSortDir] = useState(true);

  const handleSortDir = (value) =>{
    setSortDir(value);
  };

  function timeAgo(dateString) {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past;

    const minutes = Math.floor(diffMs / (1000 * 60));
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;

    const weeks = Math.floor(days / 7);
    if (weeks < 52) return `${weeks}w`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months}y`;

    const years = Math.floor(days / 365);
    return `${years}y`;
  }
  
  return (
    <div className='projects-panel'>
      <div className='projects-header'>
        <div className='projects-heading'>Projects</div>

        <div className="search-box">
          <i className="bi bi-search"></i>
          <input type="text" placeholder="Search projects..." />
        </div>

        <div className='fss-container'>
          <div className='fss-box'>
            <div className='fss-label'>Filter</div>
            <Dropdown options={filterOptions} />
          </div>
          <div className='fss-box'>
            <div className='fss-label'>Sort</div>
            <Dropdown options={sortOptions} />
          </div>
        </div>
        <button
          className='sort-toggle-projects'
          onClick={() => handleSortDir(!sortDir)}
        >
          Sort {sortDir ? "Ascending" : "Descending"}
        </button>
      </div>
      <div className='projects-body'>
        {projects.map(project => (
          <ProjectCard
            key={project.id}
            txt={project.title}
            mod={timeAgo(project.datetimemodified)}
            pin={project.ispinned}
            fav={project.isstarred}
            arch={project.isarchived}
            len={notes.filter(n => n.project_id === project.id).length}
          />
        ))}
      </div>
      <div className='projects-footer'>
        <input type='text' placeholder='New project...'></input>
        <button><i className='bi bi-plus-circle'></i></button>
      </div>
    </div>
  );
}

function ProjectCard({
  txt = "Empty Project Title",
  len = 0,
  mod = "never",
  pin = 0,
  fav = 0,
  arch = 0
}) {
  return (
    <div className='project-card'>
      <div className={`project-card-header ${arch ? "cross-out" : ""}`}>
        <span>{txt}</span>
        <i className={`bi ${pin ? "bi-pin-angle-fill" : ""}`}></i>
        <i className={`bi ${fav ? "bi-star-fill" : ""}`}></i>
      </div>
      <div className={`project-card-footer ${arch ? "cross-out" : ""}`}>
        {len} notes 
        <i className='bi bi-dot'></i> 
        Modified {mod} ago
      </div>
    </div>
  );
}
