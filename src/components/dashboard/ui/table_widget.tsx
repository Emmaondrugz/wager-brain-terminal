// src/components/features/ledger/Table.tsx
import { useState } from "react";
import Ledger from "./table";
import DeleteModal from "./delete_modal";
import DateRange, { formatDate } from "./date_range";
import type { DateRangeValue } from "./date_range";
import { Calendar, Download, ListSortDescending, Trash } from "lucide-react";
import type { LedgerEntry } from "../../../types/ledger";
import { filterEntries, EMPTY_FILTER } from "../../../lib/ledger";
import type { LedgerFilter } from "../../../lib/ledger";
import StatusDropdown from "./status_dropdown";
import BookmakersModal from "./bookmakers_modal";
import ProviderDropdown from "./provider_dropdown";
import { entriesToCsv, downloadCsv } from "../../../lib/csv";
import { MOCK_LEDGER_ENTRIES } from "../../../../lib/api/mock/ledgerEntries";
import { MOCK_BOOKMAKERS } from "../../../../lib/api/mock/bookmakers";

export function EmptyStatePattern() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
    >
      <defs>
        <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <rect width="24" height="24" fill="#ffffff" />
          <line
            x1="0"
            y1="0"
            x2="24"
            y2="0"
            stroke="#f2f2f0"
            strokeWidth="0.5"
          />
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="24"
            stroke="#f2f2f0"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>

      <rect width="400" height="300" fill="url(#grid)" />

      <rect x="72" y="0" width="24" height="24" fill="#f4f4f2" />
      <rect x="192" y="24" width="24" height="24" fill="#f4f4f2" />
      <rect x="336" y="24" width="24" height="24" fill="#f4f4f2" />
      <rect x="240" y="48" width="24" height="24" fill="#f4f4f2" />
      <rect x="24" y="72" width="24" height="24" fill="#f4f4f2" />
      <rect x="96" y="96" width="24" height="24" fill="#f4f4f2" />
      <rect x="312" y="96" width="24" height="24" fill="#f4f4f2" />
      <rect x="72" y="144" width="24" height="24" fill="#f4f4f2" />
      <rect x="144" y="144" width="24" height="24" fill="#f4f4f2" />
      <rect x="264" y="144" width="24" height="24" fill="#f4f4f2" />
      <rect x="336" y="168" width="24" height="24" fill="#f4f4f2" />
      <rect x="24" y="192" width="24" height="24" fill="#f4f4f2" />
      <rect x="96" y="192" width="24" height="24" fill="#f4f4f2" />
      <rect x="192" y="216" width="24" height="24" fill="#f4f4f2" />
    </svg>
  );
}

export default function Table() {
  const [filter, setFilter] = useState<LedgerFilter>(EMPTY_FILTER);
  const [entries, setEntries] = useState<LedgerEntry[]>(MOCK_LEDGER_ENTRIES);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showBookmakersModal, setShowBookmakersModal] = useState(false);
  const [enabledBookmakers, setEnabledBookmakers] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRangeValue>({
    start: null,
    end: null,
  });

  const hasEntries = entries.length > 0;
  const hasSelection = selectedIds.size > 0;

  // Ticked rows if there are any, otherwise everything matching the active
  // status filter — pagination is ignored either way.
  const handleExport = () => {
    const scoped = hasSelection
      ? entries.filter((entry) => selectedIds.has(entry.ticketId))
      : filterEntries(entries, filter);

    const stamp = new Date().toISOString().slice(0, 10);
    downloadCsv(`wager-ledger-${stamp}.csv`, entriesToCsv(scoped));
  };

  // The modal works in stable ids; the ledger stores display names, so the
  // selection is translated on the way into the filter.
  const handleApplyBookmakers = (ids: string[]) => {
    setEnabledBookmakers(ids);
    setFilter((prev) => ({
      ...prev,
      bookmakers: MOCK_BOOKMAKERS.filter((b) => ids.includes(b.id)).map(
        (b) => b.name,
      ),
    }));
  };

  // Local-state delete for now; swap for the lib/api call once it exists.
  const handleDelete = () => {
    if (!hasSelection) return;
    setEntries((prev) =>
      prev.filter((entry) => !selectedIds.has(entry.ticketId)),
    );
    setSelectedIds(new Set());
  };

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col gap-1 overview_scroll overflow-hidden">
      {/* Action/filter bar goes here */}
      <div className="flex sticky top-0 z-20 bg-white items-center justify-between w-full gap-2 px-2 p-3">
        <div className="flex items-center gap-2">
          {/* Providers dropdown */}
          <ProviderDropdown
            entries={entries}
            value={filter.provider}
            onChange={(provider) => setFilter({ ...filter, provider })}
          />

          {/* Bookmakers */}
          <div className="w-fit h-fit border-l border-b-2 bg-gray-200 active:scale-95 rounded-sm border-gray-200">
            <button
              type="button"
              onClick={() => setShowBookmakersModal(true)}
              className="text-xs shadow-xs active:border-b-transparent bg-clip-padding cursor-pointer text-gray-800 gap-2 flex items-center border-t-[1.5px] border-r-[1.5px] border-b-2 border-gray-200 bg-white px-2.5 py-1.5 rounded-sm"
            >
              {enabledBookmakers.length > 0
                ? `Bookmakers (${enabledBookmakers.length})`
                : "Bookmakers"}
              <ListSortDescending
                size={16}
                strokeWidth={1.75}
                className="text-gray-800"
              />
            </button>
          </div>

          {/* Status dropdown */}
          <StatusDropdown value={filter} onChange={setFilter} />
        </div>

        <div className="flex gap-3 items-center">
          {/* date - range */}
          <div className="w-fit h-fit border-l border-b-2 bg-gray-200 active:scale-95 rounded-sm border-gray-200">
            <button
              type="button"
              onClick={() => setShowDateModal(true)}
              className="text-xs shadow-xs active:border-b-transparent bg-clip-padding cursor-pointer text-gray-800 gap-2 flex items-center border-t-[1.5px] border-r-[1.5px] border-b-2 border-gray-200 bg-white px-2.5 py-1.5 rounded-sm"
            >
              <Calendar size={16} strokeWidth={1.75} />
              {dateRange.start && dateRange.end ? (
                <>
                  <span>{formatDate(dateRange.start)}</span> -{" "}
                  <span>{formatDate(dateRange.end)}</span>
                </>
              ) : (
                <span>Date range</span>
              )}
            </button>
          </div>

          {/* delete */}
          <div
            className={`w-fit h-fit border-l border-b-2 bg-gray-200 rounded-sm border-gray-200 ${
              hasSelection ? "active:scale-95" : "opacity-50"
            }`}
          >
            <button
              type="button"
              disabled={!hasSelection}
              onClick={() => setShowDeleteModal(true)}
              className={`text-xs shadow-xs text-gray-800 gap-2 flex items-center border-t-[1.5px] border-r-[1.5px] border-b-2 border-gray-200 bg-white px-2.5 py-1.5 rounded-sm ${
                hasSelection
                  ? "cursor-pointer active:border-b-transparent bg-clip-padding"
                  : "cursor-not-allowed"
              }`}
            >
              <Trash size={16} strokeWidth={1.75} />
              Delete
            </button>
          </div>

          {/* export */}
          <div className="w-fit h-fit border-l border-b-2 bg-black active:scale-95 rounded-sm border-black">
            <button
              type="button"
              onClick={handleExport}
              className="text-xs shadow-xs active:border-b-transparent bg-clip-padding cursor-pointer text-white gap-2 flex items-center border-t-[1.5px] border-r-[1.5px] border-b-2 border-black px-2.5 py-1.5 rounded-sm"
              style={{
                // backgroundImage, not the `background` shorthand, so it can't
                // reset the background-clip that bg-clip-padding relies on
                backgroundImage: "linear-gradient(to bottom, #111, #0a0a0a)",
                boxShadow: "0px 2px 0px 0px rgba(255,255,255,0.15) inset",
              }}
            >
              Export
              <Download size={16} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>

      {!hasEntries ? (
        <div className="relative w-full flex-1 min-h-100 border-t border-gray-200 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <EmptyStatePattern />
          </div>

          <div className="relative z-10 bg-transparent mb-5 flex flex-col items-center gap-3">
            <div className="w-60 rounded-xl h-35">
              <img
                src="/empty_prop2.png"
                alt=""
                className="rounded-t-sm w-full h-full object-cover object-left"
              />
            </div>

            <div className="flex flex-col mt-3 gap-1 items-center text-center">
              <div className="text-base">No ledger activity yet</div>
              <div className="text-sm text-gray-800 mt-1 max-w-70">
                Placed and failed tickets will show up here once you start
                executing.
              </div>
              <div className="w-fit h-fit mt-3 border-l border-b-2 bg-black active:scale-95 rounded-sm border-black">
                <button
                  className="text-[13px] shadow-xs active:border-b-transparent bg-clip-padding cursor-pointer text-white poppins gap-1.5 flex items-center text-center justify-center border-t-[1.5px] border-r-[1.5px] border-b-2 border-black px-4 py-2.5 rounded-sm"
                  style={{
                    backgroundImage:
                      "linear-gradient(to bottom, #111, #0a0a0a)",
                    boxShadow: "0px 2px 0px 0px rgba(255,255,255,0.15) inset",
                  }}
                >
                  Go to execution desk
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Ledger
          entries={entries}
          filter={filter}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
        />
      )}

      <DeleteModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />

      <DateRange
        open={showDateModal}
        onClose={() => setShowDateModal(false)}
        onApply={setDateRange}
        value={dateRange}
      />

      <BookmakersModal
        open={showBookmakersModal}
        onClose={() => setShowBookmakersModal(false)}
        onApply={handleApplyBookmakers}
        value={enabledBookmakers}
      />
    </div>
  );
}
