import { Button } from "@/components/ui/button";
import Login from "./components/auth/Login";
import Sidebar from "./components/navigation/Sidebar";
import Layout from "./components/ui/Layout";
import Dashboard from "./components/ui/Dashboard";
import SkillsSection from "./components/ui/SkillsSection";

function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      {/* <Button>Click me</Button>
       */}
      {/* <Login /> */}
      <Layout>
        <Dashboard />
        {/* <SkillsSection /> */}
      </Layout>
    </div>
  );
}

export default App;
