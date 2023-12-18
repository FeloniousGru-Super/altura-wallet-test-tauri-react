import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import GettingStart from "./pages/GettingStart";
import { Paper } from "@mui/material";
import CreateWallet from "./pages/CreateWallet";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ImportWallet from "./pages/ImportWallet";
import AccountDetailModal from "./components/modals/AccountDetail.modal";
import ImportTokenModal from "./components/modals/ImportToken.modal";

function App() {
  return (
    <Paper sx={{ height: "100vh", overflowY: "auto" }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/gettingstart" element={<GettingStart />} />
        <Route path="/createwallet" element={<CreateWallet />} />
        <Route path="/importwallet" element={<ImportWallet />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
      <ToastContainer />
      <AccountDetailModal />
      <ImportTokenModal />
    </Paper>
  );
}

export default App;
