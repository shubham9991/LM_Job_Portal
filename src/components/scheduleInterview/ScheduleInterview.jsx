import React, { useState } from "react";
import ScheduleModal from "./ScheduleModal";

const ScheduleInterview = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleScheduleSubmit = async (data) => {
    try {
      const response = await fetch("/api/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Interview scheduled successfully!");
      } else {
        alert("Failed to schedule interview.");
      }
    } catch (error) {
      console.error("Error scheduling interview:", error);
    }
  };

  return (
    <div className="p-6">
      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
        onClick={handleOpenModal}
      >
        Schedule Interview
      </button>

      <ScheduleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleScheduleSubmit}
      />
    </div>
  );
};

export default ScheduleInterview;
