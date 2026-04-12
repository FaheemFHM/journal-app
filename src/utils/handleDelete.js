
export function deleteProject(
  pId,
  doDelete, // true = restore | false = soft delete
  projects,
  setProjects,
  setProject
) {
  // find project
  const project = projects.find(p => p.id === pId);
  if (!project) return;
  
  // get new values
  const newDate = new Date().toISOString();
  const updates = {
    isdeleted: doDelete,
    datetimedeleted: doDelete ? newDate : null
  };

  // new state
  const prevState = projects;
  const newState = projects.map(p =>
    p.id === pId
      ? { ...p, ...updates }
      : p
  );

  // optimistic update
  setProjects(newState);

  // refresh project selection
  let newSelected;
  
  if (doDelete) {
    // on delete: select the first project that is active
    newSelected = findFirstActiveProject(newState);
  } else {
    // on restore: select the restored project
    newSelected = newState.find(p => p.id === pId);
  }

  setProject(newSelected);

  // backend update
  fetch(`http://localhost:5000/projects/${pId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates)
  }).catch(err => {
    console.error(err);
    setProjects(prevState);
    setProject(prevState.find(p => p.id === pId));
  });
}

export function deleteNote(nId, notes, setNotes, setProjects) {
  // find note
  const note = notes.find(n => n.id === nId);
  if (!note) return;

  // values
  const projectId = note.project_id;
  const newDate = new Date().toISOString();

  // states
  const prevNotes = notes;
  const newNotes = notes.filter(n => n.id !== nId);

  // optimistic updates
  setNotes(newNotes);

  setProjects(prev =>
    prev.map(p =>
      p.id === projectId
        ? { ...p, datetimemodified: newDate }
        : p
    )
  );

  // backend calls
  fetch(`http://localhost:5000/notes/${nId}`, {
    method: "DELETE"
  }).catch(err => {
    console.error(err);
    setNotes(prevNotes);
  });

  fetch(`http://localhost:5000/projects/${projectId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      datetimemodified: newDate
    })
  }).catch(console.error);
}

export async function deleteAllExpired(expiredIds, endpoint) {
  await Promise.all(
    Array
    .from(expiredIds)
    .map(async (xId) => {
      const res = await fetch(`http://localhost:5000/${endpoint}/${xId}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        if (res.status === 404) {
          console.warn(`Could not find: ${endpoint}/${xId}`);
        }
        else {
          console.warn(`Failed to delete: ${endpoint}/${xId}`);
        }
      }
    })
  );
}

export function hardDeleteProject(pId, projects, setProjects, setProject) {
  const project = projects.find(p => p.id === pId);
  if (!project) return;

  const prevProjects = projects;

  // update frontend
  const newProjects = projects.filter(p => p.id !== pId);
  setProjects(newProjects);
  setProject(findFirstActiveProject(newProjects));

  // update backend
  fetch(`http://localhost:5000/projects/${pId}`, {
    method: "DELETE"
  }).catch(err => {
    console.error(err);
    setProjects(prevProjects);
  });
}

function findFirstActiveProject(
  projects,
  findActive = true
) {
  const activeProjects = projects.filter(
    p => p.isdeleted !== findActive
  );

  return activeProjects.length > 0
    ? activeProjects.reduce((latest, prj) => {
        const mod = new Date(prj.datetimemodified);
        const lastMod = new Date(latest.datetimemodified);
        return mod > lastMod ? prj : latest;
      }, activeProjects[0])
    : null;
}
