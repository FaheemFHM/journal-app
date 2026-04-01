
import { useState, useEffect } from "react";
import "./dropdown.css";

export default function Dropdown({ options = [] }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Select");

  useEffect(() => {
    if (options.length > 0) {
      setSelected(options[0]);
    }
  }, [options]);

  const handleSelect = (value) => {
    setSelected(value);
    setOpen(false);
  };

  return (
    <div className="dropdown">
      <div
        className={`dropdown-button ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
      >
        <span>{selected}</span>
        <i className={`bi bi-caret-${open ? "up" : "down"}-fill`}></i>
      </div>

      {open && (
        <div className="dropdown-contents">
          {options.map((option, index) => (
            <div key={index} onClick={() => handleSelect(option)}>
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
