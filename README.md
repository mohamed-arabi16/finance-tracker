# Vite React Shadcn/ui TypeScript Finance Tracker

This project is a modern personal finance management application built with Vite, React, TypeScript, Shadcn/ui, and Supabase. It provides a user-friendly interface to track income, expenses, debts, and assets.

## Overview

The application aims to help users organize their financial data, gain insights into their spending habits, and manage their overall financial health effectively. It features a clean, responsive UI built with Shadcn/ui components and Tailwind CSS.

## Key Features

*   **User Authentication:** Secure sign-up and login functionality using Supabase Auth.
*   **Income Tracking:** Record and manage sources of income.
*   **Expense Tracking:** Log and categorize expenses.
*   **Debt Management:** Keep track of loans and other debts.
*   **Asset Management:** Monitor personal assets and their values.
*   **Financial Dashboard:** (Implied) Visual summaries of financial status.
*   **Responsive Design:** Accessible on various devices.

## Tech Stack

*   **Frontend Framework:** React 18 + TypeScript
*   **Build Tool:** Vite
*   **UI Components:** Shadcn/ui
*   **Styling:** Tailwind CSS
*   **Routing:** React Router v6
*   **State Management:** @tanstack/react-query (for server state), React Context/Hooks (for UI state)
*   **Forms:** React Hook Form with Zod for validation
*   **Backend/Database:** Supabase (Authentication, Database)
*   **Linting:** ESLint

## Getting Started

### Prerequisites

*   Node.js (v18.x or later recommended)
*   npm (v8.x or later)
*   A Supabase account and project for backend services.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd vite_react_shadcn_ts
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the project root. You can copy `.env.example` if it exists, or create a new one. Add your Supabase project URL and Anon Key:
    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```
    *(Note: If your project uses a different naming convention for these variables, please adjust accordingly. Check `src/integrations/supabase/client.ts` or similar files for the exact variable names used.)*

4.  **Initialize Supabase Database (if applicable):**
    If you have database schema migrations (e.g., in the `supabase/` directory or `src/utils/supabase-schema.sql`), apply them to your Supabase project. Refer to Supabase CLI documentation if needed.

### Running Locally

1.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application will typically be available at `http://localhost:8080` (or the port specified in your `vite.config.ts`).

## Testing Credentials (Local Use Only)

For local development and testing purposes, you can log in using the following credentials:

*   **Username:** `admin`
*   **Password:** `admin`

**IMPORTANT WARNING:**
*   This login method is **for local testing and development ONLY**.
*   It **bypasses the actual Supabase authentication** and uses a mock session object.
*   It is **highly insecure** and **MUST NOT be enabled or used in a production environment**.
*   The mock session does not represent a real Supabase user, so functionalities relying on a genuine, authenticated Supabase user with specific database records might not behave as expected.

This feature is implemented by checking for these specific credentials in the login form (`src/pages/Auth.tsx`) and then setting a flag in `localStorage` which `src/App.tsx` uses to create and inject a mock session.

---

## Available Scripts

In the project directory, you can run the following commands:

*   `npm run dev`: Runs the app in development mode.
*   `npm run build`: Builds the app for production to the `dist` folder.
*   `npm run build:dev`: Builds the app for development (if specific dev build steps are configured).
*   `npm run lint`: Lints the codebase using ESLint.
*   `npm run preview`: Serves the production build locally for preview.
