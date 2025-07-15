import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const loggedInUser = {
  type: "teacher",
};

function App() {
  return (
    <Router>
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
