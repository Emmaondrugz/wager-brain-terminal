import { useState } from "react";

export default function Total() {
  const [total, SetTotal] = useState(true);

  return (
    <div className="flex flex-col h-fit border-b border-gray-200 justify-between gap-10 w-full p-4 mx-auto bg-cover bg-center bg-no-repeat">
      <div>
        <div className="flex justify-between w-full items-center">
          <div className="p-2 w-fit h-fit flex items-center border-b-2 justify-center rounded-full border border-gray-200 bg-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-chart-pie-icon lucide-chart-pie"
            >
              <path d="M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z" />
              <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
            </svg>
          </div>

          {/* Total Amount placed*/}
          <div>
            {total ? (
              <div className="text-xl flex grotesk gap-1">
                <span className="text-orange-600">$</span>
                {""}
                <div>200</div>
              </div>
            ) : (
              <div className="text-6xl">--</div>
            )}
          </div>
        </div>

        <div className="w-full">
          <img
            src="/graph_line2.png"
            alt=""
            className="w-full h-full object-cover -rotate-3"
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <div className="text-base">Executed Today</div>
          <div className="text-xs text-gray-700">Total Bets Placed</div>
        </div>
      </div>
    </div>
  );
}
