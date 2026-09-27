import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { LedgerEntry } from "../../../types/ledger";
import { listProviders, toggleFilterValue } from "../../../lib/ledger";
import { CheckboxVisual } from "../../ui/checkbox";

interface ProviderDropdownProps {
  entries: LedgerEntry[];
  value: string[];
  onChange: (providers: string[]) => void;
}

export default function ProviderDropdown({
  entries,
  value,
  onChange,
}: ProviderDropdownProps) {
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

  const providers = listProviders(entries);

  // Name the button after the first pick, with a count for the rest
  const label =
    value.length === 0
      ? "Providers"
      : value.length === 1
        ? value[0]
        : `${value[0]} +${value.length - 1}`;

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
        <div className="absolute left-0 top-full px-1 py-1 mt-1 z-50 w-52 bg-white border border-gray-200 rounded-sm shadow-lg">
          <div className="poppins text-[11px] uppercase tracking-wide text-gray-600 px-3 py-1">
            Providers
          </div>

          {providers.length === 0 ? (
            <div className="text-[13px] text-gray-400 px-3 py-1.5">
              No providers
            </div>
          ) : (
            providers.map((provider) => (
              <button
                key={provider.name}
                type="button"
                onClick={() =>
                  onChange(toggleFilterValue(value, provider.name))
                }
                className="w-full text-[13px] rounded-sm transition-all duration-300 text-left text-gray-800 cursor-pointer px-3 py-1.5 flex items-center gap-2 hover:bg-gray-100"
              >
                <CheckboxVisual checked={value.includes(provider.name)} />
                <img
                  src={provider.logo}
                  alt=""
                  className="w-4 h-4 rounded-full object-cover bg-gray-200 shrink-0"
                />
                <span className="truncate">{provider.name}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
