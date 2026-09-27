import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import Shell from "./components/layout/shell";
import Dashboard from "./routes/Dashboard";
// import ProviderImport from "./routes/ProviderImport";
// import ImportedArbs from "./routes/ImportedArbs";
// import ExecutionDesk from "./routes/ExecutionDesk";
// import RecoveryDesk from "./routes/RecoveryDesk";
// import BookmakerProfiles from "./routes/BookmakerProfiles";
// import ProviderProfiles from "./routes/ProviderProfiles";
// import ProxyProfiles from "./routes/ProxyProfiles";
// import Ledger from "./routes/Ledger";
// import Settings from "./routes/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Shell />}>
          <Route path="/" element={<Dashboard />} />
          {/* <Route path="/provider-import" element={<ProviderImport />} />
          <Route path="/imported-arbs" element={<ImportedArbs />} />
          <Route path="/execution-desk" element={<ExecutionDesk />} />
          <Route path="/recovery-desk" element={<RecoveryDesk />} />
          <Route path="/bookmaker-profiles" element={<BookmakerProfiles />} />
          <Route path="/provider-profiles" element={<ProviderProfiles />} />
          <Route path="/proxy-profiles" element={<ProxyProfiles />} />
          <Route path="/ledger" element={<Ledger />} />
          <Route path="/settings" element={<Settings />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
