// src/components/ui/side_nav.tsx
import {
  useState,
  useRef,
  useLayoutEffect,
  type Dispatch,
  type SetStateAction,
} from "react";
import { NAV_GROUPS } from "../../types/nav";
import "../../index.css";

const ICON_SIZE = 16;
const ICON_STROKE = 2;
const ICON_CLASS = "text-black mb-1";
const ICON_CLASS_ACTIVE = "text-orange-400 mb-1 transition-all duration-300";

export type NavItem = string;

interface AsideProps {
  active: NavItem;
  setActive: Dispatch<SetStateAction<NavItem>>;
}

export default function Aside({ active, setActive }: AsideProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pillStyle, setPillStyle] = useState({ y: 0, height: 0, opacity: 0 });

  useLayoutEffect(() => {
    const btn = buttonRefs.current[active];
    const container = navRef.current;
    if (btn && container) {
      const btnRect = btn.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setPillStyle({
        y: Math.round(btnRect.top - containerRect.top + container.scrollTop),
        height: Math.round(btnRect.height),
        opacity: 1,
      });
    }
  }, [active]);

  return (
    <div className="w-60 bg-white h-screen flex flex-col justify-between">
      {/* Logo — fixed, not part of the scroll area */}
      <div className="flex items-center justify-between min-[1600px]:border-0 gap-3 px-5 py-2 shrink-0">
        <div className="w-8 h-8">
          <img
            src="src/assets/wager.png"
            alt="WagerBrain Logo"
            className="w-full h-full object-contain"
          />
        </div>
        {/* Window controls */}
        <div className="flex gap-2 z-50">
          <button
            className="w-2.5 h-2.5 rounded-full cursor-pointer bg-yellow-400 hover:brightness-90 transition"
            aria-label="Minimize"
          />
          <button
            className="w-2.5 h-2.5 rounded-full cursor-pointer bg-green-500 hover:brightness-90 transition"
            aria-label="Resize"
          />
          <button
            className="w-2.5 h-2.5 rounded-full cursor-pointer bg-red-500 hover:brightness-90 transition"
            aria-label="Close"
          />
        </div>
      </div>

      {/* Nav — the only scrollable region */}
      <div className="relative flex-1 min-h-0">
        <div
          ref={navRef}
          className="nav-scroll relative h-full overflow-y-auto flex flex-col gap-5 px-3 py-2"
        >
          {/* Moving pill — tracks whichever button is active, across all groups */}
          <div
            className="absolute left-3 right-3 top-0 rounded-sm border-l border-b-2 bg-black border-black transition-transform duration-200 pointer-events-none"
            style={{
              transform: `translateY(${pillStyle.y}px)`,
              height: pillStyle.height,
              opacity: pillStyle.opacity,
              willChange: "transform",
            }}
          >
            <div
              className="w-full h-full rounded-sm shadow-xs bg-clip-padding border-t-[1.5px] border-r-[1.5px] border-b-2 border-black"
              style={{
                backgroundImage: "linear-gradient(to bottom, #111, #0a0a0a)",
                boxShadow: "0px 2px 0px 0px rgba(255,255,255,0.15) inset",
              }}
            />
          </div>

          {NAV_GROUPS.map((group) => (
            <div
              key={group.groupLabel}
              className="relative flex flex-col gap-0.5"
            >
              <span className="text-[11px] poppins uppercase tracking-wide text-gray-600 px-2 mb-1 text-left">
                {group.groupLabel}
              </span>

              {group.items.map((item) => {
                const isActive = item.label === active;
                const Icon = item.icon;

                return (
                  <button
                    key={item.label}
                    ref={(el) => {
                      buttonRefs.current[item.label] = el;
                    }}
                    onClick={() => setActive(item.label)}
                    className={`relative z-10 cursor-pointer rounded-sm px-2 py-2 gap-2.5 transition-colors duration-200 w-full flex items-center ${!isActive && "hover:bg-gray-100"}`}
                  >
                    <Icon
                      size={ICON_SIZE}
                      strokeWidth={ICON_STROKE}
                      className={isActive ? ICON_CLASS_ACTIVE : ICON_CLASS}
                    />
                    <span
                      className={`poppins text-[13px] ${
                        isActive ? "text-white" : "text-black"
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Licensing — fixed, not part of the scroll area */}
      <div className="shrink-0 pb-3 w-full">
        <div className="h-fit w-[90%] mx-auto border border-gray-200 rounded-sm flex flex-col p-2 bg-white">
          <div
            className="h-18 w-full bg-cover bg-center relative rounded-sm overflow-hidden"
            style={{ backgroundImage: "url('/nav_grad.png')" }}
          >
            <div className="absolute inset-0 bg-black/30"></div>
          </div>

          <div className="mt-3 flex flex-col gap-1 px-2 max-w-full">
            <div className="flex justify-start items-center gap-2 w-full">
              <div className="text-sm font-medium">Coming Soon</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="16px"
                viewBox="0 -960 960 960"
                width="16px"
              >
                <path
                  d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Z"
                  fill="#EA580C"
                />
                <path
                  d="m424-424-86-86q-11-11-28-11t-28 11q-11 11-11 28t11 28l114 114q12 12 28 12t28-12l226-226q11-11 11-28t-11-28q-11-11-28-11t-28 11L424-424Z"
                  fill="white"
                />
              </svg>
            </div>

            <div className="text-xs poppins mt-1 text-gray-900 tracking-wide">
              Get real-time verification and unlimited tickets
            </div>
          </div>

          <div className="w-full h-fit mt-3 border-l border-b-2 bg-black active:scale-95 rounded-sm border-black">
            <button
              className="text-[13px] shadow-xs w-full active:border-b-transparent bg-clip-padding cursor-pointer text-white poppins gap-1.5 flex items-center text-center justify-center border-t-[1.5px] border-r-[1.5px] border-b-2 border-black px-3 py-1.5 rounded-sm"
              style={{
                backgroundImage: "linear-gradient(to bottom, #111, #0a0a0a)",
                boxShadow: "0px 2px 0px 0px rgba(255,255,255,0.15) inset",
              }}
            >
              License
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
