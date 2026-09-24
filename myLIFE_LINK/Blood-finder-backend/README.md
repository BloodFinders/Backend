# LifeLink Backend — REST API

This is the robust Express.js / Node.js backend supporting the LifeLink Blood Donation platform.

## Features
- **JWT-Based Authentication**: Secure login, register, and token refresh routes.
- **Role-Based Access Control**: Middleware to authenticate `donor`, `admin`, and `super-admin` scopes.
- **Rate-Limiting**: IP-based rate limiting via `express-rate-limit` to prevent DDoS.
- **Robust Mongoose Models**: Schemas for Users, Blood Requests, Blood Stock, Donations, Notifications, and Activity Logs.
- **SMTP Integration**: Pre-configured setup for sending transaction & verification emails via nodemailer.
- **Database Seeding**: Easily seed the MongoDB instance with dummy users, requests, stock, and logs.

---

## 🚀 Installation & Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```
2. **Setup Environment Variables:**
   - Copy [.env.example](file:///d:/myLIFE_LINK/Blood-finder-backend/.env.example) to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Open [.env](file:///d:/myLIFE_LINK/Blood-finder-backend/.env) and populate the values:
     - `PORT`: Server port (defaults to `5001`).
     - `MONGO_URI`: Your MongoDB database connection string.
     - `JWT_SECRET`: Secret key for signing authorization tokens.
     - `JWT_REFRESH_SECRET`: Secret key for signing refresh tokens.
     - `SMTP_*`: SMTP mail server credentials for sending verification emails.

   > [!WARNING]
   > Never commit `.env` to Git. This project is configured to ignore `.env` globally via [Blood-finder-backend/.gitignore](file:///d:/myLIFE_LINK/Blood-finder-backend/.gitignore).

3. **Seed Database:**
   Populate MongoDB with seed accounts and activity logs for development purposes:
   ```bash
   npm run seed
   ```

4. **Run Development Server (Nodemon):**
   ```bash
   npm run dev
   ```

5. **Run Production Server:**
   ```bash
   npm start
   ```

---

## 🗄️ Database Models
Schemas are defined in [src/models/](file:///d:/myLIFE_LINK/Blood-finder-backend/src/models/):
- **User**: General credentials, profile data, roles (`donor`, `admin`, `super-admin`), and eligibility flags.
- **BloodRequest**: Tracks requests made for blood units, recipient details, and approval status.
- **BloodStock**: Tracks units available for each of the 8 major blood groups.
- **DonationHistory**: Logs previous blood donations and verification status.
- **Notification**: Alerts dispatched to users regarding request updates or emergency alerts.
- **ActivityLog**: Logs platform activity for the Super Admin audit trails.

---

## 🔐 API Endpoints Map

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register a new user | Public |
| **POST** | `/api/auth/login` | Login and receive access/refresh tokens | Public |
| **POST** | `/api/auth/refresh`| Generate new access token using refresh token | Public |
| **GET** | `/api/donors/search` | Search for donors based on city and blood group | Authenticated |
| **POST** | `/api/requests` | Request blood units | Authenticated |
| **PUT** | `/api/admin/requests/:id` | Approve or Reject a blood request | Admins |
| **PUT** | `/api/admin/blood-stock` | Update stock levels of specific blood groups | Admins |
