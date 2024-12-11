# Appointment Scheduler API

This project implements a RESTful API for managing appointments between students and professors. It allows users to authenticate, manage time slots, and book or cancel appointments. The application supports end-to-end (E2E) testing and adheres to best practices for scalability and maintainability.

---

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JSON Web Tokens (JWT)
- **Testing**: Jest, Supertest
- **Environment Variables**: `dotenv`

---

## API Endpoints

### **Authentication**

- `POST /api/auth/login`: Authenticate a user and retrieve a JWT.

### **Availability**

- `POST /api/availability`: Professors specify their available time slots.
- `GET /api/availability/:professorId`: Students view available time slots for a professor.

### **Appointments**

- `POST /api/appointments/book/:timeSlotId`: Students book an appointment.
- `GET /api/appointments/my-appointments`: Students view their booked appointments.
- `DELETE /api/appointments/cancel/:appointmentId`: Professors cancel an appointment.

---

## Database Structure

1. **Users**
   - Fields: `name`, `email`, `password`, `role` (`student` or `professor`), etc.
2. **Availability**
   - Fields: `professorId`, `date`, `time`, `isBooked`, etc.
3. **Appointments**
   - Fields: `studentId`, `professorId`, `timeSlotId`, `date`, `time`, `status`, etc.

---

## Setup and Installation

1. Clone the repository:
2. Install dependencies by "npm install"
3. Creat .env file with following info
   PORT=8000
   MONGO_DB_URI=<your_mongo_db_connection_string>
   JWT_SECRET=<your_secret_key>
4. Start the server by "npm run server"
5. Run test by "npm test"

**NOTE** If mongo gives you connetion isshu then try downgrading its version in package.json file
