import { useState } from "react";

export default function Overview() {
  const [hasData, setHasData] = useState<boolean>(true);

  const CARDS = [
    {
      index: "001",
      label: "Arbs Available",
      value: 14,
      activeBars: 1,
    },
    {
      index: "002",
      label: "Provider sessions",
      value: 3,
      activeBars: 2,
    },
    {
      index: "003",
      label: "Bookmaker sessions",
      value: 8,
      activeBars: 3,
    },
  ];

  return (
    <div className="w-full flex shrink-0">
      <div
        className="h-fit w-full bg-cover bg-right flex justify-start items-start p-5"
        style={{ backgroundImage: "url('/banner_img.png')" }}
      >
        <div className="flex w-full shadow-xl">
          {CARDS.map((card, i) => (
            <div
              key={card.label}
              className={`flex-1 bg-white flex h-50 justify-between p-5 border-r flex-col items-start gap-3 border-b border-gray-200 ${
                i === 0 ? "rounded-l-md" : ""
              } ${i === CARDS.length - 1 ? "rounded-r-md" : ""}`}
            >
              <div className="flex justify-between items-center w-full">
                <div className="grotesk text-sm">{card.index}</div>
                <div className="flex gap-0.75 h-3">
                  {Array.from({ length: 4 }).map((_, barIndex) => (
                    <div
                      key={barIndex}
                      className={`w-0.75 h-full ${
                        hasData && barIndex < card.activeBars
                          ? "bg-orange-600"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col w-full gap-5">
                <div className="text-6xl">{hasData ? card.value : "--"}</div>
                <div className="w-full h-px bg-gray-200"></div>
                <div className="flex justify-between items-center">
                  <div className="text-sm">{card.label}</div>
                  <div className="w-fit h-fit border-l border-b-2 bg-black active:scale-95 rounded-sm border-black">
                    <div
                      className="w-8 h-8 shadow-xs active:border-b-transparent bg-clip-padding flex rounded-sm justify-center items-center cursor-pointer p-2 text-white border-t-[1.5px] border-r-[1.5px] border-b-2 border-black"
                      style={{
                        backgroundImage:
                          "linear-gradient(to bottom, #111, #0a0a0a)",
                        boxShadow:
                          "0px 2px 0px 0px rgba(255,255,255,0.15) inset",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#fff"
                      >
                        <path d="M579-480 285-774q-15-15-14.5-35.5T286-845q15-15 35.5-15t35.5 15l307 308q12 12 18 27t6 30q0 15-6 30t-18 27L356-115q-15 15-35 14.5T286-116q-15-15-15-35.5t15-35.5l293-293Z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
