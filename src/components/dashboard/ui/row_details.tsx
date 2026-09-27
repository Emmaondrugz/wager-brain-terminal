import { Coins, RotateCcw, Sigma, Split, StickyNote } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { LedgerEntry } from "../../../types/ledger";
import { MOCK_BOOKMAKERS } from "../../../../lib/api/mock/bookmakers";

const RECOVERY_COLOR: Record<string, string> = {
  None: "black",
  Resolved: "text-green-700",
  "Cashout Available": "text-black",
  "Left Open": "text-red-700",
};

function logoFor(name: string): string | undefined {
  return MOCK_BOOKMAKERS.find((b) => b.name === name)?.logo;
}

/**
 * Per-leg outcome. The entry only records an overall status, but a partial
 * ticket names its failing book in `finalOutcome` — the only signal available
 * for which leg went down.
 */
function legStatus(entry: LedgerEntry, bookmaker: string): "Placed" | "Failed" {
  if (entry.status === "Placed") return "Placed";
  if (entry.status === "Failed") return "Failed";
  return entry.finalOutcome.toLowerCase().includes(bookmaker.toLowerCase())
    ? "Failed"
    : "Placed";
}

function Panel({
  icon: Icon,
  headline,
  className,
  children,
}: {
  icon: LucideIcon;
  headline: string;
  /** Carries the flex sizing — the min-width is what forces the strip to scroll */
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`px-6 flex flex-col justify-between gap-3 ${className ?? ""}`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <Icon size={18} strokeWidth={1.75} className="text-gray-900 shrink-0" />
        <span className="grotesk text-[19px] text-gray-900 truncate">
          {headline}
        </span>
      </div>
      {children}
    </div>
  );
}

/**
 * Two adjacent segments with a gap between them — the leading share is filled,
 * the remainder stays neutral. Both carry the recessed inset the toggle uses.
 */
function SplitBar({
  percent,
  fillClass,
}: {
  percent: number;
  fillClass: string;
}) {
  const width = Math.min(100, Math.max(0, percent));

  return (
    <div className="flex items-center gap-1.5 w-full">
      <div
        className={`h-5 rounded-sm border shrink-0 ${fillClass}`}
        style={{
          width: `${width}%`,
        }}
      />
      <div className="h-5 flex-1 rounded-sm bg-gray-200" />
    </div>
  );
}

export default function RowDetails({ entry }: { entry: LedgerEntry }) {
  const legCount = entry.bookmakers.length;
  const placed = entry.bookmakers.filter(
    (b) => legStatus(entry, b) === "Placed",
  ).length;
  const failed = legCount - placed;

  // No per-leg stake is recorded, so the ticket total is split evenly
  const perLeg = legCount ? entry.totalStake / legCount : 0;
  const leadBookmaker = entry.bookmakers[0] ?? "—";
  const restBookmakers = entry.bookmakers.slice(1);

  // P/L as a share of what was staked — the return rate on this ticket
  const returnPercent = entry.totalStake
    ? (Math.abs(entry.verifiedPnl) / entry.totalStake) * 100
    : 0;

  const pnlColor =
    entry.verifiedPnl > 0
      ? "text-green-700"
      : entry.verifiedPnl < 0
        ? "text-red-700"
        : "text-gray-500";

  // Majority segment takes its colour from how the ticket actually resolved
  const pnlFill =
    entry.verifiedPnl > 0
      ? "bg-green-600 border-green-700"
      : entry.verifiedPnl < 0
        ? "bg-red-500 border-red-600"
        : "bg-gray-300 border-gray-400";

  return (
    // Only this strip scrolls sideways; the table row itself never does
    <div className="overflow-x-auto">
      <div className="flex divide-x-2 divide-gray-200 divide-dashed py-5">
        {/* Stake, split across the two sides of the arb */}
        <Panel
          icon={Coins}
          headline={`₦${entry.totalStake.toLocaleString()}`}
          className="flex-1 min-w-72"
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-[13px] mb-0.5 text-black truncate">
                  {leadBookmaker}
                </div>
                <div className="text-[12px] grotesk text-gray-900">
                  ₦{Math.round(perLeg).toLocaleString()}
                </div>
              </div>

              <div className="text-[13px] text-gray-400 pt-0.5 shrink-0">x</div>

              <div className="min-w-0 text-right">
                <div className="text-[13px] text-black mb-0.5 truncate">
                  {restBookmakers.join(" / ") || "—"}
                </div>
                <div className="text-[12px] grotesk text-gray-900">
                  ₦{Math.round(perLeg * restBookmakers.length).toLocaleString()}
                </div>
              </div>
            </div>

            <SplitBar
              percent={legCount ? 100 / legCount : 0}
              fillClass="bg-orange-500 border-orange-600"
            />
          </div>
        </Panel>

        {/* Formula, with the shape of the arb underneath */}
        <Panel
          icon={Sigma}
          headline={entry.formula}
          className="flex-1 min-w-52"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-[12px] text-gray-600">Stake / leg</div>
              <div className="text-[14px] grotesk text-gray-900">
                ₦{Math.round(perLeg).toLocaleString()}
              </div>
            </div>

            <div className="min-w-0 text-right">
              <div className="text-[12px] text-gray-600">Books</div>
              <div className="text-[14px] text-gray-900 grotesk">
                {legCount}
              </div>
            </div>
          </div>
        </Panel>

        {/* Leg count carries the return figures */}
        <Panel
          icon={Split}
          headline={`${legCount} legs`}
          className="flex-1 min-w-56"
        >
          <div className="flex flex-col gap-1">
            <div className="text-[13px] text-black">
              {placed} placed{failed > 0 && ` · ${failed} failed`}
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-[12px] text-gray-600">P/L</div>
                <div className={`text-[14px] ${pnlColor} grotesk`}>
                  {entry.verifiedPnl > 0 ? "+" : ""}₦
                  {entry.verifiedPnl.toLocaleString()}
                </div>
              </div>

              <div className="min-w-0 text-right">
                <div className="text-[12px] text-gray-600">Return</div>
                <div className={`text-[14px] ${pnlColor} grotesk`}>
                  {entry.verifiedPnl < 0 ? "−" : ""}
                  {returnPercent.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </Panel>

        {/* Formula and recovery, with the bar coloured by the result */}
        <Panel
          icon={RotateCcw}
          headline={"Recovery"}
          className="flex-1 min-w-52"
        >
          <div className="flex flex-col gap-3">
            <div
              className={`text-[14px]  ${RECOVERY_COLOR[entry.recoveryStatus]}`}
            >
              {entry.recoveryStatus === "None" ? "None" : entry.recoveryStatus}
            </div>

            <SplitBar
              percent={legCount ? (placed / legCount) * 100 : 0}
              fillClass={pnlFill}
            />
          </div>
        </Panel>

        {/* Outcome, then every leg and how it landed */}
        <Panel icon={StickyNote} headline="Outcome" className="flex-1 min-w-72">
          <div className="text-[13px] -mt-2 mb-2 text-gray-800">
            {entry.finalOutcome}
          </div>

          <div className="flex flex-col gap-1.5">
            {entry.bookmakers.map((bookmaker) => {
              const status = legStatus(entry, bookmaker);

              return (
                <div
                  key={bookmaker}
                  className="flex items-center justify-between gap-3 min-w-0"
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <img
                      src={logoFor(bookmaker)}
                      alt=""
                      className="w-4 h-4 rounded-full object-cover bg-gray-200 shrink-0"
                    />
                    <span className="text-[13px] text-gray-900 truncate">
                      {bookmaker}
                    </span>
                  </span>

                  <span
                    className={`text-[13px] shrink-0 ${
                      status === "Placed" ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {status}
                  </span>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>
    </div>
  );
}
