# MedVR — Medical Clinic Web Application

A full-stack web application for managing a medical clinic — featuring appointment booking, real-time notifications, medical records, online payment, and video/VR consultation capabilities.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Deployment](#deployment)
- [Screenshots](#screenshots)

---

## Overview

MedVR is a modern medical clinic management platform that bridges patients and doctors through a clean, responsive web interface. Patients can browse specialists, book appointments with online payment, manage their medical folder, and receive real-time notifications. Doctors can manage their schedule, view patient records (with permission), and handle appointments efficiently.

---

## Features

### Patient
- Register / Login with JWT authentication (access + refresh tokens)
- Browse available doctors and filter by name or specialization
- Book appointments with online payment via **Flouci**
- View and manage upcoming/past appointments
- Cancel appointments (with reason)
- Medical folder — view and edit personal health records
- Grant or revoke doctors' access to medical folder
- Real-time notifications (new appointment, cancellation, access requests)

### Doctor
- Dedicated doctor profile with specialization and appointment history
- View patient list and medical folders (with granted access)
- Receive real-time notifications for booking events
- Manage appointment schedule

### General
- Responsive UI — works on desktop and mobile
- Animated landing page with Framer Motion, Three.js, and Lottie
- Real-time communication via **Socket.IO**
- Role-based access control (patient / doctor)
- Secure token refresh flow with axios interceptors

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| React Router v6 | Client-side routing |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Three.js / React Three Fiber | 3D scenes |
| MUI DateTimePicker | Appointment date/time selection |
| Socket.IO Client | Real-time events |
| Zustand | Global state management |
| Axios | HTTP client with interceptor-based auth |
| Lottie | Animated illustrations |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database & ODM |
| Socket.IO | Real-time bidirectional events |
| JWT (jsonwebtoken) | Authentication (access + refresh) |
| bcrypt | Password hashing |
| Nodemailer | Email notifications |
| Flouci | Online payment gateway |
| express-validator | Request validation |
| node-cron | Scheduled tasks |

---

## Project Structure

```
MedVR/
├── backend/
│   ├── controllers/         # Route handlers
│   │   ├── user.js          # Auth, registration, doctor listing
│   │   ├── rendezVous.js    # Appointment CRUD
│   │   ├── dossierMedical.js# Medical folder & access control
│   │   ├── notification.js  # Notification management
│   │   ├── payment.js       # Flouci payment integration
│   │   └── availability.js  # Doctor availability
│   ├── models/              # Mongoose schemas
│   │   ├── user.js
│   │   ├── rendez_vous.js
│   │   ├── dossierMedical.js
│   │   ├── availability.js
│   │   └── ...
│   ├── routes/              # Express routers
│   ├── middlewares/         # Auth, validation middleware
│   ├── lib/                 # DB connection, utilities
│   ├── socketIO.js          # Socket.IO event handlers
│   ├── server.js            # App entry point
│   └── .env.example         # Environment variable template
│
└── web/my-app/
    ├── public/
    └── src/
        ├── api/             # Axios API call functions
        │   ├── axios.js     # Axios instance (base URL, interceptors)
        │   ├── user.js
        │   ├── rendezVous.js
        │   ├── medicalFolder.js
        │   └── notification.js
        ├── components/      # Reusable UI components
        │   ├── navbar.jsx
        │   ├── footer.jsx
        │   ├── notification.jsx
        │   ├── userAvatar.jsx
        │   ├── rdvBook.jsx  # Appointment booking widget
        │   ├── framer_components/
        │   ├── patientProfile/
        │   └── doctorProfile/
        ├── context/         # React context providers
        │   ├── authProvider.jsx
        │   └── socketProvider.jsx
        ├── hooks/           # Custom hooks
        │   ├── useRefreshToken.jsx
        │   └── axiosProvider.jsx
        ├── pages/           # Route-level page components
        │   ├── Landing.jsx
        │   ├── Services.jsx
        │   ├── Doctors.jsx
        │   ├── RequestAppointment.jsx
        │   ├── DoctorProfile.jsx
        │   ├── PatientProfile.jsx
        │   ├── Patients.jsx
        │   ├── payment.jsx
        │   ├── successPayment.jsx
        │   └── failPayment.jsx
        ├── store/           # Zustand global stores
        │   ├── store.js     # Notifications store
        │   └── userStore.js
        ├── App.js           # Route definitions
        └── .env.example     # Environment variable template
```

---

## Getting Started

### Prerequisites

- **Node.js** v18+
- **npm** v9+
- **MongoDB** (Atlas cluster or local instance)
- **Git**

---

### Backend Setup

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env
# Then edit .env with your real values (see Environment Variables section)

# 4. Start the server
npm run dev        # development (nodemon)
# or
npm start          # production
```

The server runs on `http://localhost:9001` by default.

---

### Frontend Setup

```bash
# 1. Navigate to the frontend directory
cd web/my-app

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env
# Set REACT_APP_API_URL to your backend URL

# 4. Start the React app
npm start
```

The app runs on `http://localhost:3000` by default.

---

## Environment Variables

### Backend — `backend/.env`

| Variable | Description | Example |
|---|---|---|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret for JWT signing | `your_strong_secret` |
| `ACCESS_TOKEN_SECRET` | Access token secret | `your_access_secret` |
| `REFRESH_TOKEN_SECRET` | Refresh token secret | `your_refresh_secret` |
| `ACCESS_TOKEN_EXPIRES_IN` | Access token TTL | `15m` |
| `REFRESH_TOKEN_EXPIRES_IN` | Refresh token TTL | `7d` |
| `FLOUCI_TOKEN` | Flouci payment API token | `your_flouci_token` |
| `USER` | Gmail address for email | `clinic@gmail.com` |
| `APP_PASSWORD` | Gmail app password | `xxxx xxxx xxxx xxxx` |
| `NODE_ENV` | Environment | `development` or `production` |
| `BLOCKCHAIN_ENABLED` | Toggle blockchain features | `false` |

### Frontend — `web/my-app/.env`

| Variable | Description | Example |
|---|---|---|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:9001` |

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/user/register` | Register a new user |
| `POST` | `/user/login` | Login, returns access + refresh tokens |
| `POST` | `/user/refresh` | Refresh access token |
| `POST` | `/user/logout` | Invalidate refresh token |
| `GET` | `/user/doctors` | List all doctors |
| `GET` | `/user/users/:id` | Get user by ID |
| `GET` | `/rdv/getAllRdvByUserId/:id` | Get appointments for a user |
| `POST` | `/rdv/bookRdv` | Book an appointment |
| `PUT` | `/rdv/cancelRdv/:id` | Cancel an appointment |
| `GET` | `/dossierMedical/:id` | Get medical folder |
| `PUT` | `/dossierMedical/:id` | Update medical folder |
| `POST` | `/dossierMedical/giveAccess` | Grant doctor access to folder |
| `DELETE` | `/dossierMedical/revokeAccess` | Revoke doctor access |
| `GET` | `/notification/getAll/:userId` | Get all notifications |
| `PUT` | `/notification/setNotification/:userId` | Mark all notifications as seen |
| `PUT` | `/payment` | Initiate Flouci payment |
| `POST` | `/payment/add` | Create payment session |

---

## Deployment

### Backend — Render (recommended)

1. Push this repo to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set **Root Directory** to `backend`
4. Set **Build Command** to `npm install`
5. Set **Start Command** to `node server.js`
6. Add all environment variables from `backend/.env.example` in the Render dashboard
7. Deploy

### Frontend — Vercel (recommended)

1. Create a new project on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `web/my-app`
3. Framework: **Create React App**
4. Add environment variable:
   - `REACT_APP_API_URL` → your Render backend URL (e.g. `https://medvr-api.onrender.com`)
5. Deploy

> **Important:** After deploying the backend, update `REACT_APP_API_URL` in Vercel and redeploy the frontend.

---

## Screenshots

> *(Add screenshots of the app here)*

| Landing Page | Doctors | Appointment Booking |
|---|---|---|
| ![Landing]() | ![Doctors]() | ![Booking]() |

| Patient Profile | Services | Notifications |
|---|---|---|
| ![Profile]() | ![Services]() | ![Notifications]() |
