# Project Agents.md Guide

This Agents.md file provides comprehensive guidance for AI agents working with the `vite_react_shadcn_ts` codebase.

## Project Overview

This project is a modern financial management application designed to help users track their income, expenses, debts, and assets. It utilizes a tech stack centered around React, TypeScript, Vite, and Shadcn/ui for a high-performance user interface, with Supabase providing backend services.

**Purpose:** To provide a clear and user-friendly platform for personal finance management.
**Functionality:** User authentication, tracking of financial transactions (income, expenses), management of debts and assets, financial summaries and dashboards.
**Applicable Scenarios:** Personal finance tracking, budgeting, asset management.
**Problems Solved:** Helps users organize their financial data, gain insights into their spending habits, and manage their overall financial health.

## Tech Stack

*   **Frontend Framework:** React 18 + TypeScript
*   **Build Tool:** Vite
*   **UI Components:** Shadcn/ui (built on Radix UI and Tailwind CSS)
*   **Styling:** Tailwind CSS
*   **Routing:** React Router v6
*   **State Management:** Primarily @tanstack/react-query for server state; component state and context for UI state.
*   **Forms:** React Hook Form with Zod for validation
*   **HTTP Client / Backend Integration:** Supabase Client (`@supabase/supabase-js`)
*   **Linting:** ESLint
*   **Code Quality:** TypeScript
*   **Development Server:** Vite

## Project Structure for AI Agent Navigation

vite_react_shadcn_ts/
├── public/                 # Static assets (AI agents should generally not modify these directly)
│   ├── favicon.ico
│   └── ...
├── src/                    # Source code for AI agent analysis and modification
│   ├── App.tsx             # Root application component, routing setup
│   ├── main.tsx            # Application entry point
│   ├── components/         # Reusable components
│   │   ├── Layout.tsx      # Main application layout
│   │   ├── ProtectedRoute.tsx # Route protection logic
│   │   ├── assets/         # Components related to assets
│   │   ├── dashboard/      # Components for financial summaries
│   │   ├── debt/           # Components related to debt management
│   │   ├── expenses/       # Components for expense tracking
│   │   ├── income/         # Components for income tracking
│   │   └── ui/             # Shadcn/ui based general-purpose UI components
│   ├── contexts/           # React contexts (e.g., SupabaseContext.tsx)
│   ├── data/               # Mock data (e.g., mockData.ts)
│   ├── hooks/              # Custom React Hooks (e.g., useExchangeRate.tsx, use-toast.ts)
│   ├── integrations/       # Integration with external services
│   │   └── supabase/       # Supabase client setup and types
│   ├── lib/                # Utility functions (e.g., utils.ts for cn)
│   ├── pages/              # Page components for different routes
│   ├── types/              # TypeScript type definitions (e.g., finance.ts)
│   └── utils/              # Various utilities, Supabase schema, edge functions
├── supabase/               # Supabase specific configurations and functions
│   ├── functions/          # Supabase edge functions
│   └── config.toml
├── tests/                  # Test files (AI agents should maintain and extend if present)
├── .env.example            # Example environment variables (if created)
├── package.json            # Project dependencies and scripts
├── vite.config.ts          # Vite build configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation (AI agents may update this)

## Development Guidelines

### Code Style
*   **Formatting:** Follow existing code style. Consider integrating Prettier if not already strictly enforced by ESLint.
*   **ESLint:** Adhere to the rules defined in `.eslintrc.js` (or `eslint.config.js`). Run `npm run lint` to check.
*   **TypeScript:** Utilize TypeScript for all new code. Follow TypeScript best practices, including strong typing for props, state, and function signatures. The project currently uses some relaxed settings (`noImplicitAny: false`); aim for stricter typing where feasible.
*   **Readability:** Keep code clean, well-commented (especially for complex logic), and readable.

### Naming Conventions
*   **Files:**
    *   Components: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
    *   Hooks: `useCamelCase.ts` (e.g., `useAuthentication.ts`)
    *   Other `.ts` / `.tsx` files: `camelCase.ts` or `PascalCase.tsx` depending on convention (observe existing files).
*   **Variables:** `camelCase`
*   **Functions:** `camelCase`
*   **Classes/Interfaces/Types:** `PascalCase`
*   **CSS (Tailwind):** Utility-first. Custom CSS classes should be prefixed if necessary (e.g., `app-`).

### React Components
*   **Functional Components:** Use functional components with Hooks.
*   **Props:** Define TypeScript interfaces for all component props.
*   **Single Responsibility:** Keep components small and focused on a single piece of functionality.
*   **Shadcn/ui:** Leverage components from `src/components/ui/` and follow Shadcn/ui patterns for composition and styling.

### Git Workflow
*   **Branch Naming:** `feature/descriptive-name`, `bugfix/issue-number-description`, `chore/task-description`.
*   **Commit Messages:** Follow conventional commit format (e.g., `feat: add user profile page`, `fix: resolve login bug #123`).
*   **Pull Requests (PRs):**
    *   Include a clear description of changes.
    *   Reference related issues.
    *   Ensure all tests (if applicable) and lint checks pass.
    *   Keep PRs focused on a single concern.

## Environment Setup

### Development Requirements
*   **Node.js:** Version specified in project's `.nvmrc` or `package.json` (engines field if present - currently not, assume >= 18.0.0 as a modern standard).
*   **Package Manager:** `npm` (based on `package-lock.json`).
*   **Supabase Account:** Required for backend functionality. Credentials should be stored in environment variables.

### Installation Steps
1.  **Clone the project:**
    ```bash
    git clone <repository-url>
    cd vite_react_shadcn_ts
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up environment variables:**
    Create a `.env` file in the project root (copy from `.env.example` if it exists, or create one).
    Add your Supabase URL and Anon Key:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    # Add other environment variables as needed
    ```
4.  **Initialize Supabase (if schema needs to be applied):**
    Refer to Supabase documentation and `supabase/` directory for schema migration if setting up a new instance.
5.  **Start development server:**
    ```bash
    npm run dev
    ```
    The application should be accessible at `http://localhost:8080` (or as specified in Vite config).

## Core Feature Implementation

### Supabase Integration
*   The Supabase client is initialized in `src/integrations/supabase/client.ts`.
*   Authentication is handled via Supabase Auth, as seen in `src/App.tsx` and `src/components/ProtectedRoute.tsx`.
*   Data fetching and mutations likely use `@tanstack/react-query` in conjunction with Supabase client calls. Example:
    ```typescript
    // Example of fetching data with React Query and Supabase
    // (Illustrative - adapt to actual project patterns)
    import { useQuery } from '@tanstack/react-query';
    import { supabase } from '@/integrations/supabase/client';

    async function fetchUserData(userId: string) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) throw error;
      return data;
    }

    function UserProfile({ userId }: { userId: string }) {
      const { data, isLoading, error } = useQuery({
        queryKey: ['user', userId],
        queryFn: () => fetchUserData(userId),
      });

      if (isLoading) return <p>Loading...</p>;
      if (error) return <p>Error loading user data.</p>;
      // Render user data
      return <div>{data?.username}</div>;
    }
    ```

### Shadcn/ui Components
*   Components are heavily utilized from `src/components/ui/`.
*   These are typically composed and styled using Tailwind CSS.
*   Refer to the official Shadcn/ui documentation for usage and customization.

## Testing Strategy

*   **Current Status:** No explicit testing framework (like Vitest, Jest, or React Testing Library) setup is immediately visible from `package.json` scripts or a dedicated `tests/` directory with test files (though an empty `tests/` directory might exist from the template).
*   **To Implement/Maintain:**
    *   **Unit Tests:** For individual components, hooks, and utility functions. Vitest or Jest with React Testing Library is recommended.
    *   **Integration Tests:** To test interactions between components and services (e.g., Supabase calls).
    *   **End-to-End Tests:** (Optional, for larger features) Using tools like Playwright or Cypress.
*   **Running Tests (if configured):**
    ```bash
    # Standard command, adapt if scripts differ
    npm test
    npm test -- --coverage # For coverage
    ```

### Local Admin Test Credentials

For local development and testing, a bypass has been implemented to allow login with the following credentials:

*   **Username:** `admin`
*   **Password:** `admin`

**AI Agent Advisory:**
*   This login mechanism is **strictly for local testing and development purposes**.
*   It **bypasses the standard Supabase authentication flow** and injects a **mock session object**. This means no actual Supabase user record for "admin" is queried or created by this method.
*   This approach is **inherently insecure** and **MUST NOT be replicated, extended, or relied upon for any production functionality**.
*   When testing features that require a genuine authenticated user context (e.g., row-level security, user-specific data linked via Supabase user ID), be aware that this mock admin session will not behave like a real user.
*   The implementation involves a credential check in `src/pages/Auth.tsx` and mock session creation via `localStorage` handled in `src/App.tsx`. AI agents modifying authentication or session management logic should be aware of this bypass.

---

## Deployment Guide

### Build Process
*   Generate a production build:
    ```bash
    npm run build
    ```
    This will create a `dist/` folder with optimized static assets.

### Deployment Steps
1.  **Prepare Production Environment:** Ensure your hosting provider (e.g., Vercel, Netlify, AWS Amplify) is configured.
2.  **Configure Environment Variables:** Set up `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and any other production-specific environment variables in your hosting provider's settings.
3.  **Deploy:** Connect your Git repository to the hosting provider or upload the `dist/` folder.
4.  **Verify:** Test the deployed application thoroughly.

## Programmatic Checks for AI Agents

Before submitting changes, AI agents should ensure the following checks pass:

1.  **Lint Check:**
    ```bash
    npm run lint
    ```
2.  **Build Check:**
    ```bash
    npm run build
    ```
    (This also implicitly checks for TypeScript errors if `tsc --noEmit` is part of the build or a separate script).

All checks must pass before code generated or modified by an AI agent can be merged.

## Environment Variables

Key environment variables required by the project:

*   `VITE_SUPABASE_URL`: The URL for your Supabase project.
*   `VITE_SUPABASE_ANON_KEY`: The anonymous public key for your Supabase project.
*   (Add any other variables like API keys for financial data sources if integrated)

Ensure these are present in your `.env` file for local development and configured in your deployment environment.

## Common Issues & Solutions

*   **Issue: Supabase connection errors.**
    *   **Solution:** Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct in your `.env` file and that your Supabase instance is running. Check network connectivity.
*   **Issue: Tailwind CSS classes not applying.**
    *   **Solution:** Ensure `tailwind.config.ts` is correctly configured and that your `src/index.css` (or main CSS file) includes Tailwind directives (`@tailwind base; @tailwind components; @tailwind utilities;`). Make sure the Vite development server has restarted after changes to Tailwind config.
*   **Issue: Type errors after installing new packages.**
    *   **Solution:** Install corresponding `@types/<package-name>` if available. Ensure `tsconfig.json` is correctly configured. Run `npm run build` or `tsc --noEmit` to get detailed type errors.

## Reference Resources

*   [React Documentation](https://react.dev/)
*   [Vite Documentation](https://vitejs.dev/)
*   [TypeScript Documentation](https://www.typescriptlang.org/docs/)
*   [Tailwind CSS Documentation](https://tailwindcss.com/docs/)
*   [Shadcn/ui Documentation](https://ui.shadcn.com/)
*   [Supabase Documentation](https://supabase.com/docs/)
*   [React Router Documentation](https://reactrouter.com/)
*   [@tanstack/react-query Documentation](https://tanstack.com/query/latest/docs/react/overview)
*   [ESLint Documentation](https://eslint.org/docs/latest/)

This guide should help AI agents understand and contribute to the project effectively.
