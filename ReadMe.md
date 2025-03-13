# Project Setup Guide (Backend)

## 1️⃣ Clone the Repository
```sh
git clone <repository_url>
cd backend
```

---


## 2️⃣ Install Dependencies
Run the following command in the project directory to install required dependencies:
```sh
npm install
```

---

## 3️⃣ Database Setup
Ensure MySQL is running, then follow these steps:

1. **Login to MySQL:**
   ```sh
   mysql -u root -p
   ```
   Enter your MySQL root password when prompted.

2. **Create a New Database:**
   ```sql
   CREATE DATABASE your_database_name;
   ```

3. **Update Database Configuration:**
   Rename `.env.example` to `.env` and update the following values with your database details:
   ```ini
   DB_HOST="localhost"
   DB_NAME="name of your database"
   DB_PASS="Database Password"
   DB_DIALECT=mysql
   DB_USER="Database user"
   EMAIL_USER="Mail id for sending mail"
   EMAIL_PASS="auth password associated with mail"
   PORT="server on which node server will be running"
   ```

---

## 2️⃣ Run Migrations
Once the database is set up, run the following command to apply migrations:
```sh
npm run migrate
```
This will create all necessary tables in your database.

---

## 3️⃣ Running the Project
Once everything is set up, start the server using:
```sh
npm start
```
By default, the application will run on `http://localhost:3000/` (or the port specified in your `.env` file).


---




# Vite React Frontend Setup

## Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (Recommended: v18+)
- npm (comes with Node.js) or Yarn

## Installation
1. **Clone the repository:**
   ```sh
   git clone <repository-url>
   cd frontend
   cd invoice_frontend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```

## Running the Development Server
To start the development server, run:
```sh
npm run dev
# or
yarn dev
```
This will start the Vite development server. You can access the application at:
```
http://localhost:5173
```

## Environment Variables
Create a `.env` file in the root directory and add the following:
```env
VITE_API_URL=https://your-api-url.com
```

To use the environment variable in your React components, use:
```jsx
const apiUrl = import.meta.env.VITE_API_URL;
console.log("API URL:", apiUrl);
```

**Note:** Restart the server after modifying the `.env` file.

---


