# 🚖 Uber Clone - MERN Stack Real-Time Ride-Hailing App

A full-featured, real-time ride-sharing application built with the MERN stack. This project features live location tracking, OTP-based ride authentication, and a dedicated dashboard for captains.



## 🚀 Features

### For Users
- **Live Location Tracking**: Real-time visualization of the captain's movement on a Leaflet map.
- **Dynamic Search**: Integrated location search panel for pickup and destination.
- **Ride Management**: Seamless flow from ride request to completion.
- **Secure Authentication**: JWT-based login and signup.

### For Captains
- **Live Dispatch**: Receive real-time ride requests via WebSockets (Socket.io).
- **Earnings Dashboard**: Track total earnings and completed rides dynamically.
- **OTP Verification**: Secure ride start using a 4-digit OTP from the passenger.
- **Interactive Map**: Built-in navigation view using Leaflet.

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, GSAP (Animations), Leaflet.js (Maps)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Real-Time**: Socket.io
- **State Management**: React Context API

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/uber-clone.git](https://github.com/YOUR_USERNAME/uber-clone.git)
   cd uber-clone
   ```
Install Dependencies

Bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
Environment Variables
Create a .env file in the backend folder:

Code snippet
PORT=4000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
Create a .env file in the frontend folder:

Code snippet
VITE_BASE_URL=http://localhost:4000
Run the Application

Bash
# Run Backend (from backend folder)
npm run dev

# Run Frontend (from frontend folder)
npm run dev

<img width="961" height="865" alt="image" src="https://github.com/user-attachments/assets/888bea4c-f98c-4d8c-aa3e-5f4f074bf3e9" />


📄 License
This project is licensed under the MIT License.



