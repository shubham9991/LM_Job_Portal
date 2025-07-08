import JobCard from "./components/Job/JobCard";
import Sidebar from "./components/navigation/Sidebar";
import UserProfileCard from "./components/profileCard/CandidateProfilePanel";
import TeacherApplicationForm from "./components/teacherJobApplyForm/Teachers_Application_Form";
import JobPostForm from "./components/jobPost/JobPostForm";
import ApplicationsBoard from "./components/applicationBoard/ApplicationsBoard_School";
import JobDetails from "./components/JobDetails";


function App() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="min-h-screen flex">
        <UserProfileCard/>
        </div>

      <TeacherApplicationForm/>
        {/* <h1 className="text-2xl font-bold">Main Content</h1> */}
        <JobCard />
        <JobPostForm />
        <ApplicationsBoard />
        <JobDetails/>
      </div>
    </div>
  );
}

export default App;
