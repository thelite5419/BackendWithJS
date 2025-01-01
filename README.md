# Backend with JavaScript
## Backend Project Structure

This document provides a structured overview of the backend project, organized for clarity and scalability. The folder structure is designed to separate concerns and make the codebase easier to navigate and maintain.

## Folder Structure

### `src/`
This is the root directory for the backend source code.

#### 1. **`index`**
   - **Purpose:** Responsible for initializing the backend server and connecting to the database.
   - **Key Tasks:**
     - Connect to the database.
     - Start the server on the configured port.
   - Example: 
     ```javascript
     const mongoose = require('mongoose');
     const app = require('./app');
     
     mongoose.connect('your-database-URI-here')
       .then(() => console.log('Database connected successfully'))
       .catch(err => console.error('Database connection failed:', err));
     
     app.listen(3000, () => console.log('Server is running on port 3000'));
     ```

#### 2. **`app`**
   - **Purpose:** Contains configurations and middleware settings.
   - **Key Components:**
     - Middleware for parsing requests.
     - Cookie handling.
     - Setting up application configurations (e.g., CORS, security headers).
   - Example:
     ```javascript
     const express = require('express');
     const cookieParser = require('cookie-parser');
     const app = express();
     
     app.use(express.json());
     app.use(cookieParser());
     
     module.exports = app;
     ```

#### 3. **`constant`**
   - **Purpose:** Stores project constants such as enumerations and database names.
   - **Key Components:**
     - `enums`: Define constant values used across the project.
     - `DB-name`: Database-related constants.
   - Example:
     ```javascript
     const enums = {
       USER_ROLES: {
         ADMIN: 'admin',
         USER: 'user',
       },
     };
     
     const DB_NAME = 'my_database';
     
     module.exports = { enums, DB_NAME };
     ```



### `DB/`
Contains all database-related files.

#### 1. **`models`**
   - **Purpose:** Defines the database schema and models for interacting with the database.
   - Example: 
     ```javascript
     const mongoose = require('mongoose');
     
     const userSchema = new mongoose.Schema({
       name: String,
       email: String,
       password: String,
     });
     
     module.exports = mongoose.model('User', userSchema);
     ```

#### 2. **`controllers`**
   - **Purpose:** Contains the business logic for handling requests and sending responses.
   - Example: 
     ```javascript
     exports.getUsers = async (req, res) => {
       const users = await User.find();
       res.status(200).json({ users });
     };
     ```

#### 3. **`routes`**
   - **Purpose:** Defines API endpoints and maps them to their respective controllers.
   - Example:
     ```javascript
     const express = require('express');
     const { getUsers } = require('../controllers/userController');
     const router = express.Router();
     
     router.get('/users', getUsers);
     
     module.exports = router;
     ```

#### 4. **`middleware`**
   - **Purpose:** Contains reusable middleware functions such as authentication or validation.
   - Example:
     ```javascript
     const authMiddleware = (req, res, next) => {
       // Authentication logic here
       next();
     };
     
     module.exports = authMiddleware;
     ```

#### 5. **`utils`**
   - **Purpose:** Stores helper functions used across the application.
   - Example: 
     ```javascript
     exports.generateToken = (user) => {
       // Token generation logic
     };
     ```

#### 6. **`more` (Optional)**
   - **Purpose:** Placeholder for any additional directories that might be required as the project grows (e.g., services, validators).

---

## Basics of Backend with JavaScript

This README introduces the fundamentals of backend development using Node.js and Express, covering essential concepts, commands, and best practices.

---

### 1. Home Route
- The `/` route serves as the default route (home route).
- The server listens for requests and handles them based on the defined HTTP methods (e.g., `GET`, `POST`, `PUT`).

---

### 2. Server Setup
- A backend server listens for client requests.
- Example of a basic Express server:
  ```javascript
  const express = require('express');
  const app = express();
  const port = 3000;

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
  ```
- **How it works:**
  - The `app.get()` defines a route for handling `GET` requests.
  - `res.send()` sends a response back to the client.
  - `app.listen()` starts the server and listens for incoming requests on the specified port.

---

### 3. HTTP Methods
- **GET:** The client sends a `GET` request to retrieve data from the server.
  - Example: Fetching a list of users.
- **POST:** Used to send data to the server (e.g., creating a new record).
- **PUT:** Updates existing data on the server.

---

### 4. Package Management with npm
- **`npm init`:** Initializes a project and creates a `package.json` file.
  - Example:
    ```json
    {
      "scripts": {
        "start": "node index.js"
      }
    }
    ```
  - To start the server:
    ```bash
    npm run start
    ```
    This runs the `index.js` file.

- **Installing Dependencies:**
  - To install Express:
    ```bash
    npm install express
    ```

---

### 5. Express Framework
- A popular framework for building backend applications.
- Example setup with Express:
  ```javascript
  const express = require('express');
  const app = express();
  const port = 3000;

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
  ```

---

### 6. Nodemon for Development
- **Why Nodemon?**
  - During development, manually restarting the server after every code change can be tedious.
  - Nodemon automatically restarts the server when changes are detected.

- **Installation:**
  ```bash
  npm install -g nodemon
  ```

- **Usage:**
  - Update your `package.json`:
    ```json
    {
      "scripts": {
        "dev": "nodemon index.js"
      }
    }
    ```
  - Start the server in development mode:
    ```bash
    npm run dev
    ```

---

### 7. Environment Variables
- **Purpose:** Store sensitive or configuration-specific data (e.g., `PORT`).
- **How to Use:**
  1. Install the `dotenv` package:
     ```bash
     npm install dotenv
     ```
  2. Create a `.env` file and define variables:
     ```
     PORT=3000
     ```
  3. Import and configure `dotenv` in your code:
     ```javascript
     require('dotenv').config();
     const express = require('express');
     const app = express();

     app.listen(process.env.PORT, () => {
       console.log(`Example app listening on port ${process.env.PORT}`);
     });
     ```

---
