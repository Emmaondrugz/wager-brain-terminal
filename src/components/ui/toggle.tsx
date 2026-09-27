interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
}

/**
 * Recessed track with a raised knob — the inverse of the bevel buttons, which
 * sit proud of the surface. Same 1px/2px vocabulary so it reads as one system.
 */
export default function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative w-9 h-5 shrink-0 rounded-sm cursor-pointer border transition-colors duration-200 ${
        checked
          ? "bg-orange-500 border-orange-300"
          : "bg-gray-200 border-gray-300"
      }`}
      style={{ boxShadow: "inset 0 1px 2px rgba(0,0,0,0.14)" }}
    >
      <span
        className={`absolute border border-gray-300 top-1/2 left-0.5
           -translate-y-1/2 w-4 h-4 rounded-sm bg-white 
           transition-transform duration-200 ${
             checked ? "translate-x-[14.5px] border-0" : "-translate-x-px"
           }`}
        style={{
          boxShadow: " inset 0 1px 0 0 rgba(255,255,255,0.9)",
        }}
      />
    </button>
  );
}
