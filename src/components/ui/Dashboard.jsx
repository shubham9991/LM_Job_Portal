const Dashboard = () => {
  return (
    <div className="grid grid-cols-12 min-h-screen gap-4 p-4 bg-gray-100">
      <aside className="col-span-3 bg-white rounded-xl p-4 shadow">
        {/* Profile */}
        <div className="text-center">
          <img
            src="https://via.placeholder.com/100"
            alt="Profile"
            className="w-24 h-24 mx-auto rounded-full border-4 border-green-500"
          />
          <h2 className="text-xl font-semibold mt-2">Alfred Bryant</h2>
          <p className="text-sm text-gray-500">adrain.nader@yahoo.com</p>
        </div>

        {/* Recent Activity */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Recent Activities</h3>
            <a href="#" className="text-sm text-green-600 font-medium">
              View All
            </a>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="bg-green-100 p-2 rounded">
              ✅ Your application has been accepted by 3 schools
            </li>
            <li className="bg-red-100 p-2 rounded">
              📅 You have an interview at 1 pm today
            </li>
            <li className="bg-red-100 p-2 rounded">
              📅 You have an interview at 1 pm today
            </li>
          </ul>
        </div>
      </aside>

      <main className="col-span-9 space-y-6">
        {/* Shortlisted Jobs */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            🎉 Shortlisted Job Opportunities
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-xl shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">
                      Elementary Mathematics Teacher
                    </h3>
                    <p className="text-sm text-gray-500">School Name</p>
                    <p className="text-sm text-gray-500">
                      📍 Delhi · 🕒 Full time · 💰 10 LPA · ⏰ 29 min ago
                    </p>
                  </div>
                  <span className="text-green-600 text-sm font-bold">
                    Active
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Mollit in laborum tempor Lorem incididunt... lorem ipsum dolor
                  sit amet.
                </p>
                <button className="mt-4 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
