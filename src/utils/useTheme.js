
import { useState, useEffect } from "react";
import { mod } from "./utils";

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

function getIndex(index) {
  if (typeof index !== "number" || isNaN(index)) return 0;
  return mod(index, themes.length);
}

function getNextIndex(currentIndex, inc = 1) {
  return getIndex(currentIndex + inc);
}

function getTheme(index) {
  return themes[getIndex(index)];
}

export default function useTheme(initialIndex = 0) {
  const [themeIndex, setThemeIndex] = useState(getIndex(initialIndex));

  // apply theme
  useEffect(() => {
    const theme = getTheme(themeIndex);
    document.documentElement.dataset.theme = theme.name;
  }, [themeIndex]);

  // actions
  function toggleTheme() {
    setThemeIndex(prev => getNextIndex(prev));
  }

  function setTheme(index) {
    setThemeIndex(getIndex(index));
  }

  // values
  const theme = getTheme(themeIndex);
  const nextTheme = getTheme(getNextIndex(themeIndex));

  return {
    themeIndex,
    theme,
    nextTheme,
    toggleTheme,
    setTheme,
    themes
  };
}
