import Exec_Card from "../dashboard/ui/execution_que";
import Widget from "../dashboard/ui/notification_wdiget";
import Total from "../dashboard/ui/total_arbed";

export default function Overivew_Aside() {
  return (
    <div className="w-70 bg-white nav-scroll h-screen flex flex-col overflow-y-auto pb-24">
      <div className="shrink-0">
        {/* Execution Que Card */}
        <Exec_Card />

        <div className="w-full bg-cover bg-center flex justify-start items-start">
          {/* Total staked */}
          <Total />
        </div>
      </div>

      <div className="flex-1 min-h-0 max-h-170 flex flex-col">
        {/* Notification Widget */}
        <Widget />
      </div>
    </div>
  );
}
