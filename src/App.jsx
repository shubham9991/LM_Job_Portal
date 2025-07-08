import { BrowserRouter as Router } from "react-router-dom";
import StudentRoutes from "./routes/StudentRoutes";
import TeacherRoutes from "./routes/TeacherRoutes";

const loggedInUser = {
  type: "teacher",
};

function App() {
  return (
    <Router>
      {loggedInUser.type === "teacher" ? <TeacherRoutes /> : <StudentRoutes />}
    </Router>
  );
}

export default App;
