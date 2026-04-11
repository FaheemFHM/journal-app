
import { useEffect, useRef } from "react";
import "./modals.css";

export default function Modal({ modal, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!modal) return;

    function handleKey(e) {
      if (e.repeat) return;

      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();

        modal.onConfirm?.();
        onClose();
      }

      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();

        modal.onCancel?.();
        onClose();
      }
    }

    window.addEventListener("keydown", handleKey);

    modalRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [modal, onClose]);

  if (!modal) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        ref={modalRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <p>{modal.text}</p>

        <div className="modal-row">
          <button
            onClick={() => {
              modal.onConfirm?.();
              onClose();
            }}
          >
            Confirm
          </button>

          <button
            onClick={() => {
              modal.onCancel?.();
              onClose();
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
