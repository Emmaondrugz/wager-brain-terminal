// src/routes/Dashboard.tsx
import Overview from "../components/dashboard/overview";
import Table from "../components/dashboard/ui/table_widget";

export default function Dashboard() {
  return (
    <div className="flex flex-col h-full overflow-hidden overview_scroll">
      <Overview />
      <Table />
    </div>
  );
}
