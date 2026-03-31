
import { useState, useEffect } from 'react';
import './App.css'

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  function toggleTheme() {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.setAttribute(
      "data-theme",
      newMode ? "light" : "dark"
    );
  }
  
  return (
    <div className='app'>
    </div>
  );
}

function VerticalSpacer() {
  return (
    <div style={{ flexGrow: 1 }}></div>
  );
}
