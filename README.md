# 🎫 TicketHub — MERN Stack Ticketing System

A full-stack support ticketing system built with **MongoDB, Express, React, and Node.js** (MERN Stack).

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Render-blue)](https://ticketing-system-client.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black)](https://github.com/Christy17-tech/ticketing-system)
[![API](https://img.shields.io/badge/API-Render-green)](https://ticketing-system-api-t924.onrender.com/api/health)

---

## 📋 Problem Statement

Users need a way to submit support requests and track their resolution status. Administrators need to manage, assign, and update the status of tickets efficiently.

## 👥 Target Users

| Role  | Capabilities |
|-------|-------------|
| **User** | Register, login, create tickets, view own tickets, add comments |
| **Admin** | View all tickets, update ticket status, delete tickets, view stats |

---

## ✨ Features (MVP)

- ✅ User registration & login with JWT authentication
- ✅ Create, view, and delete support tickets
- ✅ Filter tickets by status, priority, and category
- ✅ Add comments to tickets
- ✅ Admin dashboard with ticket statistics
- ✅ Admin can update ticket status
- ✅ Pagination on ticket lists
- ✅ Responsive design (mobile-first)
- ✅ Loading, empty, and error states on every screen
- ✅ Rate limiting on API endpoints

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite, React Router v6, Axios, React Hot Toast |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (via Mongoose) |
| **Auth** | JWT (JSON Web Tokens), bcryptjs |
| **Deployment** | Render (API + Static Site) |
| **Version Control** | Git + GitHub |

---

## 📁 Project Structure

```
ticketing-system/
├── client/                    # React frontend (Vite)
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # Auth context
│   │   ├── pages/             # Route-level screens
│   │   └── services/          # API client (axios)
│   ├── .env.example
│   └── vite.config.js
├── server/                    # Node/Express backend
│   ├── src/
│   │   ├── config/            # DB connection
│   │   ├── controllers/       # Request handling logic
│   │   ├── middleware/        # Auth, error handling
│   │   ├── models/            # Mongoose schemas
│   │   └── routes/            # URL mapping
│   ├── .env.example
│   └── src/server.js
├── render.yaml                # Render deployment config
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js v18+
- npm
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account (free tier)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/ticketing-system.git
cd ticketing-system
```

### 2. Set up the Backend
```bash
cd server
cp .env.example .env
# Fill in your values in .env
npm install
npm run dev
```

### 3. Set up the Frontend
```bash
cd ../client
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
```

### 4. Open the app
- Frontend: http://localhost:5173
- API: http://localhost:5000/api/health

---

## 🔧 Environment Variables

### Backend (`server/.env`)
| Variable | Description |
|----------|------------|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `CLIENT_URL` | Frontend URL for CORS |
| `NODE_ENV` | `development` or `production` |

### Frontend (`client/.env`)
| Variable | Description |
|----------|------------|
| `VITE_API_URL` | Backend API base URL |

> ⚠️ Never commit `.env` files. Only `.env.example` files are committed.

---

## 📡 API Endpoints

### Auth
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Tickets
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/api/tickets` | Get tickets (own or all for admin) | Yes |
| GET | `/api/tickets/stats` | Get ticket statistics | Admin |
| GET | `/api/tickets/:id` | Get ticket by ID | Yes |
| POST | `/api/tickets` | Create ticket | Yes |
| PUT | `/api/tickets/:id` | Update ticket | Yes |
| DELETE | `/api/tickets/:id` | Delete ticket | Yes |
| POST | `/api/tickets/:id/comments` | Add comment | Yes |

---

## 🌐 Deployment on Render

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: MERN ticketing system"
git remote add origin https://github.com/your-username/ticketing-system.git
git push -u origin main
```

### Step 2: Set up MongoDB Atlas
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a database user
3. Whitelist all IPs (`0.0.0.0/0`) for Render
4. Copy the connection string

### Step 3: Deploy Backend on Render
1. Go to [render.com](https://render.com) → New → Web Service
2. Connect your GitHub repo
3. Set root directory: `server`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables (MONGODB_URI, JWT_SECRET, CLIENT_URL, NODE_ENV=production)

### Step 4: Deploy Frontend on Render
1. Go to Render → New → Static Site
2. Connect your GitHub repo
3. Set root directory: `client`
4. Build command: `npm install && npm run build`
5. Publish directory: `dist`
6. Add rewrite rule: `/* → /index.html` (for SPA routing)
7. Add env variable: `VITE_API_URL=https://your-api.onrender.com/api`

### Step 5: Update CORS
In your backend environment variables on Render, set:
```
CLIENT_URL=https://your-frontend.onrender.com
```

---

## 📸 Screenshots

> *(Add screenshots of key screens here)*

---

## ⚠️ Known Limitations

- Free Render instances sleep after 15 minutes of inactivity (cold start ~30s)
- No email notifications
- No file attachments on tickets
- No real-time updates (polling not implemented)

## 🔮 Future Improvements

- Email notifications on ticket updates
- File/screenshot attachments
- Real-time updates via WebSockets
- Ticket assignment to specific agents
- SLA tracking and due dates
- Analytics dashboard with charts

---

## 📄 License
MIT
