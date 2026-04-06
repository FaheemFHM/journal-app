
// import { useState, useEffect } from "react";
// import Dropdown from "./dropdown";
// import "./header.css";
// import { timeAgo } from "../utils/dates.js";

// export default function Header() {
//   return (
//     <div className='content-header'>

//       <ProjectHeader
//         project={project}
//         onToggle={onToggle}
//         onEdit={onEdit}
//         onDelete={onDelete}
//         nextTheme={nextTheme}
//         toggleTheme={toggleTheme}
//       />

//       <GraceLabel
//         show={project.isdeleted}
//         gracePeriod={gracePeriod}
//       />

//       <ProjectMetaData
//         created={project.datetimecreated}
//         modified={project.datetimemodified}
//         notesCount={notes.length}
//       />

//       <NotesFss
//         search={search}
//         setSearch={setSearch}

//         filterOptions={filterOptions}
//         filter={filter}
//         setFilter={setFilter}

//         sortOptions={sortOptions}
//         sort={sort}
//         setSort={setSort}
//         sortDir={sortDir}

//         resetFilters={resetFilters}
//       />

//     </div>
//   );
// }

// function ProjectHeader({
//   project,
  
//   onToggle,
//   onEdit,
//   onDelete,
  
//   nextTheme,
//   toggleTheme
// }) {
//   return(
//     <div className='flexrow content-heading-container'>

//       <ProjectTitleInput
//         value={project.text}
//         projectId={project.id}
//         onEdit={onEdit}
//         active={!project.isdeleted}
//       />

//       <i className='bi bi-dot'></i>

//       {
//         project.isdeleted ? (
//           <RestoreButton
//             pId={project.id}
//             doRestore={onDelete}
//           />
//         ) : (
//           <ProjectToggles
//             pId={project.id}
//             ispinned={project.ispinned}
//             isstarred={project.isstarred}
//             isarchived={project.isarchived}
//             onToggle={onToggle}
//             onDelete={onDelete}
//           />
//         )
//       }

//       <i className='bi bi-dot'></i>

//       <ThemeButton
//         nextTheme={nextTheme}
//         toggleTheme={toggleTheme}
//       />

//     </div>
//   );
// }

// function NotesFss({
//   search, setSearch,
//   filterOptions, filter, setFilter,
//   sortOptions, sort, setSort, sortDir,
//   resetFilters,
// }) {
//   return(
//     <>
//       <div className='flexrow content-fss-labels'>
//         <div>Search</div>
//         <div>Filter</div>
//         <div>Sort</div>
//       </div>
      
//       <div className='flexrow content-fss'>
//         <div className="search-box">
//           <i className="bi bi-search"></i>
//           <input
//             type="text"
//             placeholder="Search notes..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//         <Dropdown
//           options={filterOptions}
//           value={filter}
//           onChange={setFilter}
//         />
//         <Dropdown
//           options={sortOptions}
//           value={sort}
//           onChange={setSort}
//         />
//       </div>

//       <div className="flexrow content-fss">
//         <button
//           onClick={() => resetFilters()}
//         >Reset Filters</button>
//         <button
//           onClick={() => setSortDir(!sortDir)}
//         >{sortDir ? "Sort Descending" : "Sort Ascending"}</button>
//       </div>
//     </>
//   );
// }

// function ProjectMetaData({
//   created,
//   modified,
//   notesCount
// }) {
//   function formatDate(dateString) {
//     const date = new Date(dateString);

//     return date.toLocaleDateString("en-GB", {
//       day: "numeric",
//       month: "short",
//       year: "numeric",
//     });
//   }

//   return (
//     <div className='flexrow content-subheader'>
//       Created [ {formatDate(created)} ] 
//       [ {timeAgo(created)} ] 
//       <i className='bi bi-dot'></i> 
//       Modified [ {formatDate(modified)} ] 
//       [ {timeAgo(modified)} ]
//       <i className='bi bi-dot'></i> 
//       {notesCount} notes
//     </div>
//   );
// }

// function GraceLabel({ show, gracePeriod }) {
//   if (!show) return null;

//   return (
//     <div className='flexrow'>
//       <div className="content-grace-period">
//         Time to deletion = {gracePeriod}
//       </div>
//     </div>
//   );
// }

// function ProjectToggles({
//   pId,
//   ispinned,
//   isstarred,
//   isarchived,
//   onToggle,
//   onDelete
// }) {
//   return (
//     <>
//       <IconFillButton
//         icon='pin-angle'
//         iconAlt='pin-angle-fill'
//         classList='content-button'
//         active={ispinned}
//         onToggle={() => onToggle(pId, "ispinned", true)}
//       />
//       <IconFillButton
//         icon='star'
//         iconAlt='star-fill'
//         classList='content-button'
//         active={isstarred}
//         onToggle={() => onToggle(pId, "isstarred", true)}
//       />
//       <i className='bi bi-dot'></i>
//       <IconFillButton
//         icon='archive'
//         iconAlt='archive-fill'
//         classList='content-button'
//         active={isarchived}
//         onToggle={() => onToggle(pId, "isarchived", true)}
//       />
//       <IconFillButton
//         icon='trash3'
//         iconAlt='trash3-fill'
//         classList='content-button'
//         active={false}
//         onToggle={() => onDelete(pId, true, true)}
//       />
//     </>
//   );
// }

// function RestoreButton({
//   pId,
//   doRestore
// }) {
//   return (
//     <button
//       className="restore-project-button"
//       onClick={() => doRestore(pId, true, false)}
//     >
//       Restore Project
//     </button>
//   );
// }

// function ProjectTitleInput({
//   value = "Empty Title",
//   projectId,
//   onEdit,
//   active
// }) {
//   const [localValue, setLocalValue] = useState(value);

//   // set initial value
//   useEffect(() => {
//     setLocalValue(value);
//   }, [value]);

//   // immediately change ui
//   function handleChange(e) {
//     setLocalValue(e.target.value);
//   }

//   // persist when the user is no longer focued on the input field
//   function handleBlur() {
//     const trimmed = localValue.trim();

//     if (!trimmed) {
//       setLocalValue(value);
//       return;
//     }

//     if (trimmed === value) return;

//     onEdit(projectId, trimmed, true);
//   }

//   return (
//     <input
//       className='content-heading'
//       value={localValue}
//       onChange={handleChange}
//       onBlur={handleBlur}
//       maxLength={24}
//       onKeyDown={e => {
//         if (e.key === "Enter" && !e.shiftKey) {
//           e.preventDefault();
//           e.target.blur();
//         }
//       }}
//       style={{pointerEvents: active ? "auto" : "none"}}
//     />
//   );
// }

// function ThemeButton({nextTheme, toggleTheme}) {
//   const [hovered, setHovered] = useState(false);
//   const iconClass = `bi bi-${hovered ? nextTheme.iconAlt : nextTheme.icon}`;

//   return (
//     <button
//       className='content-button'
//       onClick={() => toggleTheme()}
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//     >
//       <i className={iconClass}></i>
//     </button>
//   );
// }
