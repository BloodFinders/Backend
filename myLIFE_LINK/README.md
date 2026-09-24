# LifeLink — Blood Donation & Emergency Support Platform

Welcome to **LifeLink**, a comprehensive digital solution designed to streamline and revolutionize blood donation, blood request matching, real-time inventory management, emergency support, and rewarding donor engagement.

This project consists of two core repositories/modules:
1. [BLood-finder-app](file:///d:/myLIFE_LINK/BLood-finder-app) — A premium React Native frontend built with Expo, designed for donors, beneficiaries, admins, and super admins.
2. [Blood-finder-backend](file:///d:/myLIFE_LINK/Blood-finder-backend) — A robust Node.js/Express.js REST API backed by MongoDB, implementing secure JWT authentication, rate-limiting, and data seeding.

---

## 🛠️ Workspace Structure

```
myLIFE_LINK/
├── BLood-finder-app/          # React Native (Expo) Frontend Application
│   ├── src/                   # Source code (screens, navigation, themes, context, data)
│   └── package.json           # Frontend dependencies and run scripts
├── Blood-finder-backend/      # Express / Node.js Backend Application
│   ├── src/                   # Source code (controllers, routes, models, middleware)
│   └── package.json           # Backend dependencies and run scripts
├── .gitignore                 # Root gitignore to ignore sensitive credentials globally
└── README.md                  # This file
```

---

## 🚀 Quick Start Guide

### Step 1: Clone & Navigate
Ensure you have cloned this directory, open a terminal, and make sure your working directory is the project root.

### Step 2: Set Up Backend (`Blood-finder-backend`)
Go to the backend folder to install dependencies and configure local environment variables.

1. **Install Dependencies:**
   ```bash
   cd Blood-finder-backend
   npm install
   ```
2. **Setup Local Environment Variables:**
   - Copy the environment variables template:
     ```bash
     cp .env.example .env
     ```
   - Open [.env](file:///d:/myLIFE_LINK/Blood-finder-backend/.env) and configure your MongoDB connection string and SMTP/JWT credentials as needed.
   
   > [!IMPORTANT]
   > The `.env` file is untracked and excluded from git. Do not commit or share this file to protect secrets.

3. **Seed Database with Sample Data:**
   To clear the database and seed it with pre-configured mock data (including Admin, Super Admin, and Donor credentials):
   ```bash
   npm run seed
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The backend server runs locally on [http://localhost:5001](http://localhost:5001) by default.

---

### Step 3: Set Up Frontend App (`BLood-finder-app`)
Open a new terminal to start the React Native application.

1. **Install Dependencies:**
   ```bash
   cd BLood-finder-app
   npm install
   ```

2. **Start the Expo Development Server:**
   ```bash
   npx expo start
   ```

3. **Run on Device / Emulator:**
   - Scan the QR code displayed in the terminal using the **Expo Go** application (available on App Store and Google Play).
   - Press `a` to run on an Android emulator or `i` for iOS simulator.

---

## 🔑 Demo Access Credentials

The database seeding process creates default accounts for testing the system flow. You can use these credentials to log in:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Donor (User)** | `rahul@gmail.com` | `password123` | Regular donor profile with availability toggled |
| **Admin** | `admin@lifelink.com` | `password123` | Manage requests, update stock, and verify donations |
| **Super Admin** | `super@lifelink.com` | `password123` | High-level analytics, platform settings, and logs |

---

## 🔒 Git Security Configuration
To prevent sensitive files (like database strings, API secrets, and JWT private keys) from being pushed to Git:

1. **Ignored Environment Variables:**
   - Both the workspace root [.gitignore](file:///d:/myLIFE_LINK/.gitignore) and [Blood-finder-backend/.gitignore](file:///d:/myLIFE_LINK/Blood-finder-backend/.gitignore) exclude `.env` files.
   - You can copy configurations using the provided [.env.example](file:///d:/myLIFE_LINK/Blood-finder-backend/.env.example) template.

2. **Cached File Removal:**
   - The `.env` file has been untracked from Git's cache. Changes will no longer be tracked or pushed to remote repositories.
