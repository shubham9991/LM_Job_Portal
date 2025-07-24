import React, { useEffect, useState } from "react";
import { fetchOpenHelpRequests, resolveHelpRequest } from "@/api/help";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

export default function AdminHelpTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const res = await fetchOpenHelpRequests();
      if (res?.success) {
        setTickets(res.data.requests || []);
      } else {
        toast.error(res?.message || "Failed to load tickets");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleResolve = async (id) => {
    try {
      await resolveHelpRequest(id);
      toast.success("Marked resolved");
      loadTickets();
    } catch (err) {
      console.error(err);
      toast.error("Failed to resolve");
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Open Help Tickets</h1>
      {loading ? (
        <p>Loading...</p>
      ) : tickets.length === 0 ? (
        <p>No open tickets</p>
      ) : (
        <ul className="space-y-3">
          {tickets.map((t) => (
            <li key={t.id} className="border p-4 rounded-md bg-white flex justify-between">
              <div>
                <p className="font-medium">{t.subject}</p>
                <p className="text-sm text-gray-600">{t.message}</p>
                <p className="text-xs text-gray-400 mt-1">{t.requester?.email}</p>
              </div>
              <Button onClick={() => handleResolve(t.id)}>Resolve</Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
