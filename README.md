# MedVR — Telemedicine Platform

![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?logo=socket.io&logoColor=white)
![Solidity](https://img.shields.io/badge/Solidity-363636?logo=solidity&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?logo=three.js&logoColor=white)

A **telemedicine platform** combining real-time video consultations, blockchain-secured medical records, and an immersive 3D/VR interface — connecting patients and doctors remotely while keeping sensitive medical data tamper-proof on-chain.

> **Stack:** React · Node.js / Express · Socket.io · Web3 + Solidity (Truffle/Ganache) · MongoDB · React Three Fiber · MUI

## Features

- **Real-time consultations** — video-call signaling and messaging over Socket.io
- **Blockchain medical records** — Solidity smart contracts (`medical_folder.sol`, `mednft_creation.sol`) secure patient records and mint medical NFTs on an Ethereum test network
- **Immersive UI** — 3D / VR scenes with React Three Fiber and Drei
- **Auth** — JWT authentication with bcrypt; role-based patient/doctor access
- **Appointments & notifications** — scheduling with `node-cron` jobs and email via Nodemailer
- **Modern frontend** — React with MUI, Flowbite, and Framer Motion

## Architecture

| Part | Stack |
|---|---|
| `backend/` | Express, MongoDB/Mongoose, Socket.io, JWT, Web3 |
| `backend/contracts/` | Solidity smart contracts, compiled & deployed with Truffle + Ganache |
| `web/` | React (MUI, React Three Fiber, Flowbite), Axios |

## Getting Started

```bash
git clone https://github.com/salahbnh/MedVR.git
cd MedVR

# Backend
cd backend && npm install && cp .env.example .env && npm start

# Smart contracts (in backend/)
npx truffle migrate           # against a Ganache test network

# Frontend
cd ../web/my-app && npm install && npm start
```

## Demo

<!-- Add a recording of a live video consultation + the 3D interface here — this project demos very well. -->

---

Built by [Salah Bounouh](https://github.com/salahbnh) · [Portfolio](https://salahbounouh.com) · [LinkedIn](https://www.linkedin.com/in/salah-bounouh-1426ba27b/)
