
import { useState, useEffect } from "react";
import "./notes.css";

import Dropdown from "./dropdown";

export default function NotesPanel({
  project,
  notes,
  theme,
  handleThemeIndex
}) {
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
          <ProjectTitleInput initValue={project.title}/>
          <div style={{flex: 1}}></div>
          <i className='bi bi-dot'></i>
          <IconFillButton
            icon='pin-angle'
            iconAlt='pin-angle-fill'
            classList='content-button'
            startActive={project.ispinned}
          />
          <IconFillButton
            icon='star'
            iconAlt='star-fill'
            classList='content-button'
            startActive={project.isstarred}
          />
          <i className='bi bi-dot'></i>
          <IconFillButton
            icon='archive'
            iconAlt='archive-fill'
            classList='content-button'
            startActive={project.isarchived}
          />
          <IconFillButton
            icon='trash3'
            iconAlt='trash3-fill'
            classList='content-button'
          />
          <i className='bi bi-dot'></i>
          <ThemeButton
            theme={theme}
            handleThemeIndex={handleThemeIndex}
          />
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
        {notes.map(n => (
          <NoteCard
            key={n.id}
            note={n}
          />
        ))}
      </div>

      <div className='content-footer'>
        <input type='text' placeholder='New note...'></input>
        <button><i className='bi bi-plus-circle'></i></button>
      </div>
    </div>
  );
}

function NoteCard({
  note
}) {
  return(
    <div className='note-card'>
      <button className='note-card-drag'>
        <i className='bi bi-grip-vertical'></i>
      </button>
      <div className='note-card-text'>{note.text}</div>
      <div className='note-card-reactions-container'>
        <div className='note-card-id'>{note.id}</div>
        <IconFillButton
          icon='pin-angle'
          iconAlt='pin-angle-fill'
          classList='note-card-reaction'
          startActive={note.ispinned}
        />
        <IconFillButton
          icon='star'
          iconAlt='star-fill'
          classList='note-card-reaction'
          startActive={note.isstarred}
        />
      </div>
    </div>
  );
}

function ThemeButton({theme, handleThemeIndex}) {
  const [hovered, setHovered] = useState(false);
  let iconClass = `bi bi-${hovered ? theme.iconAlt : theme.icon}`;

  return (
    <button
      className='content-button'
      onClick={() => handleThemeIndex()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <i className={iconClass}></i>
    </button>
  );
}

function IconFillButton({
  icon = "star",
  iconAlt = "starFill",
  classList = "",
  startActive = false,
}) {
  const [active, setActive] = useState(startActive);

  useEffect(() => {
    setActive(startActive);
  }, [startActive]);

  return (
    <button
      className={`${classList} ${active ? 'active' : ''}`}
      onClick={() => setActive(!active)}
    >
      <i className={`bi bi-${active ? iconAlt : icon}`}></i>
    </button>
  );
}

function ProjectTitleInput({initValue}) {
  return (
    <input
      className='content-heading'
      value={initValue}>
    </input>
  );
}
