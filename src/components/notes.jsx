
import { useState, useEffect, useMemo } from "react";
import "./notes.css";
import { timeAgo } from "../utils.js";

import Dropdown from "./dropdown";

export default function NotesPanel({
  project,
  notes,
  theme,
  handleThemeIndex
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
  
  const handleChangeTitle = (newTitle) => {
    setProject(prev => ({
      ...prev,
      title: newTitle
    }));
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
            initValue={project.title}
            onChangeTitle={handleChangeTitle}
          />
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
          Created [ {formatDate(project.datetimecreated)} ] 
          [ {timeAgo(project.datetimecreated)} ] 
          <i className='bi bi-dot'></i> 
          Modified [ {formatDate(project.datetimemodified)} ] 
          [ {timeAgo(project.datetimemodified)} ]
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
        {filteredNotes.map(n => (
          <NoteCard
            key={n.id}
            note={n}
            text={highlightSearchTerms(n.text)}
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
  note,
  text
}) {
  return(
    <div className='note-card'>
      <button className='note-card-drag'>
        <i className='bi bi-grip-vertical'></i>
      </button>
      <div className="note-card-text">{text}</div>
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

function ProjectTitleInput({
  initValue = "Empty Title",
  onChangeTitle
}) {
  const [value, setValue] = useState(initValue);

  useEffect(() => {
    setValue(initValue);
  }, [initValue]);

  function handleChange(e) {
    const newValue = e.target.value;
    setValue(newValue);
    onChangeTitle?.(newValue);
  }

  return (
    <input
      className='content-heading'
      value={value}
      onChange={handleChange}
    />
  );
}
