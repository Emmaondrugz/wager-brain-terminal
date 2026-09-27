import type {
  LedgerEntry,
  LedgerStatus,
  RecoveryStatus,
} from "../types/ledger";

/** An empty array on any axis means "don't narrow by it". */
export interface LedgerFilter {
  status: LedgerStatus[];
  recovery: RecoveryStatus[];
  provider: string[];
  /** Display names, matching what LedgerEntry.bookmakers holds. */
  bookmakers: string[];
}

export const EMPTY_FILTER: LedgerFilter = {
  status: [],
  recovery: [],
  provider: [],
  bookmakers: [],
};

/** Adds `value` if absent, removes it if present. */
export function toggleFilterValue<T>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

export interface ProviderOption {
  name: string;
  logo: string;
}

/**
 * Distinct providers actually present in the data, alphabetical, each paired
 * with its logo — so the dropdown can't drift from what the ledger contains.
 */
export function listProviders(entries: LedgerEntry[]): ProviderOption[] {
  const byName = new Map<string, string>();

  entries.forEach((entry) => {
    if (!byName.has(entry.provider)) {
      byName.set(entry.provider, entry.provider_logo);
    }
  });

  return [...byName]
    .map(([name, logo]) => ({ name, logo }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Shared by the ledger table and the CSV export so the two can't drift apart.
 * The two axes are ANDed — pick "Partial" + "Left Open" and you get only the
 * partial tickets that are still open.
 */
export function filterEntries(
  entries: LedgerEntry[],
  filter: LedgerFilter,
): LedgerEntry[] {
  return entries.filter((entry) => {
    if (filter.status.length && !filter.status.includes(entry.status))
      return false;
    if (
      filter.recovery.length &&
      !filter.recovery.includes(entry.recoveryStatus)
    )
      return false;
    if (filter.provider.length && !filter.provider.includes(entry.provider))
      return false;
    // A ticket matches if it used *any* of the enabled bookmakers
    if (
      filter.bookmakers.length &&
      !entry.bookmakers.some((name) => filter.bookmakers.includes(name))
    )
      return false;
    return true;
  });
}
