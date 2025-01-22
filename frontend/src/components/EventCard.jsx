import { useState } from "react";

const EventCard = ({ event, onStatusToggle }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusToggle = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/events/${event.id}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        onStatusToggle(event.id);
      }
    } catch (error) {
      console.error("Error toggling status:", error);
    }
    setIsLoading(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC",
    });
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title">{event.title}</h5>
          <span
            className={`badge ${
              event.status === "OPEN" ? "bg-success" : "bg-secondary"
            }`}
          >
            {event.status}
          </span>
        </div>

        <div className="card-text">
          <p className="text-muted mb-2">
            <i className="bi bi-clock me-2"></i>
            {formatDate(event.startTime)} ({event.duration} minutes)
          </p>
          {event.description && <p className="mb-2">{event.description}</p>}
          <p className="mb-2">
            <i className="bi bi-upc me-2"></i>
            Access Code: {event.accessCode}
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={handleStatusToggle}
            disabled={isLoading}
          >
            <i className="bi bi-arrow-repeat me-1"></i>
            Toggle Status
          </button>
          <button className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-people me-1"></i>
            View Attendance
          </button>
          <button className="btn btn-outline-success btn-sm">
            <i className="bi bi-download me-1"></i>
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
