
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

  // make all IDs numeric and select project
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

  // === edit project/note handlers ===

  function handleToggleProject(pId, field) {
    const newDate = new Date().toISOString();

    setProjects(prev => {
      // get the new value
      const prevState = [...prev];

      const projectToUpdate = prevState.find(p => p.id === pId);
      if (!projectToUpdate) return prev;

      const newValue = !projectToUpdate[field];

      // optimistic ui update
      const newState = prev.map(p =>
        p.id === pId
          ? { ...p, [field]: newValue, datetimemodified: newDate }
          : p
      );

      // backend update
      fetch(`http://localhost:5000/projects/${pId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [field]: newValue,
          datetimemodified: newDate
        })
      }).catch(() => {
        setProjects(prevState);
      });

      return newState;
    });
  }

  function handleToggleNote(nId, field) {
    const newDate = new Date().toISOString();

    setNotes(prev => {
      // get the new value
      const prevState = [...prev];

      const noteToUpdate = prevState.find(n => n.id === nId);
      if (!noteToUpdate) return prev;

      const newValue = !noteToUpdate[field];

      // optimistic ui update
      const newState = prev.map(n =>
        n.id === nId
          ? {
              ...n,
              [field]: newValue,
              datetimemodified: newDate
            }
          : n
      );

      // backend update
      fetch(`http://localhost:5000/notes/${nId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [field]: newValue,
          datetimemodified: newDate
        })
      }).catch(() => {
        setNotes(prevState);
      });

      return newState;
    });
  }

  function handleEditProject(pId, value) {
    const newDate = new Date().toISOString();

    setProjects(prev => {
      // get project to update
      const prevState = [...prev];
      const projectToUpdate = prevState.find(p => p.id === pId);
      const trimmed = value.trim();

      // if it doesn't exist, or the value hasn't changed, return
      if (!projectToUpdate) return prev;
      if (!trimmed) return prev;
      if (projectToUpdate.title === trimmed) return prev;

      // update the project in the list/state
      const newState = prevState.map(p =>
        p.id === pId ? {
          ...p,
          title: trimmed,
          datetimemodified: newDate
        } : p
      );

      // backend update
      fetch(`http://localhost:5000/projects/${pId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: trimmed,
          datetimemodified: newDate
        })
      }).catch(() => {
        setProjects(prevState);
      });

      return newState;
    });
  }

  function handleEditNote(nId, value) {
    const newDate = new Date().toISOString();

    setNotes(prev => {
      const prevState = [...prev];
      const noteToUpdate = prevState.find(n => n.id === nId);
      const trimmed = value.trim();

      if (!noteToUpdate) return prev;
      if (!trimmed) return prev;
      if (noteToUpdate.text === trimmed) return prev;

      const projectId = noteToUpdate.project_id;
      
      const newState = prevState.map(n =>
        n.id === nId
          ? {
              ...n,
              text: trimmed,
              datetimemodified: newDate
            }
          : n
      );

      // update project locally
      setProjects(prevProjects =>
        prevProjects.map(p =>
          p.id === projectId
            ? { ...p, datetimemodified: newDate }
            : p
        )
      );

      // update note backend
      fetch(`http://localhost:5000/notes/${nId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: trimmed,
          datetimemodified: newDate
        })
      }).catch((err) => {
        setNotes(prevState);
        console.error(err);
      });
      
      // update project backend
      fetch(`http://localhost:5000/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          datetimemodified: newDate
        })
      }).catch((err) => {
        console.error(err);
      });

      return newState;
    });
  }

  function handleDeleteNote(nId) {
    if (!window.confirm(
      `Are you sure you would like to delete note ${nId}?`
    )) return;

    const newDate = new Date().toISOString();

    setNotes(prevNotes => {
      // get note to delete
      const noteToDelete = prevNotes.find(n => n.id === nId);
      if (!noteToDelete) return prevNotes;
      const projectId = noteToDelete.project_id;

      // get notes list without the note to delete
      const newNotes = prevNotes.filter(n => n.id !== nId);

      // update project locally
      setProjects(prevProjects =>
        prevProjects.map(p =>
          p.id === projectId ? { ...p, datetimemodified: newDate } : p
        )
      );

      // delete note on backend
      fetch(`http://localhost:5000/notes/${nId}`, { method: "DELETE" })
        .catch(err => {
          console.error(err);
          setNotes(prevNotes);
        });

      // patch project backend
      fetch(`http://localhost:5000/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ datetimemodified: newDate })
      }).catch(err => console.error(err));

      return newNotes;
    });
  }
  
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
        onToggleProject={handleToggleProject}
        onToggleNote={handleToggleNote}
        handleEditProject={handleEditProject}
        handleEditNote={handleEditNote}
        handleDeleteNote={handleDeleteNote}
      />
    </div>
  );
}
