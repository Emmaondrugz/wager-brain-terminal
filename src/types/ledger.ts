// src/types/ledger.ts

export type LedgerStatus = "Placed" | "Partial" | "Failed";

export type RecoveryStatus =
  | "None"
  | "Resolved"
  | "Left Open"
  | "Cashout Available";

export interface LedgerEntry {
  ticketId: string;
  dateTime: string;
  provider: string;
  provider_logo: string;
  event: string;
  formula: string;
  bookmakers: string[];
  status: LedgerStatus;
  totalStake: number;
  verifiedPnl: number;
  finalOutcome: string;
  recoveryStatus: RecoveryStatus;
}
