
import { useState, useEffect, useMemo } from "react";
import "./projects.css";
import { timeAgo } from "../utils.js";

import Dropdown from "./dropdown";

export default function ProjectsPanel({
  projects,
  notesByProject,
  handleProject
}) {
  const filterOptions = ["All", "Pinned", "Starred", "Archived", "Deleted"];
  const sortOptions = ["Modified", "Created", "Size"];

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(filterOptions[0]);
  const [sort, setSort] = useState(sortOptions[0]);
  const [sortDir, setSortDir] = useState(false);

  const applyingFilters = search.trim() !== "" || filter !== "All";
  
  const filteredProjects = useMemo(() => {
    // search
    return [...projects].filter(p => {
      if (!search.trim()) return true;
      return p.title.toLowerCase().includes(search.toLowerCase());
    })
    // filter
    .filter(p => {
      if (filter === "All") return !p.isdeleted;
      if (filter === "Pinned") return p.ispinned && !p.isdeleted;
      if (filter === "Starred") return p.isstarred && !p.isdeleted;
      if (filter === "Archived") return p.isarchived && !p.isdeleted;
      if (filter === "Deleted") return p.isdeleted;
      return true;
    })
    // sort
    .sort((a, b) => {
      let valA, valB;

      if (sort === "Modified") {
        valA = new Date(a.datetimemodified);
        valB = new Date(b.datetimemodified);
      } else if (sort === "Created") {
        valA = new Date(a.datetimecreated);
        valB = new Date(b.datetimecreated);
      } else if (sort === "Size") {
        valB = notesByProject[a.id] || 0;
        valA = notesByProject[b.id] || 0;
      }
      
      return sortDir ? valA - valB : valB - valA;
    });
  }, [projects, search, filter, sort, sortDir, notesByProject]);

  const resetFilters = () => {
    setSearch("");
    setFilter(filterOptions[0]);
    setSort(sortOptions[0]);
    setSortDir(false);
  };
    
  return (
    <div className='projects-panel'>
      <div className='projects-header'>
        <div className='projects-heading'>Projects</div>

        <div className="search-box">
          <i className="bi bi-search"></i>
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className='fss-container'>
          <div className='fss-box'>
            <div className='fss-label'>Filter</div>
            <Dropdown options={filterOptions} value={filter} onChange={setFilter} />
          </div>
          <div className='fss-box'>
            <div className='fss-label'>Sort</div>
            <Dropdown options={sortOptions} value={sort} onChange={setSort} />
          </div>
        </div>
        <button
          className='sort-toggle-projects'
          onClick={() => setSortDir(!sortDir)}
        >
          Sort {sortDir ? "Ascending" : "Descending"}
        </button>
        <button
          className='sort-toggle-projects'
          onClick={() => resetFilters()}
        >
          Reset Filters
        </button>
      </div>
      <div className='projects-body'>
        {filteredProjects.length > 0 ? (
          filteredProjects.map(p => (
            <ProjectCard
              key={p.id}
              project={p}
              len={notesByProject[p.id] || 0}
              mod={timeAgo(p.datetimemodified)}
              handleProject={handleProject}
            />
          ))
        ) : (
          <div className="no-projects">
            {
              applyingFilters
                ? "No projects match your current filters"
                : "Please create your first project below"
            }
          </div>
        )}
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
        {project.ispinned && <i className="bi bi-pin-angle-fill"></i>}
        {project.isstarred && <i className="bi bi-star-fill"></i>}
      </div>
      <div className={`project-card-footer ${project.isarchived ? "cross-out" : ""}`}>
        {len} notes 
        <i className='bi bi-dot'></i> 
        Modified {mod}
      </div>
    </div>
  );
}
