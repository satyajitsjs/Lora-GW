import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Users/Login";
import Dashboard from "./components/DashBoard/Dashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Device from "./components/Devices/Device";
import Settings from "./components/Settings/Settings";
import UsersSettings from "./components/Users/UsersSettings";
import Brocker from "./components/Brocker/Brocker";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/device" element={<Device />} />
          <Route path="/brocker" element={<Brocker />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/usersetiings" element={<UsersSettings />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-center" />
    </>
  );
};

export default App;
