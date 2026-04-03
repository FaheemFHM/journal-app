
export function editProject(pId, value, projects, setProjects) {
  const newDate = new Date().toISOString();

  setProjects(prev => {
    // get project to update
    const prevState = [...prev];
    const projectToUpdate = prevState.find(p => p.id === pId);
    const trimmed = value.trim();

    // if it doesn't exist, or the value hasn't changed, return
    if (!projectToUpdate) return prev;
    if (!trimmed) return prev;
    if (projectToUpdate.text === trimmed) return prev;

    // update the project in the list/state
    const newState = prevState.map(p =>
      p.id === pId ? {
        ...p,
        text: trimmed,
        datetimemodified: newDate
      } : p
    );

    // backend update
    fetch(`http://localhost:5000/projects/${pId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: trimmed,
        datetimemodified: newDate
      })
    }).catch(() => {
      setProjects(prevState);
    });

    return newState;
  });
}

export function editNote(nId, value, notes, setNotes, projects, setProjects) {
  const newDate = new Date().toISOString();

  setNotes(prev => {
    const prevState = [...prev];
    const noteToUpdate = prevState.find(n => n.id === nId);
    const trimmed = value.trim();

    if (!noteToUpdate) return prev;
    if (!trimmed) return prev;
    if (noteToUpdate.text === trimmed) return prev;

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
    const projectId = noteToUpdate.project_id;
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
