import { scheduleInterView, shortListApplicant } from "@/api/school";
import { formatDate } from "@/utils/helper/formatDate";
import React, { useState } from "react";
import { toast } from "react-toastify";

const ScheduleModal = ({ isOpen, onClose, applicationId, onScheduled, shortlisted }) => {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!applicationId) {
      toast.error("Application ID is missing!");
      return;
    }
    const payload = {
      title: "Scheduled Interview",
      date: formatDate(date),
      startTime,
      endTime,
    };

    try {
      setLoading(true);
      if (!shortlisted) {
        await shortListApplicant(applicationId, { status: "shortlisted" });
      }
      const response = await scheduleInterView(applicationId, payload);
      if (response?.success) {
        toast.success("Interview scheduled successfully!");
        onClose();
        if (onScheduled) onScheduled();
      } else {
        toast.error(response?.message || "Failed to schedule interview.");
      }
    } catch (error) {
      console.error("Error scheduling interview:", error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md z-50 space-y-4">
        <h2 className="text-xl font-semibold">Schedule Interview</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="date"
            required
            className="border border-gray-300 p-2 rounded-md"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <input
            type="time"
            required
            className="border border-gray-300 p-2 rounded-md"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <input
            type="time"
            required
            className="border border-gray-300 p-2 rounded-md"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded"
              disabled={loading}
            >
              {loading ? "Scheduling..." : "Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModal;
