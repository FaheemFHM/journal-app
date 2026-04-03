
import { useState, useEffect } from 'react';
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

  // === theme controls ===

  const {nextTheme, toggleTheme} = useTheme();

  // === load full projects list ===

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/projects")
    .then(res => res.json())
    .then(data => setProjects(
      data.map(n => ({
        ...n,
        id: Number(n.id)
      }))
    ))
    .catch(err => console.error(err))
  }, []);

  const [project, setProject] = useState({});

  // make all IDs numeric and select project
  function selectProject(newProject) {
    setProject({
      ...newProject,
      id: Number(newProject.id)
    });
  }

  // set default selected project
  useEffect(() => {
    if (projects.length < 1) return;

    // ignore deleted projects
    const activeProjects = projects.filter(p => !p.isdeleted);

    const earliestProject = activeProjects.reduce((earliest, prj) => {
      const mod = new Date(prj.datetimemodified);
      const old = new Date(earliest.datetimemodified);
      return mod > old ? prj : earliest;
    }, activeProjects[0]); // start with first elem as earliest
    
    setProject(earliestProject);
  }, [projects]);

  // === load full notes list ===

  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/notes")
      .then(res => res.json())
      .then(data => setNotes(
        // make all IDs numeric
        data.map(n => ({
          ...n,
          project_id: Number(n.project_id)
        }))
      ))
      .catch(console.error);
  }, []);

  const filteredNotes = project?.id
    ? notes.filter(n => n.project_id === project.id)
    : [];

  // reduce takes an array and reduces it into a single value
  // array.reduce((accumulator, currentValue) => { ... }, initialValue)
  // acc: accumulator = iteration counter
  // n: current element of array being processed
  // reduce returns the final accumulator object
  // acc has signature: {key=project_id, value=note_count}
  const notesByProject = notes.reduce((acc, n) => {
    acc[n.project_id] = (acc[n.project_id] || 0) + 1;
    return acc;
  }, {});

  // === CRUD project/note handlers ===

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
    if (isProject){
      deleteProject(xId, doDelete, projects, setProjects);
    } else{
      deleteNote(xId, notes, setNotes, setProjects);
    }
  }
  
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
