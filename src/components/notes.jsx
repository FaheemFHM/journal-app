
import { useState, useEffect, useMemo, useRef } from "react";
import "./notes.css";
import { timeAgo } from "../utils.js";

import Dropdown from "./dropdown";

export default function NotesPanel({
  project,
  notes,
  theme,
  handleThemeIndex,
  onToggleProject,
  onToggleNote,
  handleEditProject,
  handleEditNote,
  handleDeleteProject,
  handleDeleteNote,
}) {
  const filterOptions = ["All", "Pinned", "Starred"];
  const sortOptions = ["Position", "Modified", "Created", "ID"];

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(filterOptions[0]);
  const [sort, setSort] = useState(sortOptions[0]);
  const [sortDir, setSortDir] = useState(true); // true is ascending

  const filteredNotes = useMemo(() => {
    return [...notes]
    // search
    .filter(n => {
      if (!search.trim()) return true;
      return n.text.toLowerCase().includes(search.toLowerCase());
    })
    // filter
    .filter(n => {
      if (filter === "All") return true;
      if (filter === "Pinned") return n.ispinned;
      if (filter === "Starred") return n.isstarred;
      return true;
    })
    // sort
    .sort((a, b) => {
      let valA, valB;

      if (sort === "Position") {
        valA = a.position;
        valB = b.position;
      } else if (sort === "Modified") {
        valA = new Date(a.datetimemodified);
        valB = new Date(b.datetimemodified);
      } else if (sort === "Created") {
        valA = new Date(a.datetimecreated);
        valB = new Date(b.datetimecreated);
      } else if (sort === "ID") {
        valA = a.id;
        valB = b.id;
      }
      
      return sortDir ? valA - valB : valB - valA;
    });
  }, [notes, search, filter, sort, sortDir]);

  const resetFilters = () => {
    setSearch("");
    setFilter(filterOptions[0]);
    setSort(sortOptions[0]);
    setSortDir(true);
  };

  function formatDate(dateString) {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function highlightSearchTerms(noteText) {
    if (!search) return noteText;

    const regex = new RegExp(`(${search})`, "gi");
    const parts = noteText.split(regex);

    return parts.map((part, index) => 
      part.toLowerCase() === search.toLowerCase() ? (
        <span key={index} className="highlight">{part}</span>
      ) : (
        part
      )
    );
  }
  
  return (
    <div className='notes-panel'>
      <div className='content-header'>
        <div className='flexrow content-heading-container'>
          <ProjectTitleInput
            value={project.title}
            projectId={project.id}
            handleEditProject={handleEditProject}
          />
          <i className='bi bi-dot'></i>
          <IconFillButton
            icon='pin-angle'
            iconAlt='pin-angle-fill'
            classList='content-button'
            active={project.ispinned}
            onToggle={() => onToggleProject(project.id, "ispinned")}
          />
          <IconFillButton
            icon='star'
            iconAlt='star-fill'
            classList='content-button'
            active={project.isstarred}
            onToggle={() => onToggleProject(project.id, "isstarred")}
          />
          <i className='bi bi-dot'></i>
          <IconFillButton
            icon='archive'
            iconAlt='archive-fill'
            classList='content-button'
            active={project.isarchived}
            onToggle={() => onToggleProject(project.id, "isarchived")}
          />
          <IconFillButton
            icon='trash3'
            iconAlt='trash3-fill'
            classList='content-button'
            active={false}
            onToggle={() => handleDeleteProject(project.id)}
          />
          <i className='bi bi-dot'></i>
          <ThemeButton
            theme={theme}
            handleThemeIndex={handleThemeIndex}
          />
        </div>

        <div className='flexrow content-subheader'>
          Created [ {formatDate(project.datetimecreated)} ] 
          [ {timeAgo(project.datetimecreated)} ] 
          <i className='bi bi-dot'></i> 
          Modified [ {formatDate(project.datetimemodified)} ] 
          [ {timeAgo(project.datetimemodified)} ]
          <i className='bi bi-dot'></i> 
          {notes.length} notes
        </div>

        <div className='flexrow content-fss-labels'>
          <div>Search</div>
          <div>Filter</div>
          <div>Sort</div>
        </div>
        
        <div className='flexrow content-fss'>
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Dropdown
            options={filterOptions}
            value={filter}
            onChange={setFilter}
          />
          <Dropdown
            options={sortOptions}
            value={sort}
            onChange={setSort}
          />
        </div>

        <div className="flexrow content-fss">
          <button
            onClick={() => resetFilters()}
          >Reset Filters</button>
          <button
            onClick={() => setSortDir(!sortDir)}
          >{sortDir ? "Sort Descending" : "Sort Ascending"}</button>
        </div>
      </div>

      <div className='content-body'>
        {filteredNotes.length > 0 ? (
          filteredNotes.map(n => (
            <NoteCard
              key={n.id}
              note={n}
              text={highlightSearchTerms(n.text)}
              onToggleNote={onToggleNote}
              onEditNote={handleEditNote}
              onDeleteNote={handleDeleteNote}
            />
          ))
        ) : (
          <div className="no-notes">Please create your first note below...</div>
        )}
        {}
      </div>

      <div className='content-footer'>
        <input type='text' placeholder='New note...'></input>
        <button><i className='bi bi-plus-circle'></i></button>
      </div>
    </div>
  );
}

function NoteCard({
  note,
  text,
  onToggleNote,
  onEditNote,
  onDeleteNote,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [localText, setLocalText] = useState(note.text);
  const textareaRef = useRef(null);

  // update local state
  useEffect(() => {
    setLocalText(note.text);
  }, [note.text]);

  // actually select/focus textarea
  useEffect(() => {
    if (isEditing && textareaRef.current) {
    const el = textareaRef.current;
    if (!el) return;
    el.focus(); // focus textarea
    el.setSelectionRange(el.value.length, el.value.length); // cursor to end
    autoResize();
    }
  }, [isEditing]);

  function autoResize() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto"; // reset
    el.style.height = (el.scrollHeight + 5.5) + "px"; // grow to fit content
  }
  
  function handleSave() {
    const trimmed = localText.trim();

    if (!trimmed || trimmed === note.text) {
      setIsEditing(false);
      setLocalText(note.text);
      return;
    }

    onEditNote(note.id, trimmed);
    setIsEditing(false);
  }

  return(
    <div className='note-card'>
      <button className='note-card-drag'>
        <i className='bi bi-grip-vertical'></i>
      </button>

      {
        isEditing ? (
          <textarea
            ref={textareaRef}
            className="note-card-textarea"
            value={localText}
            onChange={(e) => {
              setLocalText(e.target.value);
              autoResize();
            }}
            onBlur={() => handleSave()}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                e.target.blur();
              }
            }}
          ></textarea>
        ) : (
          <div
            className="note-card-text"
            onClick={() => setIsEditing(true)}
          >{text}</div>
        )
      }

      <div className='note-card-reactions-container'>
        <IconFillButton
          icon='pin-angle'
          iconAlt='pin-angle-fill'
          classList='note-card-reaction'
          active={note.ispinned}
          onToggle={() => onToggleNote(note.id, "ispinned")}
        />
        <IconFillButton
          icon='star'
          iconAlt='star-fill'
          classList='note-card-reaction'
          active={note.isstarred}
          onToggle={() => onToggleNote(note.id, "isstarred")}
        />
      </div>

      <div className='note-card-reactions-container'>
        <div className='note-card-id'>
          {note.id}
        </div>
        <IconFillButton
          icon='trash3'
          iconAlt='trash3-fill'
          classList='note-card-reaction'
          active={false}
          onToggle={() => onDeleteNote(note.id)}
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

function IconFillButton({ icon, iconAlt, classList, active, onToggle }) {
  return (
    <button
      className={`${classList} ${active ? 'active' : ''}`}
      onClick={onToggle}
    >
      <i className={`bi bi-${active ? iconAlt : icon} ${active ? 'active' : ''}`}></i>
    </button>
  );
}

function ProjectTitleInput({
  value = "Empty Title",
  projectId,
  handleEditProject
}) {
  const [localValue, setLocalValue] = useState(value);

  // set initial value
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // immediately change ui
  function handleChange(e) {
    setLocalValue(e.target.value);
  }

  // persist when the user is no longer focued on the input field
  function handleBlur() {
    const trimmed = localValue.trim();

    if (!trimmed) {
      setLocalValue(value);
      return;
    }

    if (trimmed === value) return;

    handleEditProject(projectId, trimmed);
  }

  return (
    <input
      className='content-heading'
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
      maxLength={24}
      onKeyDown={e => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          e.target.blur();
        }
      }}
    />
  );
}
