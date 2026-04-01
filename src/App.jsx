
import { useState, useEffect } from 'react';
import './App.css';

import ProjectsPanel from "./components/projects";
import NotesPanel from "./components/notes";

export default function App() {

  // === theme controls ===

  const [themeIndex, setThemeIndex] = useState(0);

  const themes = [
    {
      name: "light",
      icon: "sun",
      iconAlt: "sun-fill",
    },
    {
      name: "dark",
      icon: "moon",
      iconAlt: "moon-fill",
    },
  ];
  
  function handleThemeIndex(newIndex = null) {
    setThemeIndex(nextThemeIndex(newIndex));
  }

  function nextThemeIndex(curIndex = null) {
    const t = curIndex || themeIndex;
    return (t + 1 + themes.length) % themes.length;
  }

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      themes[themeIndex].name
    );
  }, [themeIndex]);

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

  // make all IDs numeric
  function handleProject(newProject) {
    setProject({
      ...newProject,
      id: Number(newProject.id)
    });
  }

  // set default project
  useEffect(() => {
    if (projects.length < 1) return;

    const earliestProject = projects.reduce((earliest, prj) => {
      const mod = new Date(prj.datetimemodified);
      const old = new Date(earliest.datetimemodified);
      return mod > old
        ? prj
        : earliest;
    }, projects[0]); // start with first elem as earliest

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

  return (
    <div className='app'>
      <ProjectsPanel
        projects={projects}
        notesByProject={notesByProject}
        handleProject={handleProject}
      />
      <NotesPanel
        project={project}
        notes={filteredNotes}
        theme={themes[nextThemeIndex()]}
        handleThemeIndex={handleThemeIndex}
      />
    </div>
  );
}
