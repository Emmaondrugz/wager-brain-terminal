import type { LedgerEntry } from "../types/ledger";

/**
 * Mirrors the table's visible columns. Money stays as raw numbers — no ₦ or
 * thousands separators — so spreadsheets treat the cells as numeric rather
 * than text, which is what makes SUM/AVG work on the export.
 */
const CSV_COLUMNS: {
  header: string;
  value: (entry: LedgerEntry) => string | number;
}[] = [
  { header: "Ticket ID", value: (e) => e.ticketId },
  { header: "Date/Time", value: (e) => e.dateTime },
  { header: "Provider", value: (e) => e.provider },
  { header: "Event", value: (e) => e.event },
  { header: "Formula", value: (e) => e.formula },
  { header: "Bookmakers", value: (e) => e.bookmakers.join("; ") },
  { header: "Status", value: (e) => e.status },
  { header: "Total Stake", value: (e) => e.totalStake },
  { header: "Verified P/L", value: (e) => e.verifiedPnl },
  { header: "Final Outcome", value: (e) => e.finalOutcome },
  { header: "Recovery Status", value: (e) => e.recoveryStatus },
];

/** RFC 4180: quote when a value contains a comma, quote or newline. */
function escapeCell(value: string | number): string {
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function entriesToCsv(entries: LedgerEntry[]): string {
  const rows = [
    CSV_COLUMNS.map((column) => escapeCell(column.header)),
    ...entries.map((entry) =>
      CSV_COLUMNS.map((column) => escapeCell(column.value(entry))),
    ),
  ];

  return rows.map((cells) => cells.join(",")).join("\r\n");
}

export function downloadCsv(filename: string, csv: string): void {
  // Leading BOM so Excel reads it as UTF-8 instead of the system codepage
  const blob = new Blob([`﻿${csv}`], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
