// src/components/features/ledger/table.tsx
import { Fragment, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { ChevronRight, Ellipsis } from "lucide-react";
import Checkbox from "../../ui/checkbox";
import RowDetails from "./row_details";
import "../../../index.css";

import type {
  LedgerEntry,
  LedgerStatus,
  RecoveryStatus,
} from "../../../types/ledger";
import { EmptyStatePattern } from "./table_widget";
import { ChevronLeft } from "lucide-react";
import { filterEntries } from "../../../lib/ledger";
import type { LedgerFilter } from "../../../lib/ledger";
import PaginationBar from "./pagination_bar";

// The rest of the entry lives in the row-detail modal. Ticket ID and Date/Time
// are pinned wide enough to never truncate; the remaining four declare no width
// so table-fixed splits what's left evenly and they grow at the same rate.
const COLUMNS = [
  "Ticket ID",
  "Date/Time",
  "Provider",
  "Event",
  "Bookmakers",
  "Status",
] as const;

// Only the two columns that hug the checkbox gutter deviate from px-6
const COLUMN_PADDING: Partial<Record<(typeof COLUMNS)[number], string>> = {
  "Ticket ID": "pl-3 pr-6",
  "Date/Time": "pl-0 pr-6",
};

// Sized to their longest value plus padding so neither ever ellipses, then
// released at 1900px+ where an even split is already wider than the content —
// so on very wide screens every column shares the width equally.
const COLUMN_WIDTH: Partial<Record<(typeof COLUMNS)[number], string>> = {
  "Ticket ID": "w-44 min-[1900px]:w-auto",
  "Date/Time": "w-32 min-[1900px]:w-auto",
};

const ROWS_PER_PAGE = 10;

interface LedgerProps {
  entries: LedgerEntry[];
  filter: LedgerFilter;
  // Selection lives in Table.tsx so the action bar's Delete can read it
  selectedIds: Set<string>;
  setSelectedIds: Dispatch<SetStateAction<Set<string>>>;
}

export default function Ledger({
  entries,
  filter,
  selectedIds,
  setSelectedIds,
}: LedgerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredEntries = filterEntries(entries, filter);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEntries.length / ROWS_PER_PAGE),
  );

  const safePage = Math.min(currentPage, totalPages);

  const paginatedEntries = filteredEntries.slice(
    (safePage - 1) * ROWS_PER_PAGE,
    safePage * ROWS_PER_PAGE,
  );

  const allSelected =
    paginatedEntries.length > 0 &&
    paginatedEntries.every((entry) => selectedIds.has(entry.ticketId));

  const someSelected = paginatedEntries.some((entry) =>
    selectedIds.has(entry.ticketId),
  );

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        paginatedEntries.forEach((entry) => next.delete(entry.ticketId));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        paginatedEntries.forEach((entry) => next.add(entry.ticketId));
        return next;
      });
    }
  };

  const toggleOne = (ticketId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(ticketId)) {
        next.delete(ticketId);
      } else {
        next.add(ticketId);
      }
      return next;
    });
  };

  return (
    <div className="relative flex-1 mb-5 pb-5 min-h-0 flex flex-col rounded-sm bg-cover bg-center">
      {/* Scrollable area */}
      <div className="relative flex-1 overflow-y-auto overflow-x-hidden">
        {/* Grid backdrop — scoped to the scroll area so it never reaches the
            pagination strip. Opaque rows cover it wherever data exists. */}
        <div className="absolute hidden inset-0 z-0 pointer-events-none">
          <EmptyStatePattern />
        </div>

        <table className="relative z-10 w-full table-fixed text-left">
          <thead className="sticky top-0 z-20 bg-white shadow-[0_0.5px_0_0_#e5e7eb]">
            <tr>
              <th className="w-10 px-3 py-1">
                <Checkbox
                  checked={allSelected}
                  indeterminate={!allSelected && someSelected}
                  onChange={toggleAll}
                />
              </th>
              {COLUMNS.map((col) => (
                <th
                  key={col}
                  // Padding mirrors each column's body cell so headers line up
                  className={`${COLUMN_WIDTH[col] ?? ""} ${COLUMN_PADDING[col] ?? "px-6"} text-[13px] font-normal text-black py-1 whitespace-nowrap`}
                >
                  {col}
                </th>
              ))}
              <th className="w-10 px-3 py-1" />
            </tr>
          </thead>
          <tbody>
            {paginatedEntries.map((entry, i) => {
              const isExpanded = expandedId === entry.ticketId;

              return (
                <Fragment key={entry.ticketId}>
                  <tr
                    onClick={() =>
                      setExpandedId(isExpanded ? null : entry.ticketId)
                    }
                    className={`border-b border-gray-100 cursor-pointer transition-all duration-300 ${
                      isExpanded
                        ? "bg-[#fafafa]"
                        : "bg-white hover:bg-[#fafafa]"
                    }`}
                  >
                    <td
                      className="px-3 py-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={selectedIds.has(entry.ticketId)}
                        onChange={() => toggleOne(entry.ticketId)}
                      />
                    </td>

                    <td className="pl-3 pr-6 py-2 text-[12px] whitespace-nowrap">
                      {entry.ticketId}
                    </td>

                    <td className="pr-6 pl-0 py-2 text-[11.5px] whitespace-nowrap">
                      {entry.dateTime}
                    </td>

                    <td className="px-6 py-2 text-[13px]">
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={entry.provider_logo}
                          alt={entry.provider}
                          className="w-5 h-5 rounded-full object-cover bg-gray-200 shrink-0"
                        />
                        <span className="truncate">{entry.provider}</span>
                      </div>
                    </td>

                    <td className="px-6 py-2 text-[13px] truncate">
                      {entry.event}
                    </td>

                    <td className="px-6 py-2 text-[13px] truncate">
                      {entry.bookmakers.join(" / ")}
                    </td>

                    <td className="px-6 py-2 whitespace-nowrap">
                      <span
                        className={`text-[13px] ${
                          entry.status === "Placed"
                            ? " text-green-700"
                            : entry.status === "Partial"
                              ? " text-orange-700"
                              : " text-red-700"
                        }`}
                      >
                        {entry.status}
                      </span>
                    </td>

                    {/* Expand affordance — mirrors the row's own click */}
                    <td className="w-10 px-3 py-2">
                      <Ellipsis
                        size={16}
                        strokeWidth={1.75}
                        className={`transition-colors duration-200 ${
                          isExpanded ? "text-black" : "text-gray-400"
                        }`}
                      />
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr className="bg-white border-b border-gray-100">
                      <td colSpan={COLUMNS.length + 2} className="p-0">
                        <RowDetails entry={entry} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>

        <div className="h-16" />
      </div>

      {totalPages > 1 && (
        <PaginationBar
          safePage={safePage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}
