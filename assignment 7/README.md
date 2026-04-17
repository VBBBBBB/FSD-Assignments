# Academic Review System

A full-stack application that provides a platform for students to offer reviews and feedback on their courses and professors. Features an interactive UI and real-time dashboard.

## Technologies Used

- **Frontend:** React, Vite, Framer Motion, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB

## Project Structure
- `/client`: User interface and components.
- `/server`: REST API and database integration.

## Getting Started

### Ports
- Client runs on `http://localhost:5175`
- Server runs on `http://localhost:5005`

### Setup Intructions

1. **Install Dependencies**:
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```

2. **Run the Backend (Server)**:
   ```bash
   cd server
   npm run dev
   ```

3. **Run the Frontend (Client)**:
   ```bash
   cd client
   npm run dev -- --port 5175
   ```
