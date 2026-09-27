import { useEffect } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children?: ReactNode;
  /** Overrides the centre box's size/padding classes. */
  boxClassName?: string;
}

/**
 * Full-screen modal. The centre box is drawn by four rules that bleed to the
 * edges of the viewport, so the box reads as the area their intersections
 * enclose rather than as a bordered card.
 */
export default function Modal({
  open,
  onClose,
  children,
  boxClassName = "p-3 w-100 h-fit",
}: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  // Portalled to body so no ancestor's transform/backdrop-filter can become
  // the containing block for the fixed overlay.
  return createPortal(
    <div
      role="presentation"
      onClick={onClose}
      // overflow-hidden clips the full-bleed rules so they can't add scrollbars
      className="fixed inset-0 z-2000 overflow-hidden flex items-center justify-center bg-black/20"
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className={`relative bg-white rounded-md p-2 ${boxClassName}`}
      >
        {/* Horizontals span the viewport width, verticals its height */}
        {/* <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-px bg-gray-200" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-screen h-px bg-gray-200" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-screen w-px bg-gray-200" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-screen w-px bg-gray-200" /> */}

        {children}
      </div>
    </div>,
    document.body,
  );
}
