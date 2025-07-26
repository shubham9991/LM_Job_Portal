import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AdminHelpRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHelpRequests = async () => {
    try {
      const res = await fetch("https://lmap.in/api/help?status=open", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setRequests(data.data.requests);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch help requests.");
    } finally {
      setLoading(false);
    }
  };

  const resolveHelpRequest = async (id) => {
    try {
      const res = await fetch(
        `https://lmap.in/api/help/${id}/resolve`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setRequests((prev) => prev.filter((req) => req.id !== id));
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to resolve request.");
    }
  };

  useEffect(() => {
    fetchHelpRequests();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Open Help Requests</h2>
      {loading ? (
        <p>Loading...</p>
      ) : requests.length === 0 ? (
        <p>No open help requests.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Subject</th>
                <th className="p-2 border">Message</th>
                <th className="p-2 border">User</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Role</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id}>
                  <td className="p-2 border">{req.subject}</td>
                  <td className="p-2 border">{req.message}</td>
                  <td className="p-2 border">{req.requester.name}</td>
                  <td className="p-2 border">{req.requester.email}</td>
                  <td className="p-2 border">{req.requester.role}</td>
                  <td className="p-2 border">{new Date(req.created_at).toLocaleString()}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() => resolveHelpRequest(req.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                    >
                      Resolve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminHelpRequests;
