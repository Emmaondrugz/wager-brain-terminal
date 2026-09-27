import { useState } from "react";
import RainbowGauge from "./guage";
import type { TicketStatus, ExecutionTicket } from "../../../types/execution";

// Base progression through the pipeline — the "normal path" states.
// Each step is a fraction of 20 bars, arranged so 20 = fully placed.
const BASE_FILLED_BY_STATUS = {
  selected: 2,
  resolving: 5,
  resolved: 8,
  verifying: 11,
  ready_for_confirmation: 14,
  placing: 17,
  placed: 19,
  closed: 20,
} as const;

// Everything else isn't a new step forward — it's a branch OFF the base
// path, so it borrows the fill value of whichever base stage it actually
// happened at, instead of inventing its own number:
//
// - changed_odds happens mid-verification, so it freezes at "verifying"'s
//   fill level (11) rather than advancing — nothing progressed, it paused.
// - partially_placed / hedge_required / failed all surface at or after the
//   "placing" attempt — that's the stage where money actually started
//   moving — so they inherit "placing"'s fill level (17), not a fresh one.
// - closed is just an archived "placed" ticket, so it stays at 20.
const FILLED_BY_STATUS: Record<TicketStatus, number> = {
  ...BASE_FILLED_BY_STATUS,
  changed_odds: BASE_FILLED_BY_STATUS.verifying,
  partially_placed: BASE_FILLED_BY_STATUS.placing,
  hedge_required: BASE_FILLED_BY_STATUS.placing,
  failed: BASE_FILLED_BY_STATUS.placing,
  closed: BASE_FILLED_BY_STATUS.closed,
};

// Only three gauge colors:
// red = danger (recovery needed / failed)
// black = paused or stopped (execution not progressing)
// orange-500 = everything else (normal in-progress / success)
const GAUGE_COLOR_BY_STATUS: Record<TicketStatus, string> = {
  selected: "#FC6B01",
  resolving: "#FC6B01",
  resolved: "#FC6B01",
  verifying: "#FC6B01",
  ready_for_confirmation: "#FC6B01",
  placing: "#FC6B01",
  placed: "#FC6B01",

  changed_odds: "#111", // paused, needs review before continuing
  closed: "#FC6B01", // stopped

  partially_placed: "red", // danger
  hedge_required: "#red", // danger
  failed: "red", // danger
};

const CENTER_TEXT_BY_STATUS: Record<TicketStatus, string> = {
  selected: "Selected",
  resolving: "Resolving",
  resolved: "Resolved",
  verifying: "Verifying",
  ready_for_confirmation: "Confirm to place",
  changed_odds: "Odds changed. review!",
  placing: "Placing",
  placed: "Placed",
  partially_placed: "Recovery needed",
  hedge_required: "Hedge required",
  failed: "Failed",
  closed: "Closed",
};

// PLACEHOLDER — stands in for the API response until executionClient exists.
// Change `status` below directly in code to preview each state.
const MOCK_TICKET: ExecutionTicket = {
  ticketId: "WB-T-0009",
  bookmakers: ["1xbet", "sportybet"],
  status: "placing", // <-- change this value to test states
};

export default function Execution_Widget() {
  const [ticket] = useState<ExecutionTicket>(MOCK_TICKET);

  const filled = FILLED_BY_STATUS[ticket.status];
  const percent = Math.round((filled / 20) * 100);
  const gaugeColor = GAUGE_COLOR_BY_STATUS[ticket.status];
  const centerText = CENTER_TEXT_BY_STATUS[ticket.status];

  return (
    <div className="relative h-fit w-full rounded-lg p-4">
      <div className="flex h-full w-full items-center justify-center">
        <div className="w-full -rotate-15 -mt-3">
          <RainbowGauge
            activeColor={gaugeColor}
            total={20}
            filled={filled}
            radius={90}
            barWidth={10}
            barHeight={22}
          />
        </div>

        <div className="absolute ml-5 text-center mt-16 gap-2 flex-col flex justify-center">
          <div className="flex flex-col items-center gap-1">
            <div className="text-2xl grotesk">{percent}%</div>
            <div
              className="text-xs max-w-30 w-full"
              style={{ color: gaugeColor }}
            >
              {centerText}
            </div>
          </div>

          <div className="hidden items-center justify-center">
            <div className="w-7 h-7 bg-gray-200 rounded-full">
              <img
                src="/bookmakers-optimized/1xbet.webp"
                alt=""
                className="rounded-full"
              />
            </div>
            <div className="w-7 h-7 bg-gray-200 rounded-full -ml-2">
              <img
                src="/bookmakers-optimized/sportybet.webp"
                alt=""
                className="rounded-full"
              />
            </div>
          </div>

          <div className="flex items-center flex-col gap-0">
            <div className="text-xs text-gray-700">{ticket.ticketId}</div>
            <div className="text-[13px]">{ticket.bookmakers.join(" / ")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
