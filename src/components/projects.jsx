
import { useState, useEffect } from "react";
import "./projects.css";

import Dropdown from "./dropdown";

export default function ProjectsPanel() {
  const filterOptions = ["All", "Pinned", "Starred", "Archived"];
  const sortOptions = ["Modified", "Created", "Size"];
  const [sortDir, setSortDir] = useState(true);

  const handleSortDir = (value) =>{
    setSortDir(value);
  };

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
        {Array.from({length: 40}).map((_, index) => (
          <ProjectCard key={index} />
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
  txt = "My Project Title",
  len = 0,
  mod = "2h",
  pin = Math.random() < 0.2,
  fav = Math.random() < 0.4,
  arch = Math.random() < 0.2
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
