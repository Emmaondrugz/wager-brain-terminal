import { Check, Minus } from "lucide-react";

interface CheckboxVisualProps {
  checked: boolean;
  indeterminate?: boolean;
}

/**
 * The box on its own, with no input behind it. Use inside an element that is
 * already interactive — a menu row `<button>`, say — where nesting a real
 * checkbox would be invalid markup and would double-fire the click.
 */
export function CheckboxVisual({
  checked,
  indeterminate,
}: CheckboxVisualProps) {
  const isFilled = checked || indeterminate;

  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex items-center justify-center w-4 h-4 shrink-0 rounded-sm border transition-colors duration-150 ${
        isFilled ? "bg-black border-black" : "bg-white border-gray-300"
      }`}
      style={{ boxShadow: "inset 0 1px 1.5px rgba(0,0,0,0.08)" }}
    >
      {indeterminate ? (
        <Minus size={11} strokeWidth={3} className="text-white" />
      ) : checked ? (
        <Check size={11} strokeWidth={3} className="text-white" />
      ) : null}
    </span>
  );
}

interface CheckboxProps extends CheckboxVisualProps {
  onChange: () => void;
}

/** Standalone checkbox backed by a real input, for use on its own. */
export default function Checkbox({
  checked,
  indeterminate,
  onChange,
}: CheckboxProps) {
  return (
    <label className="relative inline-flex items-center justify-center w-4 h-4 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        ref={(el) => {
          if (el) el.indeterminate = !!indeterminate;
        }}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
      <CheckboxVisual checked={checked} indeterminate={indeterminate} />
    </label>
  );
}
