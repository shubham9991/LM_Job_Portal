// src/components/calendar/MyFullCalendar.jsx
import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventDetailsModal from "./EventDetailsModal";
import { format } from "date-fns";
import { toast } from "react-toastify";

export default function MyFullCalendar() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("https://lmap.in/api/student/calendar", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const json = await res.json();
        if (json.success) {
const formatted = json.data.interviews.map((item) => ({
  title: item.title,
  start: `${item.date}T${item.startTime}`,
  end: `${item.date}T${item.endTime}`,
  location: item.location,
  schoolName: item.schoolName, // ✅ Add this line
  joinLink: item.joinLink,
  meetingId: item.meetingId,
  password: item.password,
}));

          setEvents(formatted);
        } else {
          toast.error(json.message || "Failed to load calendar data.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong while fetching events.");
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (info) => {
    const event = info.event;
const formattedEvent = {
  title: event.title,
  schoolName: event.extendedProps.schoolName,
  location: event.extendedProps.location,
  joinLink: event.extendedProps.joinLink,
  meetingId: event.extendedProps.meetingId,
  password: event.extendedProps.password,
  date: format(event.start, 'do MMMM yyyy'),
  time: `${format(event.start, 'hh:mm a')} - ${format(event.end, 'hh:mm a')}`,
};

    setSelectedEvent(formattedEvent);
  };

  return (
    <div className="flex p-4 gap-4 h-screen overflow-hidden">
      <div className="flex-grow">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          eventClick={handleEventClick}
          height="auto"
          weekNumbers={true}
        />
      </div>

      <EventDetailsModal
        open={!!selectedEvent}
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}
