
import { useState, useEffect, act } from 'react';
import './App.css';

import ProjectsPanel from "./components/projects";
import NotesPanel from "./components/notes";

import { isExpired } from "./utils/dates";
import { toggleProjectIcon, toggleNoteIcon } from "./utils/handleToggle";
import { editProject, editNote } from "./utils/handleEdit";
import {
  deleteProject,
  deleteNote,
  deleteAllExpired
} from "./utils/handleDelete";

import useTimer from "./utils/useTimer";
import useTheme from "./utils/useTheme";

export default function App() {

  // === misc ===

  const timer = useTimer();
  const gracePeriodDays = 3;

  const {nextTheme, toggleTheme} = useTheme();

  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(null);
  const [notes, setNotes] = useState([]);

  // === main initialisation ===

  useEffect(() => {
    const loadDataSequentially = async () => {
      try {
        // get full lists from backend
        const [projectsList, notesList] = await Promise.all([
          fetchAllProjects(),
          fetchAllNotes()
        ]);
        
        // get expired things
        const expiredProjectIds = new Set(
          projectsList
          .filter(p => p.isdeleted && isExpired(p.datetimedeleted, gracePeriodDays))
          .map(p => p.id)
        );

        const expiredNoteIds = new Set(
          notesList
          .filter(n => expiredProjectIds.has(n.project_id))
          .map(n => n.id)
        );

        // get remaining things
        const remainingProjects = projectsList.filter(
          p => !expiredProjectIds.has(p.id)
        );

        const remainingNotes = notesList.filter(
          n => !expiredNoteIds.has(n.id)
        );

        // hard-delete expired things
        if (expiredNoteIds.size > 0) {
          await deleteAllExpired(expiredNoteIds, "notes");
        }

        if (expiredProjectIds.size > 0) {
          await deleteAllExpired(expiredProjectIds, "projects");
        }
        
        // update ui
        setProjects(remainingProjects);
        setNotes(remainingNotes);
        setFirstProject(remainingProjects);

      } catch (err) {
        console.error("Error loading data:", err);
        setProjects([]);
        setProject(null);
        setNotes([]);
      }
    };

    loadDataSequentially();
  }, []);

  // === fetch handlers ===

  async function fetchAllProjects() {
    // fetch (promise) -> projRes (response) -> projData (json)
    const projRes = await fetch("http://localhost:5000/projects");
    let projData = await projRes.json();
    if (!Array.isArray(projData)) projData = [];
    return projData.map(
      p => ({
        ...p,
        id: Number(p.id)
      })
    );
  }

  async function fetchAllNotes() {
    // fetch (promise) -> noteRes (response) -> noteData (json)
    const noteRes = await fetch("http://localhost:5000/notes");
    let noteData = await noteRes.json();
    if (!Array.isArray(noteData)) noteData = [];
    return noteData.map(
      n => ({
        ...n,
        id: Number(n.id),
        project_id: Number(n.project_id)
      })
    );
  }

  // === CRUD handlers ===

  function handleToggle(xId, field, isProject) {
    if (isProject) {
      toggleProjectIcon(xId, field, projects, setProjects, setProject);
    } else {
      toggleNoteIcon(xId, field, notes, setNotes);
    }
  }

  function handleEdit(xId, value, isProject) {
    if (isProject){
      editProject(xId, value, projects, setProjects);
    } else {
      editNote(xId, value, notes, setNotes, projects, setProjects);
    }
  }

  function handleDelete(xId, isProject, doDelete) {
    if (isProject) {
      deleteProject(xId, doDelete, projects, setProjects, setProject);
    } else {
      deleteNote(xId, notes, setNotes, setProjects);
    }
  }

  // === other functions and values ===

  function setFirstProject(remainingProjects) {
    const activeProjects = remainingProjects.filter(p => !p.isdeleted);
    const defaultProject = getFirstProject(activeProjects);
    setProject(defaultProject);
  }

  function getFirstProject(activeProjects) {
    let defaultProject = null;

    if (activeProjects.length > 0) {
      defaultProject = activeProjects.reduce((latest, prj) => {
        const mod = new Date(prj.datetimemodified);
        const lastMod = new Date(latest.datetimemodified);
        return mod > lastMod ? prj : latest;
      }, activeProjects[0]);
    }

    return defaultProject;
  }

  function selectProject(newProject) {
    setProject(newProject);
  }

  const filteredNotes = project?.id
    ? notes.filter(n => n.project_id === project.id)
    : [];

  const notesByProject = notes.reduce((acc, n) => {
    acc[n.project_id] = (acc[n.project_id] || 0) + 1;
    return acc;
  }, {});
  
  // === return app jsx ===

  return (
    <div className='app'>
      <ProjectsPanel
        projects={projects}
        notesByProject={notesByProject}
        selectProject={selectProject}

        timer={timer}
        gracePeriodDays={gracePeriodDays}
      />
      <NotesPanel
        project={project}
        notes={filteredNotes}
        
        nextTheme={nextTheme}
        toggleTheme={toggleTheme}

        onToggle={handleToggle}
        onEdit={handleEdit}
        onDelete={handleDelete}

        timer={timer}
        gracePeriodDays={gracePeriodDays}
      />
    </div>
  );
}
