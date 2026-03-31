
import { useState, useEffect } from 'react';
import './App.css'

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  function toggleTheme() {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.setAttribute(
      "data-theme",
      newMode ? "light" : "dark"
    );
  }
  
  return (
    <div className='app'>
      <ProjectsPanel />
      <NotesPanel />
    </div>
  );
}

function Dropdown({ options = [] }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Select");

  useEffect(() => {
    if (options.length > 0) {
      setSelected(options[0]);
    }
  }, [options]);

  const handleSelect = (value) => {
    setSelected(value);
    setOpen(false);
  };

  return (
    <div className="dropdown">
      <div
        className={`dropdown-button ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
      >
        <span>{selected}</span>
        <i className={`bi bi-caret-${open ? "up" : "down"}-fill`}></i>
      </div>

      {open && (
        <div className="dropdown-contents">
          {options.map((option, index) => (
            <div key={index} onClick={() => handleSelect(option)}>
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectsPanel() {
  const filterOptions = ["All", "Pinned", "Favourites", "Archived"];
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
          className='sort-toggle'
          onClick={() => handleSortDir(!sortDir)}
        >
          Sort {sortDir ? "Ascending" : "Descending"}
        </button>
      </div>
      <div className='projects-body'>
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
      </div>
      <div className='projects-footer'>
        <input type='text' placeholder='New project...'></input>
        <button><i className='bi bi-plus-circle'></i></button>
      </div>
    </div>
  );
}

function ProjectCard({
  txt = "",
  len = 0,
  mod = "2h",
  pin = Math.random() < 0.4,
  fav = Math.random() < 0.45,
  arch = Math.random() < 0.2
}) {
  return (
    <div className='project-card'>
      <div className={`project-card-header ${arch ? "cross-out" : ""}`}>
        <span>My Project Title</span>
        <i className={`bi ${pin ? "bi-pin-angle-fill" : ""}`}></i>
        <i className={`bi ${fav ? "bi-star-fill" : ""}`}></i>
      </div>
      <div className={`project-card-footer ${arch ? "cross-out" : ""}`}>
        {len} notes 
        <i className='bi bi-dot'></i> 
        Updated {mod} ago
      </div>
    </div>
  );
}

function NotesPanel() {
  return (
    <div className='notes-panel'>
      //
    </div>
  );
}

function Empty() {
  return (
    <div className='empty'>
      //
    </div>
  );
}

function ThemeButton({ darkMode, toggleTheme }) {
  const [hovered, setHovered] = useState(false);
  let iconClass = "bi bi-";
  if (hovered) iconClass += darkMode ? "moon-fill" : "sun-fill";
  else iconClass += darkMode ? "moon" : "sun";

  return (
    <button
      className='navbar-button'
      onClick={toggleTheme}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <i className={iconClass}></i>
      <span>Theme</span>
    </button>
  );
}

function VerticalSpacer() {
  return (
    <div style={{ flexGrow: 1 }}></div>
  );
}
