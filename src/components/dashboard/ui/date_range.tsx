import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Modal from "../../ui/modal";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTHS_SHORT = MONTHS.map((month) => month.slice(0, 3));

export interface DateRangeValue {
  start: Date | null;
  end: Date | null;
}

interface DateRangeProps {
  open: boolean;
  onClose: () => void;
  onApply: (range: DateRangeValue) => void;
  value?: DateRangeValue;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, count: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + count, 1);
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function formatDate(date: Date): string {
  return `${MONTHS_SHORT[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

/**
 * Six fixed weeks starting on Monday, so the grid height never changes as you
 * page between months. Leading/trailing cells spill into the adjacent months.
 */
function buildMonthGrid(monthStart: Date): Date[] {
  const mondayOffset = (monthStart.getDay() + 6) % 7;

  return Array.from({ length: 42 }, (_, i) => {
    return new Date(
      monthStart.getFullYear(),
      monthStart.getMonth(),
      1 - mondayOffset + i,
    );
  });
}

function ChevronButton({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;

  return (
    <div className="w-fit h-fit border-l border-b-2 bg-gray-200 active:scale-95 rounded-sm border-gray-200">
      <button
        type="button"
        onClick={onClick}
        aria-label={direction === "prev" ? "Previous month" : "Next month"}
        className="w-6 h-6 flex items-center justify-center bg-white rounded-sm cursor-pointer border-b-2 active:border-b-transparent bg-clip-padding transition-all duration-200 border-r-[1.5px] border-t-[1.5px] border-gray-200"
      >
        <Icon size={16} strokeWidth={2.25} className="text-gray-400" />
      </button>
    </div>
  );
}

export default function DateRange({
  open,
  onClose,
  onApply,
  value,
}: DateRangeProps) {
  const [viewMonth, setViewMonth] = useState<Date>(
    startOfMonth(value?.start ?? new Date()),
  );
  const [start, setStart] = useState<Date | null>(value?.start ?? null);
  const [end, setEnd] = useState<Date | null>(value?.end ?? null);
  // Lets the range shade follow the cursor before the second click lands
  const [hovered, setHovered] = useState<Date | null>(null);

  const today = new Date();
  const rangeEnd = end ?? hovered;

  const handleDayClick = (day: Date) => {
    // A complete range (or none at all) means this click starts a new one
    if (!start || end) {
      setStart(day);
      setEnd(null);
      return;
    }

    if (day < start) {
      setStart(day);
      setEnd(start);
    } else {
      setEnd(day);
    }
  };

  const handleApply = () => {
    if (!start || !end) return;
    onApply({ start, end });
    onClose();
  };

  const handleCancel = () => {
    setStart(value?.start ?? null);
    setEnd(value?.end ?? null);
    onClose();
  };

  const renderMonth = (monthStart: Date) => (
    // Fixed width so both panels match regardless of month-name length
    <div className="w-72 shrink-0 px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        <ChevronButton
          direction="prev"
          onClick={() => setViewMonth((m) => addMonths(m, -1))}
        />
        <div className="text-[14px] poppins font-normal whitespace-nowrap">
          {MONTHS[monthStart.getMonth()]} {monthStart.getFullYear()}
        </div>
        <ChevronButton
          direction="next"
          onClick={() => setViewMonth((m) => addMonths(m, 1))}
        />
      </div>

      <div className="grid grid-cols-7 mt-4">
        {WEEKDAYS.map((weekday) => (
          <div
            key={weekday}
            className="h-8 flex items-center justify-center text-[13px] text-gray-800"
          >
            {weekday}
          </div>
        ))}

        {buildMonthGrid(monthStart).map((day) => {
          const isOutside = day.getMonth() !== monthStart.getMonth();
          const isStart = start ? isSameDay(day, start) : false;
          const isEnd = end ? isSameDay(day, end) : false;
          const isEndpoint = isStart || isEnd;

          const isInRange =
            start && rangeEnd
              ? day > (start < rangeEnd ? start : rangeEnd) &&
                day < (start < rangeEnd ? rangeEnd : start)
              : false;

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => handleDayClick(day)}
              onMouseEnter={() => setHovered(day)}
              onMouseLeave={() => setHovered(null)}
              className={`relative h-9 text-[13px] cursor-pointer transition-colors duration-150 ${
                isEndpoint
                  ? "bg-black text-white rounded-sm"
                  : isInRange
                    ? "bg-gray-100"
                    : "hover:bg-gray-100 rounded-sm"
              } ${isOutside && !isEndpoint ? "text-gray-300" : ""}`}
            >
              {day.getDate()}

              {isSameDay(day, today) && (
                <span
                  className={`absolute left-1/2 bottom-1 -translate-x-1/2 w-1 h-1 rounded-full ${
                    isEndpoint ? "bg-white" : "bg-orange-500"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <Modal open={open} onClose={onClose} boxClassName="p-0 w-fit h-fit">
      <div className="flex">
        {renderMonth(viewMonth)}
        <div className="w-[0.5px] bg-gray-200" />
        {renderMonth(addMonths(viewMonth, 1))}
      </div>

      <div className="h-px bg-gray-200" />

      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="text-[13px] w-35 border border-gray-200 rounded-sm px-3 py-2">
            {start ? formatDate(start) : "Start date"}
          </div>
          <span className="text-gray-400">–</span>
          <div className="text-[13px] w-35 border border-gray-200 rounded-sm px-3 py-2">
            {end ? formatDate(end) : "End date"}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-fit h-fit border-l border-b-2 bg-gray-200 active:scale-95 rounded-sm border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="text-[13px] shadow-xs active:border-b-transparent bg-clip-padding cursor-pointer text-gray-800 flex items-center justify-center border-t-[1.5px] border-r-[1.5px] border-b-2 border-gray-200 bg-white px-4 py-1.5 rounded-sm"
            >
              Cancel
            </button>
          </div>

          <div
            className={`w-fit h-fit border-l border-b-2 bg-black rounded-sm border-black ${
              start && end ? "active:scale-95" : "opacity-50"
            }`}
          >
            <button
              type="button"
              disabled={!start || !end}
              onClick={handleApply}
              className={`text-[13px] shadow-xs bg-clip-padding text-white flex items-center justify-center border-t-[1.5px] border-r-[1.5px] border-b-2 border-black px-4 py-1.5 rounded-sm ${
                start && end
                  ? "cursor-pointer active:border-b-transparent"
                  : "cursor-not-allowed"
              }`}
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
