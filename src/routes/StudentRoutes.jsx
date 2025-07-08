import { Routes, Route } from "react-router-dom";
import Dashboard from "../components/dashboard/Dashboard";

export default function StudentRoutes() {
  return (
    <Routes>
      <Route path="/student/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
