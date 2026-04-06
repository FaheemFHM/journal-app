
import { useState, useEffect, useRef } from "react";
import "./dropdown.css";

export default function Dropdown({ options = [], value, onChange }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // close dropdown if click happens outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    // handle event listeners
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown" ref={dropdownRef}>
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
