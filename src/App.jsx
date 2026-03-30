
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
      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
      {/* <ProjectsPage /> */}
      <NotesPage />
      <NotesSidebar />
    </div>
  );
}

function NotesSidebar() {
  return (
    <div className='sidebar'>
      //
    </div>
  );
}

function Navbar({darkMode, toggleTheme}) {
  return (
    <NotesNavbar
      darkMode={darkMode}
      toggleTheme={toggleTheme}
    />
  );
}

function ProjectsNavbar({darkMode, toggleTheme}) {
  return (
    <div className='navbar'>
      <VerticalSpacer />
      
      <ThemeButton
        darkMode={darkMode}
        toggleTheme={toggleTheme}
      />

      <NavbarButton
        icon={"gear"}
        iconAlt={"gear-fill"}
        label={"Settings"}
      />
      <NavbarButton
        icon={"arrow-left-square"}
        iconAlt={"arrow-left-square-fill"}
        label={"Quit"}
      />
    </div>
  );
}

function NotesNavbar({darkMode, toggleTheme}) {
  return (
    <div className='navbar'>
      <NavbarButton
        icon={"file-text"}
        iconAlt={"file-text-fill"}
        label={"Projects"}
      />
      
      <div style={{ flexGrow: 1 }}></div>
      
      <ThemeButton
        darkMode={darkMode}
        toggleTheme={toggleTheme}
      />

      <NavbarButton
        icon={"gear"}
        iconAlt={"gear-fill"}
        label={"Settings"}
      />
      <NavbarButton
        icon={"arrow-left-square"}
        iconAlt={"arrow-left-square-fill"}
        label={"Quit"}
      />
    </div>
  );
}

function NavbarButton({icon, iconAlt, label}) {
  const [hovered, setHovered] = useState(false);
  const iconClass = `bi bi-${hovered ? iconAlt : icon}`;

  return (
    <button
      className='navbar-button'
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <i className={iconClass}></i>
      <span>{label}</span>
    </button>
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

function NotesPage() {
  return (
    <div className='page'>
      <div className='notes-list'>
        <NoteCard />
      </div>
    </div>
  );
}

function NoteCard() {
  return (
    <div className='note-card'>
      <div className='note-text'>
        My note.
      </div>
    </div>
  );
}

function ProjectsPage() {
  return (
    <div className='page'>
      <div className='project-list'>
        <ProjectCard
          txt={'Project Title'}
          cnt={0}
          crtd={'dd/mm/yyyy'}
          mdfd={'dd/mm/yyyy'}
        />
      </div>
      <button className='floating-button'>
        <i className='bi bi-plus-circle'></i>
      </button>
    </div>
  );
}

function ProjectCard({txt, cnt, crtd, mdfd}) {
  const cardText = txt || 'Project Title';
  const count = cnt || 0;
  const cardCreated = crtd || 'dd/mm/yyyy';
  const cardModified = mdfd || 'dd/mm/yyyy';

  return (
    <div className='project-card'>
      <div className='project-card-title'>{cardText}</div>
      <div className='project-card-date'>Note: {count}</div>
      <div className='project-card-date'>Created: {cardCreated}</div>
      <div className='project-card-date'>Modified: {cardModified}</div>
    </div>
  );
}

function VerticalSpacer() {
  return (
    <div style={{ flexGrow: 1 }}></div>
  );
}
