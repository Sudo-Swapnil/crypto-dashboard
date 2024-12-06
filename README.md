# CryptoBoard Deployment Configuration

This repository contains the configuration for deploying the CryptoBoard application, a MERN stack project, using Docker and Docker Compose. The stack includes:

- **Backend**: A Node.js server.
- **Frontend**: A React.js application served via Nginx.
- **MongoDB**: A MongoDB instance for database storage.

---

## Prerequisites

- **Docker**: Ensure you have Docker installed.
- **Docker Compose**: Verify that Docker Compose is installed.

---

## Usage

### 1. Build and Start the Application

Run the following command to build and start all services:

```bash
docker-compose up --build


This will:

Build the backend and frontend Docker images.
Start the backend, frontend, and MongoDB services.
Expose the services on their respective ports.

2. Access the Application

Frontend: http://localhost:3000
Backend: http://localhost:8080
MongoDB: Available on port 27017.

3. Stop the Application

To stop all running services:

docker-compose down




 - Services Overview 

1. Backend

Image: Built from the backend/Dockerfile.
Port: 8080
Environment Variables:
PORT: The port on which the server runs.
MONGO_URI: The MongoDB connection URI.
Volume: Mounts the backend directory to /app for live updates.

2. Frontend

Image: Built from the frontend/cryptoboard/Dockerfile.
Port: 3000 (mapped to Nginx's 80).
Volume: Mounts the frontend directory to /app for live updates.

3. MongoDB

Image: mongo:5.0
Port: 27017
Volume: Persists data in mongo_data volume.
