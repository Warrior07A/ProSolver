# ProSolver

ProSolver is a full-stack web application designed for competitive programmers and educators to manage, organize, and read technical coding problems. It provides a clean dashboard to track programming problems, complete with built-in Markdown and LaTeX rendering for mathematical formulas and code blocks.

## 🚀 Features

- **Problem Dashboard:** Keep track of your coding problems in one central place.
- **Rich Text Rendering:** Render competitive programming problem descriptions beautifully using Markdown, GFM, and KaTeX (LaTeX math).
- **CRUD Operations:** Create, Read, Update, and Delete problems seamlessly.
- **Tagging System:** Categorize problems using preset tags (Array, Dynamic Programming, Graph, etc.) or custom tags.
- **Polygon Link Integration:** Store and quickly copy links to Codeforces Polygon problem URLs.
- **Dark Mode Support:** A fully integrated dark mode for comfortable reading and coding, matching system preferences or user toggles.
- **Authentication:** Secure user signup and login flows using JWT.

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 (served via Bun)
- **Styling:** Tailwind CSS v4 + Radix UI Primitives + Lucide Icons
- **Markdown Processing:** `react-markdown`, `remark-gfm`, `rehype-raw`, and `mathjax`/`katex`
- **Routing:** React Router v7
- **Network Requests:** Axios

### Backend
- **Runtime & Language:** Node.js / Bun with TypeScript
- **Framework:** Express.js
- **Database:** MongoDB (using Mongoose)
- **Authentication:** JSON Web Tokens (JWT)

## 📂 Project Structure

```
ProSolver/
├── Backend/                 # Express API Server
│   ├── db.ts                # Mongoose schemas (User, Problems)
│   ├── index.ts             # Express server and API routes
│   └── types/               # Zod validation schemas
├── Frontend/                # React Application
│   ├── src/
│   │   ├── components/ui/   # Reusable UI components (Dialogs, Cards, Markdown Renderer)
│   │   ├── context/         # React Contexts (e.g., ThemeContext)
│   │   ├── Pages/           # Main views (Dashboard, Signin, Signup)
│   │   └── index.ts         # Bun dev server entry point for React
│   └── styles/              # Global CSS & Tailwind config
└── README.md
```

## ⚙️ Getting Started

### Prerequisites
- [Bun](https://bun.sh/) installed on your machine.
- A running instance of MongoDB (local or MongoDB Atlas).

### Backend Setup

1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   bun install
   ```
3. Set up the environment variables. Create a `.env` file in the `Backend` directory:
   ```env
   MONGO_URL=your_mongodb_connection_string
   ```
4. Start the backend development server:
   ```bash
   bun run index.ts
   ```
   *The server will start on port 3001.*

### Frontend Setup

1. Navigate to the `Frontend` directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   bun install
   ```
3. Start the frontend development server:
   ```bash
   bun run dev
   ```
   *The application will compile and be available at http://localhost:3000.*

## 🔗 API Endpoints

- `POST /signup` - Register a new user
- `POST /login` - Authenticate a user and receive a JWT
- `GET /dashboard` - Retrieve all problems for the authenticated user
- `POST /create` - Add a new problem
- `PUT /edit` - Update an existing problem
- `DELETE /delete` - Delete a problem by title
