import React, { useState } from "react";
import { toast } from "react-toastify";

const SubmitHelpRequest = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!subject || !message) {
      return toast.error("Please fill out all fields.");
    }

    setLoading(true);
    try {
      const res = await fetch("https://lmap.in/api/help", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ subject, message }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setSubject("");
        setMessage("");
      } else {
        toast.error(data.message || "Submission failed");
      }
    } catch (err) {
      toast.error("An error occurred.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Submit Help Request</h2>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="p-2 border rounded"
        />
        <textarea
          placeholder="Describe your issue"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="p-2 border rounded h-40"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 bg-black text-white rounded w-fit"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default SubmitHelpRequest;
