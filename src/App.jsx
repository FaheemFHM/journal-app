
import { useState, useEffect } from 'react';
import './App.css';

import ProjectsPanel from "./components/projects";
import NotesPanel from "./components/notes";

export default function App() {
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

  return (
    <div className='app'>
      <ProjectsPanel />
      <NotesPanel
        theme={themes[nextThemeIndex()]}
        handleThemeIndex={handleThemeIndex}
      />
    </div>
  );
}
