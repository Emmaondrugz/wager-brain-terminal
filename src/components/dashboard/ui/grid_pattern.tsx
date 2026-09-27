import { useId } from "react";

/** Cell size, matching EmptyStatePattern's 24px rhythm. */
const CELL = 24;

/** Which cells get tinted, cycled by `seed` so stacked rows aren't identical. */
const ACCENT_COLUMNS = [[3], [8, 14], [], [1, 11], [6], [], [4, 16], [10]];

interface GridRowPatternProps {
  /** Varies the tinted cells between consecutive filler rows. */
  seed?: number;
}

/**
 * One row's worth of ledger grid: vertical rules every 24px plus a top border,
 * so a stack of these reads as a continuation of the table's own rows.
 */
export function GridRowPattern({ seed = 0 }: GridRowPatternProps) {
  // useId embeds colons, which are legal in ids but awkward in url() refs
  const patternId = `ledger-grid-${useId().replace(/:/g, "")}`;
  const accents = ACCENT_COLUMNS[seed % ACCENT_COLUMNS.length];

  return (
    <svg
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      className="block"
    >
      <defs>
        <pattern
          id={patternId}
          width={CELL}
          height={CELL}
          patternUnits="userSpaceOnUse"
        >
          <rect width={CELL} height={CELL} fill="#ffffff" />
          <line
            x1="0"
            y1="0"
            x2="0"
            y2={CELL}
            stroke="#f2f2f0"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill={`url(#${patternId})`} />

      {accents.map((col) => (
        <rect
          key={col}
          x={col * CELL}
          y="0"
          width={CELL}
          height="100%"
          fill="#f4f4f2"
        />
      ))}

      {/* Row divider, mirroring the data rows' border-b */}
      <line
        x1="0"
        y1="0.25"
        x2="100%"
        y2="0.25"
        stroke="#f2f2f0"
        strokeWidth="0.5"
      />
    </svg>
  );
}
