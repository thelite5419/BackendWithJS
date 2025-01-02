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

# Basics of Backend with JavaScript

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

# Data Modeling

In the `models` folder, we define the schema for our application's data using **Mongoose**. Each schema represents a unique data structure and adheres to MongoDB's standard practices. These schemas are later used to interact with the database.

---

## Naming Convention for Models
- Files are named to reflect the purpose of each model.
- Common naming conventions (industry standards):
  - `user.models.js`
  - `todo.models.js`
  - `sub_todo.models.js`

---

## Designing Data Models

### Basic User Model Example
```javascript
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String, 
  email: String, 
  isActive: Boolean
});

export const User = mongoose.model("User", userSchema);
```
**Note:**
- The model name `User` is converted to **`users`** (plural) in the database, following MongoDB's standardized practice.

---

### Advanced User Model Example
Instead of simple fields, we can define advanced configurations for more robust data validation and functionality:
```javascript
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export const User = mongoose.model("User", userSchema);
```
**Key Points:**
- `type`: Specifies the data type (e.g., `String`, `Boolean`).
- `required`: Ensures the field is mandatory.
- `unique`: Enforces uniqueness (e.g., for `username` or `email`).
- `lowercase`: Converts strings to lowercase for consistency.
- `default`: Sets a default value when the field is not provided.

---

## Referencing Other Models

### Foreign References in Data Models
To link documents across collections, we use **ObjectId** references.

#### Example: Todo Model
The `todo` schema references:
1. The user who created the task (`createdBy` field).
2. Sub-todos associated with the task (`subTodos` field).

```javascript
import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  complete: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // References the "User" model
  },
  subTodos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subTodo", // References the "subTodo" model
    },
  ],
});

export const Todo = mongoose.model("Todo", todoSchema);
```

**Key Points:**
- **`type: mongoose.Schema.Types.ObjectId`**: Represents a reference to another document.
- **`ref`**: Specifies the referenced model.
- Foreign references allow querying related data efficiently.

---

# Setting Up the Project

This section explains how to initialize and organize your project, configure essential tools, and streamline development processes.

---

## 1. Maintaining Empty Folders in Git
Git does not push empty folders by default. To ensure specific folders are included in the repository (even when empty), use a `.gitkeep` file:
1. Create an empty file named `.gitkeep` in the folder.
2. Add and commit it to the repository:
   ```bash
   git add .
   git commit -m "Added .gitkeep to preserve folder structure"
   ```

---

## 2. Code Formatting with Prettier
**Prettier** is a popular code formatting tool that ensures consistency across the codebase.

### Installing Prettier
1. Add Prettier as a dev dependency:
   ```bash
   npm install -D prettier
   ```

### Prettier Configuration
2. Create a `.prettierrc` file in the root directory and add the following configurations:
   ```json
   {
     "singleQuote": false,
     "bracketSpacing": true,
     "tabWidth": 2,
     "trailingComma": "es5",
     "semi": true
   }
   ```
   - **singleQuote**: Use double quotes for consistency (`false`).
   - **bracketSpacing**: Add spaces inside brackets (`true`).
   - **tabWidth**: Set indentation to 2 spaces.
   - **trailingComma**: Add trailing commas in ES5-compliant cases.
   - **semi**: End statements with semicolons (`true`).

### Ignoring Files with Prettier
3. Create a `.prettierignore` file to exclude files and folders from formatting:
   ```
   /.vscode
   /node_modules
   ./dist

   *.env
   .env
   .env.*
   ```

---

## 3. Dev Dependencies for Development
**Dev dependencies** are packages used during development but not required in production.

### Example: Using Nodemon
- **Nodemon** automatically restarts the server when changes are detected, improving development efficiency.

1. Install Nodemon as a dev dependency:
   ```bash
   npm install -D nodemon
   ```

2. Update `package.json` to include a development script:
   ```json
   {
     "scripts": {
       "dev": "nodemon src/index.js"
     }
   }
   ```

3. Run the server in development mode:
   ```bash
   npm run dev
   ```

---

# Connecting the Database in MERN

In this section, we will cover how to connect a MongoDB Atlas database to your MERN project using two approaches.

---

## Prerequisites
1. **MongoDB Atlas**: Use MongoDB Atlas for virtual database hosting.
2. **Environment Variables**: Store sensitive credentials in a `.env` file:
   ```env
   PORT=3000
   MONGODB_URL=mongodb+srv://<db_username>:<db_password>@cluster0.cpwtk.mongodb.net
   ```
   - Replace `<db_username>` and `<db_password>` with credentials created in the MongoDB Atlas dashboard.
3. **IP Access**: Allow `0.0.0.0/0` in MongoDB network access settings for universal access (not recommended for production).

---

## Approach 1: Using an Immediately Invoked Function Expression (IIFE)

This approach connects to the database directly in the main `index.js` file using an **IIFE**.

### Code Example:
```javascript
import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();

;(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`);
    console.log("Database connected successfully");

    app.on("error", (error) => {
      console.log("ERR :>> ", error);
      throw error;
    });

    app.listen(process.env.PORT, () => {
      console.log(`App is listening on port ::>> ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("DB error :>> ", error);
    process.exit(1);
  }
})();
```

### How It Works:
1. **IIFE**:
   - The `;` ensures that the function is not mistakenly concatenated with previous code.
   - The function `(async () => {})()` executes immediately after declaration.
2. **`mongoose.connect`**:
   - Connects to the database using `MONGODB_URL` and `DB_NAME` (environment variables).
3. **Error Handling**:
   - Captures errors for both database connection and the app's runtime errors.

---

## Approach 2: Modular Connection File

This approach separates the database connection logic into a dedicated `db/index.js` file for better modularity and reusability.

### Step 1: Create a `db/index.js` File
```javascript
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`);
    console.log(`\nDatabase connected successfully! Host: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("DB connection error:>", error);
    process.exit(1); // Exit the process on failure
  }
};

export default connectDB;
```

### Step 2: Use the Connection in `index.js`
```javascript
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./db/index.js"; // Import the connection function

const app = express();

// Connect to the database
connectDB();

app.listen(process.env.PORT, () => {
  console.log(`App is listening on port ::>> ${process.env.PORT}`);
});
```

### Step 3: Define Constants (Optional)
Use a `constants.js` file for modularity:
```javascript
export const DB_NAME = "videoTube";
```

Update `db/index.js`:
```javascript
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
    console.log(`\nDatabase connected successfully! Host: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("DB connection error:>", error);
    process.exit(1); // Exit the process on failure
  }
};

export default connectDB;
```

---

## Using `dotenv` with ES Modules
Update the `package.json` to enable ES Modules and dotenv compatibility:
```json
"scripts": {
  "dev": "nodemon -r dotenv/config --experimental-json-modules src/index.js"
}
```

---

## Key Notes
1. **Environment Variables**:
   - Store sensitive information like `MONGODB_URL` and `PORT` in a `.env` file.
   - Use `dotenv` to load these variables into your application.

2. **Modularity**:
   - Keep database connection logic in a separate file for better scalability and readability.

3. **Error Handling**:
   - Properly handle errors to ensure your application doesn't crash unexpectedly.

4. **Database Access**:
   - Use `0.0.0.0/0` for unrestricted IP access in MongoDB Atlas (only for testing).

---

# Custom API Response and Error Handling

This section explains how to set up **CORS**, middleware, and utility functions for handling API responses and errors in a Node.js project.

---

## 1. **What is CORS?**
**CORS (Cross-Origin Resource Sharing)** is a mechanism that allows your server to accept requests from domains other than its own.  
- **Example**: If your backend is running on `http://api.example.com` and your frontend is running on `http://example.com`, CORS ensures they can communicate.  
- **Why it’s important?** For security, browsers block requests to different origins by default. CORS specifies what is allowed.

### Setting Up CORS
```javascript
import cors from "cors";

app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // Allow requests from this origin
    credentials: true, // Enable sending cookies with requests
  })
);
```
Define `CORS_ORIGIN` in your `.env` file with the URL of your frontend (e.g., `http://localhost:3000`).

---

## 2. **Setting Up the Application**

### Install Dependencies
```bash
npm install cookie-parser cors
```

### Application Setup (`app.js`)
```javascript
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Enable CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// Middleware for parsing JSON and URL-encoded data
app.use(express.json({ limit: "16kb" })); // Limit JSON payload size
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // Limit URL-encoded payload size

// Serve static files from the "public" folder
app.use(express.static("public"));

// Parse cookies
app.use(cookieParser());

export default app;
```

---

## 3. **What is Middleware?**

Middleware functions are operations executed during the lifecycle of a request and response. They act as intermediaries between the client’s request and the server’s response.

### Example Workflow:
1. **Request**: A user sends a request to `/instagram`.
2. **Middleware**: Before the request reaches the route handler, middleware validates the user’s login status.
3. **Response**: If valid, the request is processed, and a response is sent to the user.

### Anatomy of Middleware
```javascript
function exampleMiddleware(req, res, next) {
  // Perform some operations, e.g., check user authentication
  console.log("Middleware triggered");

  // Call the next middleware/route handler
  next();
}
```

---

## 4. **Creating Utility Functions for API Responses**

The `utils.js` file contains reusable helper functions for consistent error and success responses.

### Code: `utils.js`
```javascript
function createError(error) {
  return { status: "error", error: error.message || error };
}

function createSuccess(data) {
  return { status: "success", data };
}

function createResult(error, data) {
  if (error) {
    return createError(error);
  } else {
    return createSuccess(data);
  }
}

module.exports = {
  createError,
  createSuccess,
  createResult,
};
```

### Explanation:
1. **`createError`**:
   - Generates a standard error response format.
   - Example:
     ```json
     {
       "status": "error",
       "error": "User not found"
     }
     ```
2. **`createSuccess`**:
   - Generates a standard success response format.
   - Example:
     ```json
     {
       "status": "success",
       "data": {
         "userId": "12345"
       }
     }
     ```
3. **`createResult`**:
   - Combines both `createError` and `createSuccess` to determine the appropriate response based on the presence of an error.

---

## 5. **Putting It All Together**

### Example: Using Middleware and Utility Functions
```javascript
import express from "express";
import { createError, createSuccess, createResult } from "./utils.js";

const app = express();

app.use(express.json());

// Example middleware
app.use((req, res, next) => {
  console.log("Request received:", req.method, req.url);
  next();
});

// Example route with utility function
app.get("/example", (req, res) => {
  try {
    const data = { message: "Hello, World!" };
    res.status(200).json(createSuccess(data));
  } catch (error) {
    res.status(500).json(createError(error));
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  res.status(500).json(createError(error));
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
```

---

