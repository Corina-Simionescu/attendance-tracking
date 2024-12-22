# Attendance Monitoring Web Application

## API Documentation
API endpoints are documented using Swagger/OpenAPI. The documentation is available at /api-docs when running the server.

Currently documented endpoints:
- Authentication (register, login, profile)

---

## Project Overview

### Objective
To implement a web application that allows event organizers to monitor attendance for various activities or events.

### Description
The application will provide event organizers with tools to:
- Create events or groups of events.
- Manage participant attendance.
- Export attendance records to CSV or XLSX formats.

Participants confirm attendance by:
- Entering a code displayed by the organizer.
- Scanning a QR code.

---

## Technologies Used

### Frontend
- **HTML5**, **CSS3**, **JavaScript**
- **React.js**

### Backend
- **Node.js**
- **Express.js**

### Database
- **SQLite**
- **Sequelize**

### Additional Libraries/Tools
- **Development Tools:**
  - Figma (UI/UX design and app schema)

---

## Project Plan

### 1. Design Phase
- Use **Figma** to create the wireframes
- Define the navigation flow and reusable components.

### 2. Database Design
- Define schema using Sequelize:
  - **User** model
  - **Event** model
  - **Attendance** model
- Establish relationships (e.g., one-to-many between `Event` and `Attendance`).

### 3. Backend Development
- Set up a Node.js + Express.js project.
- Create REST API endpoints.
- Use Sequelize for database operations.

### 4. Frontend Development
- Build a React app with components.
- Use **React Router** for navigation.

### 5. QR Code Integration
- Generate QR codes on the backend during event creation.
- Add functionality to scan QR codes with a webcam.

### 6. Export Features
- Export attendance data as **CSV** or **XLSX** files.

### 7. Integration Phase
- Connect frontend with backend
