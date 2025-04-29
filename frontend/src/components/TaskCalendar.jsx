import React from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format as dateFormat, parseISO } from "date-fns";
import { enUS } from "date-fns/locale";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const TaskCalendar = ({ tasks, onTaskClick }) => {
  const events = tasks.map((task) => ({
    id: task.taskId,
    title: task.taskName,
    start: parseISO(task.taskDate),
    end: parseISO(task.taskDate),
    allDay: true,
    status: task.taskStatus,
    type: task.taskType,
  }));

  const eventStyleGetter = (event) => {
    let backgroundColor = "";
    switch (event.type) {
      case "cleaning":
        backgroundColor = "#3b82f6"; // blue
        break;
      case "shopping":
        backgroundColor = "#10b981"; // green
        break;
      case "laundry":
        backgroundColor = "#8b5cf6"; // purple
        break;
      case "outdoor":
        backgroundColor = "#f59e0b"; // yellow
        break;
      case "organization":
        backgroundColor = "#ec4899"; // pink
        break;
      case "maintenance":
        backgroundColor = "#6366f1"; // indigo
        break;
      case "cooking":
        backgroundColor = "#ef4444"; // red
        break;
      default:
        backgroundColor = "#6b7280"; // gray
    }

    if (event.status === "completed") {
      backgroundColor = "#d1d5db"; // light gray for completed
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "4px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
      },
    };
  };

  const handleSelectEvent = (event) => {
    const task = tasks.find((t) => t.taskId === event.id);
    if (task) {
      onTaskClick(task);
    }
  };

  return (
    <div className="h-[600px]">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={handleSelectEvent}
        views={["month", "week", "day", "agenda"]}
        defaultView="month"
        popup
        toolbar
      />
    </div>
  );
};

export default TaskCalendar;
