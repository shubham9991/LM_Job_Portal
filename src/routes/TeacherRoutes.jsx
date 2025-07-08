import { Routes, Route } from "react-router-dom";
import Dashboard from "../components/dashboard/Dashboard";

export default function TeacherRoutes() {
  return (
    <Routes>
      <Route path="/teacher/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
