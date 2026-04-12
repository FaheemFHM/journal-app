
export async function addProject(txt, setProjects) {
  const newDate = new Date().toISOString();

  const newProject = {
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

  } catch (err) {
    console.error("Failed to add project:", err);
  }
}
