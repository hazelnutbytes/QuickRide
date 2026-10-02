# QuickRide - Ride Sharing Backend

QuickRide is a backend system for a ride-sharing application where riders can request rides and drivers can accept and complete them.

The project provides REST APIs for authentication, ride management, driver management, fare estimation, document upload, and real-time driver location updates.

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Firebase Authentication
- JWT
- Socket.io
- Multer
- MongoDB GridFS

## Features

- Rider and driver registration
- User login with JWT authentication
- Firebase Authentication integration
- Driver profile management
- Driver location updates
- Ride creation
- Ride acceptance
- Ride completion
- Search rides by status
- Fare estimation based on distance
- Surge pricing support
- Driver document upload
- MongoDB GridFS file storage
- Real-time driver location using Socket.io
- REST API architecture using routes and controllers

## Project Structure

```text
QuickRide/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   ├── README.md
│   │
│   └── src/
│       ├── config/
│       │   ├── db.js
│       │   ├── firebase.js
│       │   └── gridfs.js
│       │
│       ├── models/
│       │   ├── User.js
│       │   ├── Driver.js
│       │   ├── Ride.js
│       │   └── Fare.js
│       │
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── rideController.js
│       │   ├── driverController.js
│       │   └── fareController.js
│       │
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── rideRoutes.js
│       │   ├── driverRoutes.js
│       │   └── fareRoutes.js
│       │
│       ├── middleware/
│       │   ├── authMiddleware.js
│       │   ├── validationMiddleware.js
│       │   └── uploadMiddleware.js
│       │
│       └── utils/
│           └── fareCalculator.js
│
└── frontend/
    └── React frontend
