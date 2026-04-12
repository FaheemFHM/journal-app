
export async function addProject(txt, projects, setProjects, setProject) {
  const newDate = new Date().toISOString();

  const newProject = {
    id: getFirstAvailableId(projects),
    text: txt,
    datetimecreated: newDate,
    datetimemodified: newDate,
    datetimedeleted: null,
    ispinned: false,
    isstarred: false,
    isarchived: false,
    isdeleted: false
  };

  try {
    const res = await fetch("http://localhost:5000/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProject)
    });
    
    const createdProject = await res.json();

    setProjects(prev => [...prev, createdProject]);
    setProject(createdProject);

  } catch (err) {
    console.error("Failed to add project:", err);
  }
}

export async function addNote(txt, pId, notes, setNotes) {
  const newDate = new Date().toISOString();

  const newPos =
    Math.max(
      -1,
      ...notes.filter(
        n => n.project_id === pId
      ).map(
        n => n.position ?? 0
      )
    ) + 1;
    
  const newNote =
  {
    id: getFirstAvailableId(notes),
    "project_id": pId,
    "text": txt,
    "position": newPos,
    "datetimecreated": newDate,
    "datetimemodified": newDate,
    "ispinned": false,
    "isstarred": false
  }

  try {
    const res = await fetch("http://localhost:5000/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNote)
    });
    
    const createdNote = await res.json();

    setNotes(prev => [...prev, createdNote]);

  } catch (err) {
    console.error("Failed to add note:", err);
  }
}

function getFirstAvailableId(items) {
  const used = new Set(items.map(x => Number(x.id)));
  let id = 1;
  while (used.has(id)) { id++; }
  return id;
}
