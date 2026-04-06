
// --- Toggle a note ---
export function toggleNoteIcon(noteId, field, notes, setNotes) {
  const newDate = new Date().toISOString();

  const note = notes.find(n => n.id === noteId);
  if (!note) return;

  const newValue = !note[field];
  const prevNotes = notes;
  const newNotes = notes.map(n =>
    n.id === noteId
      ? { ...n, [field]: newValue, datetimemodified: newDate }
      : n
  );

  // optimistic update
  setNotes(newNotes);

  // backend update
  fetch(`http://localhost:5000/notes/${noteId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      [field]: newValue,
      datetimemodified: newDate
    })
  }).catch(() => {
    // rollback if backend fails
    setNotes(prevNotes);
  });
}

// --- Toggle a project ---
export function toggleProjectIcon(projectId, field, projects, setProjects, setProject) {
  const newDate = new Date().toISOString();

  const project = projects.find(p => p.id === projectId);
  if (!project) return;

  const newValue = !project[field];
  const prevProjects = projects;
  const newProjects = projects.map(p =>
    p.id === projectId
      ? { ...p, [field]: newValue, datetimemodified: newDate }
      : p
  );

  // optimistic update
  setProjects(newProjects);
  setProject(newProjects.find(p => p.id === projectId));

  // backend update
  fetch(`http://localhost:5000/projects/${projectId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      [field]: newValue,
      datetimemodified: newDate
    })
  }).catch(() => {
    // rollback if backend fails
    setProjects(prevProjects);
    setProject(prevProjects.find(p => p.id === projectId));
  });
}
