
import { useState, useEffect } from "react";
import "./projects.css";
import { timeAgo } from "../utils.js";

import Dropdown from "./dropdown";

export default function ProjectsPanel({
  projects,
  notesByProject,
  handleProject
}) {
  const [sortDir, setSortDir] = useState(true);

  const handleSortDir = (value) => {
    setSortDir(value);
  };

  const filterOptions = ["All", "Pinned", "Starred", "Archived"];
  const sortOptions = ["Modified", "Created", "Size"];
  
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
        {projects.map(p => (
          <ProjectCard
            key={p.id}
            project={p}
            len={notesByProject[p.id] || 0}
            mod={timeAgo(p.datetimemodified)}
            handleProject={handleProject}
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
  project,
  len,
  mod,
  handleProject
}) {
  return (
    <div className='project-card' onClick={() => handleProject(project)}>
      <div className={`project-card-header ${project.isarchived ? "cross-out" : ""}`}>
        <span>{project.title}</span>
        <i className={`bi ${project.ispinned ? "bi-pin-angle-fill" : ""}`}></i>
        <i className={`bi ${project.isstarred ? "bi-star-fill" : ""}`}></i>
      </div>
      <div className={`project-card-footer ${project.isarchived ? "cross-out" : ""}`}>
        {len} notes 
        <i className='bi bi-dot'></i> 
        Modified {mod}
      </div>
    </div>
  );
}
