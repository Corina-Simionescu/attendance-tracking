import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EventsList from "./EventsList.jsx";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("events");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      navigate("/auth");
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand navbar-dark bg-primary">
        <div className="container-fluid">
          <span className="navbar-brand">Attendance Tracker</span>

          <div className="navbar-nav me-auto">
            <button
              className={`nav-link btn btn-link ${
                activeTab === "events" ? "active" : ""
              }`}
              onClick={() => setActiveTab("events")}
            >
              <i className="bi bi-calendar-event me-1"></i>
              Events
            </button>

            <button
              className={`nav-link btn btn-link ${
                activeTab === "groups" ? "active" : ""
              }`}
              onClick={() => setActiveTab("groups")}
            >
              <i className="bi bi-collection me-1"></i>
              Event Groups
            </button>
          </div>

          <div className="navbar-nav">
            <span className="nav-link">
              <i className="bi bi-person-circle me-1"></i>
              {user?.username}
            </span>
            <button className="nav-link btn btn-link" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-1"></i>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="container mt-4">
        {activeTab === "events" ? (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>My Events</h2>
              <button className="btn btn-primary">
                <i className="bi bi-plus-lg me-1"></i>
                New Event
              </button>
            </div>
            <EventsList />
          </div>
        ) : (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Event Groups</h2>
              <button className="btn btn-primary">
                <i className="bi bi-plus-lg me-1"></i>
                New Group
              </button>
            </div>
            {/* Event groups list will go here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
