
import { useState, useEffect } from "react";
import "./dropdown.css";

export default function Dropdown({ options = [], value, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="dropdown">
      <div
        className={`dropdown-button ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
      >
        <span>{value}</span>
        <i className={`bi bi-caret-${open ? "up" : "down"}-fill`}></i>
      </div>

      {open && (
        <div className="dropdown-contents">
          {options.map((option, index) => (
            <div key={index} onClick={() => {
              onChange(option);
              setOpen(false);
            }}>
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
