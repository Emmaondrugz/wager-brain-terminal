import { useState } from "react";
import Execution_Widget from "./execution_widget";

export default function Exec_Card() {
  const [queue, setQueue] = useState<boolean>(true);

  return (
    <div className="px-4 pt-4 pb-7 border-b border-gray-200">
      <div className="flex flex-col gap-3 h-49 justify-between">
        <div className="flex justify-between items-center">
          <div className="text-sm poppins">
            {queue ? "Current Executions" : "No active Executions"}
          </div>

          <div className="p-2 cursor-pointer flex items-center justify-center rounded-full border border-b-2 border-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="18px"
              viewBox="0 -960 960 960"
              width="18px"
              fill="#000"
            >
              <path d="M645.77-647.85 272.46-274.92q-8.31 8.3-20.88 8.11-12.58-.19-20.89-8.5-8.3-8.31-8.3-20.69t8.3-20.69L603.62-690H275.77q-12.75 0-21.38-8.63-8.62-8.63-8.62-21.38 0-12.76 8.62-21.37 8.63-8.62 21.38-8.62h393.84q15.37 0 25.76 10.39 10.4 10.4 10.4 25.76V-320q0 12.75-8.63 21.37-8.63 8.63-21.38 8.63-12.76 0-21.38-8.63-8.61-8.62-8.61-21.37v-327.85Z" />
            </svg>
          </div>
        </div>

        {/* Que details */}
        {queue ? <Execution_Widget /> : <div className="text-6xl">--</div>}
      </div>
    </div>
  );
}
