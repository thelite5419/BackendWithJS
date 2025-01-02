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
