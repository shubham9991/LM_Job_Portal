import { useOutletContext } from "react-router-dom";
import SearchBar from "../navigation/SearchBar";
import Sidebar from "../navigation/Sidebar";

const Dashboard = () => {
  const user = useOutletContext();
  console.log(user, "user");
  return (
    <div>
      {user?.type === "teacher" ? (
        <>
          <SearchBar />
        </>
      ) : (
        <div className="space-y-2">
          <Sidebar />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
