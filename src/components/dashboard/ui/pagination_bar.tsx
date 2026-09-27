import { useState, useRef, useLayoutEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function getVisiblePages(
  current: number,
  total: number,
  windowSize = 3,
): number[] {
  if (total <= windowSize) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  let start = current - 1;
  let end = current + 1;

  if (start < 1) {
    start = 1;
    end = windowSize;
  } else if (end > total) {
    end = total;
    start = total - windowSize + 1;
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export default function PaginationBar({
  safePage,
  totalPages,
  setCurrentPage,
}: {
  safePage: number;
  totalPages: number;
  setCurrentPage: (updater: (p: number) => number) => void;
}) {
  const visiblePages = getVisiblePages(safePage, totalPages);

  const pageRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const [pillStyle, setPillStyle] = useState({ x: 0, width: 0, opacity: 0 });

  useLayoutEffect(() => {
    const btn = pageRefs.current[safePage];
    const container = containerRef.current;
    if (btn && container) {
      const btnRect = btn.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setPillStyle({
        x: Math.round(btnRect.left - containerRect.left),
        width: Math.round(btnRect.width),
        opacity: 1,
      });
    }
  }, [safePage, visiblePages.join(",")]);

  return (
    <div className="absolute bg-[#0a0a0a] text-white mx-auto rounded-sm bottom-3 shadow-lg w-fit my-5 flex justify-center left-1/2 -translate-x-1/2 z-20">
      <div className="flex items-center gap-1 p-1 rounded-[inherit]">
        <button
          onClick={() => {
            if (safePage === 1) return;
            setCurrentPage((p) => Math.max(1, p - 1));
          }}
          disabled={safePage === 1}
          className="flex items-center gap-1 px-2 py-1 rounded-sm text-[13px] text-white/90 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronLeft size={15} strokeWidth={2} />
          Previous
        </button>

        <div className="w-px h-4 bg-white/20" />

        <div
          ref={containerRef}
          className="relative flex items-center gap-1 px-1"
        >
          {/* Moving square indicator */}
          <div
            className="absolute top-0 h-7 bg-white rounded-sm transition-all duration-200 pointer-events-none"
            style={{
              left: pillStyle.x,
              width: pillStyle.width,
              opacity: pillStyle.opacity,
              boxShadow:
                "0 2px 0 0 rgba(255,255,255,0.9) inset, 0 -2px 0 0 rgba(0,0,0,0.12) inset, 0 2px 3px rgba(0,0,0,0.25)",
            }}
          />

          {visiblePages.map((page) => (
            <button
              key={page}
              ref={(el) => {
                pageRefs.current[page] = el;
              }}
              onClick={() => setCurrentPage(() => page)}
              className={`relative z-10 text-[13px] w-7 h-7 rounded-sm cursor-pointer transition-colors ${
                page === safePage
                  ? "text-black"
                  : "text-white/70 hover:bg-white/10"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <div className="w-px h-4 bg-white/20" />

        <button
          onClick={() => {
            if (safePage === totalPages) return;
            setCurrentPage((p) => Math.min(totalPages, p + 1));
          }}
          disabled={safePage === totalPages}
          className="flex items-center gap-1 px-2 py-1 rounded-sm text-[13px] text-white/90 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Next
          <ChevronRight size={15} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
