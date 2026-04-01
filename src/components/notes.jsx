
import { useState, useEffect } from "react";
import "./notes.css";

import Dropdown from "./dropdown";

export default function NotesPanel({
  theme,
  handleThemeIndex,
  note
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
