
import { useState, useEffect, act } from 'react';
import './App.css';

import ProjectsPanel from "./components/projects";
import NotesPanel from "./components/notes";

import { toggleIcon } from "./utils/handleToggle";
import { editProject, editNote } from "./utils/handleEdit";
import { deleteProject, deleteNote } from "./utils/handleDelete";

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
        // fetch (promise) -> projRes (response) -> projData (json)
        const projRes = await fetch("http://localhost:5000/projects");
        let projData = await projRes.json();
        if (!Array.isArray(projData)) projData = [];

        // ensure numeric ids
        const projectsList = projData.map(p => ({ ...p, id: Number(p.id) }));
        
        // update projects list ui
        setProjects(projectsList);
        
        // get active projects
        const activeProjects = projectsList.filter(p => !p.isdeleted);

        // pick the most recently modified project on startup
        const defaultProject = getFirstProject(activeProjects);
        setProject(defaultProject);

        // fetch (promise) -> noteRes (response) -> noteData (json)
        const noteRes = await fetch("http://localhost:5000/notes");
        let noteData = await noteRes.json();
        if (!Array.isArray(noteData)) noteData = [];

        // ensure numeric ids
        const notesList = noteData.map(n => ({ ...n, project_id: Number(n.project_id) }));
        
        // update notes list ui
        setNotes(notesList);

      } catch (err) {
        console.error("Error loading data:", err);
        setProjects([]);
        setProject(null);
        setNotes([]);
      }
    };

    loadDataSequentially();
  }, []);

  // === CRUD handlers ===

  function handleToggle(xId, field, isProject) {
    toggleIcon(
      xId,
      field,
      isProject ? "projects" : "notes",
      isProject ? projects : notes,
      isProject ? setProjects : setNotes
    );
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
      
      // const updatedProjects = projects.map(p =>
      //   p.id === xId ? { ...p, isdeleted: doDelete } : p
      // );

      // setProjects(updatedProjects);
      // setProject(refreshSelectedProject(updatedProjects, xId));
    } else {
      deleteNote(xId, notes, setNotes, setProjects);
    }
  }

  // === other functions and values ===

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
