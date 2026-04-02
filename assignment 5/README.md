# LuxeJourney Travel Agency

A full-stack travel agency web application built with a Node.js and Express backend, utilizing EJS for server-side templating and MongoDB as the database.

## ✈️ Features
- **Dynamic Views:** Renders server-side web pages using EJS templates.
- **Database Integration:** Connects with MongoDB via Mongoose for persistent data storage of travel packages, user information, and bookings.
- **Environment Configuration:** Securely manages keys and connection strings using `dotenv`.
- **MVC Architecture:** Organizes application logic into models, views, and controllers for maintainability.

## 🛠️ Tech Stack
- **Backend Environment:** Node.js
- **Framework:** Express.js
- **Template Engine:** EJS (Embedded JavaScript)
- **Database:** MongoDB & Mongoose ORM
- **Environment Manager:** dotenv

## 🚀 Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Ensure you have a `.env` file configured with your `MONGO_URI` and `PORT`.

3. **Start the Server:**
   ```bash
   npm start
   ```
   *For development with auto-restart, use `npm run dev` (requires nodemon).*

## 📂 Project Structure
- `server.js`: The main entry point that configures Express and connects to MongoDB.
- `models/`: Mongoose schemas defining the data structure.
- `views/`: EJS templates for the user interface.
- `public/`: Static assets (CSS, JS, images) served to the client.
