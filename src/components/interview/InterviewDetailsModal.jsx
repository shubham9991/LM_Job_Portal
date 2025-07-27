import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";

const InterviewDetailsModal = ({ open, onClose, interview }) => {
  if (!interview) return null;
  const date = format(new Date(interview.date), "do MMM yyyy");
  const time = `${interview.startTime} - ${interview.endTime}`;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm text-gray-500">
            {interview.jobTitle}
          </DialogTitle>
          <DialogTitle className="text-lg font-semibold">
            {interview.applicantName}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span>{interview.location}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InterviewDetailsModal;
