import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import Modal from "../../ui/modal";
import Toggle from "../../ui/toggle";
import { MOCK_BOOKMAKERS } from "../../../../lib/api/mock/bookmakers";

const COLUMNS = 3;
const ROWS = 7;
const PER_PAGE = COLUMNS * ROWS;

interface BookmakersModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (enabled: string[]) => void;
  value: string[];
}

function ChevronButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;

  return (
    <div
      className={`w-fit h-fit border-l border-b-2 bg-gray-200 rounded-sm border-gray-200 ${
        disabled ? "opacity-50" : "active:scale-95"
      }`}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        aria-label={direction === "prev" ? "Previous page" : "Next page"}
        className={`w-6 h-6 flex items-center justify-center bg-white rounded-sm border-b-2 bg-clip-padding transition-all duration-200 border-r-[1.5px] border-t-[1.5px] border-gray-200 ${
          disabled
            ? "cursor-not-allowed"
            : "cursor-pointer active:border-b-transparent"
        }`}
      >
        <Icon size={16} strokeWidth={2.25} className="text-gray-400" />
      </button>
    </div>
  );
}

export default function BookmakersModal({
  open,
  onClose,
  onApply,
  value,
}: BookmakersModalProps) {
  const [enabled, setEnabled] = useState<Set<string>>(new Set(value));
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  // Re-sync whenever the modal is reopened, so a cancelled edit doesn't stick
  useEffect(() => {
    if (open) {
      setEnabled(new Set(value));
      setQuery("");
      setPage(1);
    }
  }, [open, value]);

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return MOCK_BOOKMAKERS;
    return MOCK_BOOKMAKERS.filter((b) => b.name.toLowerCase().includes(needle));
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(matches.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const visible = matches.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  // Spans every bookmaker, not just the current page or search matches
  const allEnabled = enabled.size === MOCK_BOOKMAKERS.length;

  const toggleAll = () => {
    setEnabled(
      allEnabled ? new Set() : new Set(MOCK_BOOKMAKERS.map((b) => b.id)),
    );
  };

  const toggleOne = (id: string) => {
    setEnabled((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <Modal open={open} onClose={onClose} boxClassName="p-0 w-fit h-fit">
      {/* Heading + search */}
      <div className="flex items-center justify-between gap-6 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-gray-800">Enable all</span>
          <Toggle
            checked={allEnabled}
            onChange={toggleAll}
            label="Enable all bookmakers"
          />
        </div>

        <div className="w-fit h-fit border-l border-b-2 bg-gray-200 rounded-sm border-gray-200">
          <div className="flex items-center gap-2 bg-white bg-clip-padding border-t-[1.5px] border-r-[1.5px] border-b-2 border-gray-200 px-2.5 py-1.5 rounded-sm">
            <Search size={14} strokeWidth={1.75} className="text-gray-400" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search bookmakers"
              className="text-xs text-gray-800 w-45 outline-none placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-200" />

      {/* Fixed-height grid — never scrolls, paginate instead */}
      <div className="grid grid-cols-3 gap-x-8 gap-y-1 px-4 py-3">
        {visible.map((bookmaker) => (
          <div
            key={bookmaker.id}
            className="w-44 flex items-center justify-between gap-3 py-1.5"
          >
            <span className="flex items-center gap-2 min-w-0">
              <img
                src={bookmaker.logo}
                alt=""
                className="w-5 h-5 rounded-full object-cover bg-gray-200 shrink-0"
              />
              <span className="text-[13px] text-gray-800 truncate">
                {bookmaker.name}
              </span>
            </span>

            <Toggle
              checked={enabled.has(bookmaker.id)}
              onChange={() => toggleOne(bookmaker.id)}
              label={bookmaker.name}
            />
          </div>
        ))}

        {/* Hold the grid's height steady on a short last page */}
        {visible.length < PER_PAGE &&
          Array.from({ length: PER_PAGE - visible.length }, (_, i) => (
            <div key={`filler-${i}`} className="w-44 h-8" aria-hidden="true" />
          ))}
      </div>

      <div className="h-px bg-gray-200" />

      {/* Pager left, Apply right */}
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          <ChevronButton
            direction="prev"
            disabled={safePage === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          />
          <ChevronButton
            direction="next"
            disabled={safePage === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          />

          <span className="text-[13px] text-gray-600">
            {matches.length === 0
              ? "No matches"
              : `${(safePage - 1) * PER_PAGE + 1}–${
                  (safePage - 1) * PER_PAGE + visible.length
                } of ${matches.length}`}
          </span>
        </div>

        <div className="flex items-center">
          <div className="w-fit h-fit border-l border-b-2 bg-black active:scale-95 rounded-sm border-black">
            <button
              type="button"
              onClick={() => {
                onApply([...enabled]);
                onClose();
              }}
              className="text-[13px] shadow-xs active:border-b-transparent 
              bg-clip-padding cursor-pointer text-white flex items-center
               justify-center border-t-[1.5px] border-r-[1.5px] border-b-2
                border-black px-8 py-1.5 rounded-sm"
              style={{
                backgroundImage: "linear-gradient(to bottom, #111, #0a0a0a)",
                boxShadow: "0px 2px 0px 0px rgba(255,255,255,0.15) inset",
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
