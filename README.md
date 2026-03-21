# 🟣 Enterprise Leave Management System

A modern, full-stack web application designed to streamline employee leave requests and HR management. Built with a robust Go backend and a highly interactive, animated React frontend.

## ✨ Key Features

**🔒 Role-Based Access Control (RBAC)**
* Secure JWT authentication.
* Distinct portals and privileges for **Administrators** and standard **Employees**.
* Animated dual-panel sliding login screen.

**💼 Administrator Portal**
* **Request Management:** Review, approve, or reject employee leave requests in real-time.
* **Employee Management:** Full CRUD operations to register, edit, and remove system users.
* Separated data tables for HR/Admins and standard employees.

**👤 Employee Portal**
* **Smart Apply Form:** Built-in timezone validation, dynamic end-date adjusting, and real-time leave duration calculation.
* **Interactive Calendar:** Visual grid displaying approved and pending leaves with color-coded pills (Annual, Sick, Casual).
* **Statistics:** Auto-calculating summary cards showing total days taken per leave category.

**🎨 Premium UI/UX**
* Modern, enterprise-grade interface inspired by top-tier HCM platforms.
* Smooth page transitions, pop animations, and tab-swipe effects.
* Responsive CSS Grid and Flexbox layouts.

---

## 🛠️ Tech Stack

**Frontend:**
* React 18 (TypeScript)
* Vite (Build Tool)
* React Router DOM (Navigation)
* Axios (HTTP Client)
* Custom CSS3 (No external UI libraries used)

**Backend:**
* Go (Golang)
* Gin Web Framework (RESTful API routing)
* GORM (Object Relational Mapper)
* PostgreSQL (Neon Serverless DB)
* JWT (JSON Web Tokens for security)

---

## 🚀 Getting Started

Follow these instructions to run the project locally on your machine.

### Prerequisites
* [Node.js](https://nodejs.org/) (v16 or higher)
* [Go](https://golang.org/dl/) (v1.19 or higher)
* A PostgreSQL database (e.g., [Neon](https://neon.tech/))

### 1. Backend Setup (Go)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install Go dependencies:
   ```bash
   go mod tidy
   ```
3. Create a .env file in the backend root and add your database URL:
  ```bash
  DATABASE_URL="postgres://username:password@your-neon-hostname.neon.tech/dbname"
  ```
4. Start the Go server:
  ```bash
  go run main.go
  ```
#### The server will start on http://localhost:8080 and auto-migrate the database tables.

### 2. Frontend Setup (React)
1. Open a new terminal and navigate to the frontend directory:
  ```bash
  cd frontend
  ```
2. Install NPM packages:
  ```bash
  npm install
  ```
3. Start the Vite development server:
  ```bash
  npm run dev
  ```
4. Open your browser and navigate to http://localhost:5173.
