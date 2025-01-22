import { useState, useEffect } from "react";
import EventCard from "./EventCard";

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();
      setEvents(data.events);
      setError(null);
    } catch (err) {
      setError("Error loading events.");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleStatusToggle = (eventId) => {
    setEvents(
      events.map((event) => {
        if (event.id === eventId) {
          return {
            ...event,
            status: event.status === "OPEN" ? "CLOSED" : "OPEN",
          };
        }
        return event;
      })
    );
  };

  if (isLoading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center mt-5">
        <i className="bi bi-calendar-x display-1 text-muted mb-3"></i>
        <p className="lead">No events found. Create your first event!</p>
      </div>
    );
  }

  return (
    <div className="row">
      {events.map((event) => (
        <div key={event.id} className="col-12">
          <EventCard event={event} onStatusToggle={handleStatusToggle} />
        </div>
      ))}
    </div>
  );
};

export default EventsList;
