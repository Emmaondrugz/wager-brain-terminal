import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  CircleCheck,
  CircleDashed,
  CircleX,
  Clock,
  HandCoins,
  Minus,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { LedgerStatus, RecoveryStatus } from "../../../types/ledger";
import type { LedgerFilter } from "../../../lib/ledger";
import { toggleFilterValue } from "../../../lib/ledger";
import { CheckboxVisual } from "../../ui/checkbox";

/** Colours mirror how the table paints these same values. */
const OPTION_ICONS: Record<string, { icon: LucideIcon; className: string }> = {
  Placed: { icon: CircleCheck, className: "text-green-700" },
  Partial: { icon: CircleDashed, className: "text-orange-700" },
  Failed: { icon: CircleX, className: "text-red-700" },
  None: { icon: Minus, className: "text-gray-400" },
  Resolved: { icon: ShieldCheck, className: "text-green-700" },
  "Left Open": { icon: Clock, className: "text-red-700" },
  "Cashout Available": { icon: HandCoins, className: "text-blue-700" },
};

const STATUS_OPTIONS: LedgerStatus[] = ["Placed", "Partial", "Failed"];

const RECOVERY_OPTIONS: RecoveryStatus[] = [
  "None",
  "Resolved",
  "Left Open",
  "Cashout Available",
];

interface StatusDropdownProps {
  value: LedgerFilter;
  onChange: (next: LedgerFilter) => void;
}

function Section<T extends string>({
  heading,
  options,
  selected,
  onSelect,
}: {
  heading: string;
  options: T[];
  selected: T[];
  onSelect: (option: T) => void;
}) {
  return (
    <div className="py-1">
      <div className="grotesk text-[11px] uppercase tracking-wide text-gray-600 px-3 py-1">
        {heading}
      </div>

      {options.map((option) => {
        const { icon: Icon, className } = OPTION_ICONS[option];

        return (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className="w-full text-[13px] rounded-sm transition-all duration-300 text-left text-gray-800 cursor-pointer px-3 py-1.5 flex items-center gap-2 hover:bg-gray-100"
          >
            <CheckboxVisual checked={selected.includes(option)} />
            <Icon
              size={14}
              strokeWidth={1.75}
              className={`shrink-0 ${className}`}
            />
            <span className="truncate">{option}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function StatusDropdown({
  value,
  onChange,
}: StatusDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Name the button after the first pick, with a count for the rest
  const picked: string[] = [...value.status, ...value.recovery];
  const label =
    picked.length === 0
      ? "Status"
      : picked.length === 1
        ? picked[0]
        : `${picked[0]} +${picked.length - 1}`;

  return (
    <div ref={rootRef} className="relative">
      <div className="w-fit h-fit border-l border-b-2 bg-gray-200 active:scale-95 rounded-sm border-gray-200">
        <button
          type="button"
          onClick={() => setOpen((isOpen) => !isOpen)}
          className="text-xs shadow-xs active:border-b-transparent bg-clip-padding cursor-pointer text-gray-800 gap-2 flex items-center border-t-[1.5px] border-r-[1.5px] border-b-2 border-gray-200 bg-white px-2.5 py-1.5 rounded-sm"
        >
          {label}
          <ChevronDown
            size={16}
            strokeWidth={1.75}
            className={`text-gray-800 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {open && (
        <div className="absolute left-0 top-full px-1 mt-1 z-50 w-52 bg-white border border-gray-200 rounded-sm shadow-lg">
          <Section
            heading="Status"
            options={STATUS_OPTIONS}
            selected={value.status}
            onSelect={(option) =>
              onChange({
                ...value,
                status: toggleFilterValue(value.status, option),
              })
            }
          />

          <div className="h-px bg-gray-200" />

          <Section
            heading="Recovery"
            options={RECOVERY_OPTIONS}
            selected={value.recovery}
            onSelect={(option) =>
              onChange({
                ...value,
                recovery: toggleFilterValue(value.recovery, option),
              })
            }
          />
        </div>
      )}
    </div>
  );
}
