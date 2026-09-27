// src/types/execution.ts

export type TicketStatus =
  | "selected"
  | "resolving"
  | "resolved"
  | "verifying"
  | "ready_for_confirmation"
  | "changed_odds"
  | "placing"
  | "placed"
  | "partially_placed"
  | "hedge_required"
  | "failed"
  | "closed";

export interface ExecutionTicket {
  ticketId: string;
  bookmakers: string[];
  status: TicketStatus;
}
