
import { useState, useEffect, useMemo } from "react";
import "./projects.css";
import { timeAgo, getGracePeriod } from "../utils/dates.js";

import Dropdown from "./dropdown";

export default function ProjectsPanel({
  project,
  projects,
  notesByProject,
  selectProject,
  timer,
  gracePeriodDays,
  addProject,
}) {
  const [newProject, setNewProject] = useState("");

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
      return p.text.toLowerCase().includes(search.toLowerCase());
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
      // pinned to top
      if (a.ispinned && !b.ispinned) return -1;
      if (!a.ispinned && b.ispinned) return 1;

      // normal sort
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

  function handleAddProject() {
    const txt = newProject.trim();
    if (!txt) return;
    addProject(txt, true);
    setNewProject("");
  }

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
              selectedId={project.id}
              project={p}
              len={notesByProject[p.id] || 0}
              mod={timeAgo(p.datetimemodified)}
              selectProject={selectProject}
              timer={timer}
              gracePeriodDays={gracePeriodDays}
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

      <form
        className='projects-footer'
        onSubmit={(e) => {
          e.preventDefault();
          handleAddProject();
        }}
      >
        <input
          type='text'
          placeholder='New project...'
          value={newProject}
          onChange={(e) => setNewProject(e.target.value)}
        />

        <button type="submit">
          <i className='bi bi-plus-circle'></i>
        </button>
      </form>
    </div>
  );
}

function ProjectCard({
  project,
  selectedId,
  len,
  mod,
  selectProject,
  timer,
  gracePeriodDays,
}) {
  const timeLeft = getGracePeriod(
    project.datetimedeleted,
    gracePeriodDays,
    timer
  );

  return (
    <div
      className={`project-card ${project.id === selectedId ? 'selected' : ''}`}
      onClick={() => selectProject(project)
    }>
      <div className={`project-card-header ${project.isarchived ? "cross-out" : ""}`}>
        <span>{project.text}</span>
        {project.isstarred && <i className="bi bi-star-fill"></i>}
        {project.ispinned && <i className="bi bi-pin-angle-fill"></i>}
      </div>
      {
        project.isdeleted ?
        (
          <div className="project-card-footer">
            Grace Period = {timeLeft}
          </div>
        ) :
        (
          <div className={`project-card-footer ${project.isarchived ? "cross-out" : ""}`}>
            {len} notes 
            <i className='bi bi-dot'></i> 
            Modified {mod}
          </div>
        )
      }
    </div>
  );
}
