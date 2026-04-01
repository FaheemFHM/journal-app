
import { useState, useEffect, act } from 'react';
import './App.css'

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  function handleDarkMode(newMode) {
    setDarkMode(newMode);
  }

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  return (
    <div className='app'>
      <ProjectsPanel />
      <NotesPanel darkMode={darkMode} handleDarkMode={handleDarkMode} />
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

function NotesPanel({darkMode, handleDarkMode}) {
  const filterOptions = ["All", "Pinned", "Starred", "Image", "Title", "Text", "Separator"];
  const sortOptions = ["Modified", "Created", "Custom"];
  const [sortDir, setSortDir] = useState(true);

  const handleSortDir = (value) =>{
    setSortDir(value);
  };
  
  return (
    <div className='notes-panel'>
      <div className='content-header'>
        <div className='flexrow content-heading-container'>
          <div className='content-heading'>
            My Project Title
          </div>
          <i className='bi bi-dot'></i>
          <IconFillButton icon='pin-angle' iconAlt='pin-angle-fill' classList='content-button' />
          <IconFillButton icon='star' iconAlt='star-fill' classList='content-button' />
          <i className='bi bi-dot'></i>
          <IconFillButton icon='archive' iconAlt='archive-fill' classList='content-button' />
          <IconFillButton icon='trash3' iconAlt='trash3-fill' classList='content-button' />
          <div style={{flex: 1}}></div>
          <ThemeButton darkMode={darkMode} handleDarkMode={handleDarkMode} />
        </div>
        <div className='flexrow content-subheader'>
          Created [ Jan 15, 2026 ] [ 36 days ago ] 
          <i className='bi bi-dot'></i> 
          Modified [ Feb 27, 2026 ] [ 2 hours ago ]
        </div>
        <div className='flexrow content-fss-labels'>
          <div className='content-fss-label'>Search</div>
          <div className='content-fss-label'>Filter</div>
          <div className='content-fss-label'>Sort</div>
          <button className='sort-toggle-notes' style={{visibility: 'hidden'}} ></button>
        </div>
        <div className='flexrow content-fss'>
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input type="text" placeholder="Search notes..." />
          </div>
          <Dropdown options={filterOptions} />
          <Dropdown options={sortOptions} />
          <button
            className='sort-toggle-notes'
            onClick={() => handleSortDir(!sortDir)}
          >
            <i className={`bi bi-sort-${sortDir ? "up" : "down"}`}></i>
          </button>
        </div>
      </div>
      <div className='content-body'>
        {
          Array.from({length: 100}).map((_, index) => (
            <NoteCard
              key={index}
              id={index}
              text={"This is some note."}
              pin={Math.random() < 0.5}
              fav={Math.random() < 0.5}
            />
          ))
        }
      </div>
      <div className='content-footer'>
        <input type='text' placeholder='New note...'></input>
        <button><i className='bi bi-plus-circle'></i></button>
      </div>
    </div>
  );
}

function NoteCard({
  id = -1,
  text = "",
  pin = false,
  fav = false,
}) {
  return(
    <div className='note-card'>
      <button className='note-card-drag'>
        <i className='bi bi-grip-vertical'></i>
      </button>
      <div className='note-card-text'>{text}</div>
      <div className='note-card-reactions-container'>
        <div className='note-card-id'>{id}</div>
        <IconFillButton
          icon='pin-angle'
          iconAlt='pin-angle-fill'
          classList='note-card-reaction'
          startActive={pin}
        />
        <IconFillButton
          icon='star'
          iconAlt='star-fill'
          classList='note-card-reaction'
          startActive={fav}
        />
      </div>
    </div>
  );
}

function IconFillButton({
  icon = "star",
  iconAlt = "starFill",
  classList = "",
  startActive = false,
}) {
  const [active, setActive] = useState(startActive);

  const handleActive = (value) => {
    setActive(value);
  }

  return (
    <button
      className={`${classList} ${active ? 'active' : ''}`}
      onClick={() => handleActive(!active)}
    >
      <i className={`bi bi-${active ? iconAlt : icon}`}></i>
    </button>
  );
}

function Empty() {
  return (
    <div className='empty'>
      //
    </div>
  );
}

function ThemeButton({ darkMode, handleDarkMode }) {
  const [hovered, setHovered] = useState(false);
  let iconClass = "bi bi-";
  if (hovered) iconClass += darkMode ? "sun-fill" : "moon-fill";
  else iconClass += darkMode ? "sun" : "moon";

  return (
    <button
      className='content-button'
      onClick={() => handleDarkMode(!darkMode)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <i className={iconClass}></i>
    </button>
  );
}

function VerticalSpacer() {
  return (
    <div style={{ flexGrow: 1 }}></div>
  );
}
