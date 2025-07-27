# Project Agents.md Guide for OpenAI Codex

This Agents.md file provides comprehensive guidance for OpenAI Codex and other AI agents working with this codebase.

## Project Overview

This is a modern frontend project based on React 18, TypeScript, and Vite. It's suitable for building high-performance Single Page Applications (SPA) with an integrated modern development toolchain and best practices. This project is a modern financial management application designed to help users track their income, expenses, debts, and assets.

### Purpose and Functionality
- **Purpose:** To provide a clear and user-friendly platform for personal finance management.
- **Functionality:** User authentication, tracking of financial transactions (income, expenses), management of debts and assets, financial summaries and dashboards.
- **Applicable Scenarios:** Personal finance tracking, budgeting, asset management.
- **Problems Solved:** Helps users organize their financial data, gain insights into their spending habits, and manage their overall financial health.

## Tech Stack

- **Frontend Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **UI Components:** Shadcn/ui (built on Radix UI and Tailwind CSS)
- **Styling:** Tailwind CSS / Styled-components
- **Routing:** React Router v6
- **State Management:** Zustand / Redux Toolkit / @tanstack/react-query
- **Forms:** React Hook Form with Zod for validation
- **HTTP Client / Backend Integration:** Axios / Supabase Client (`@supabase/supabase-js`)
- **Linting:** ESLint + Prettier
- **Code Quality:** TypeScript + Husky
- **Testing Framework:** Vitest + React Testing Library
- **Deployment:** Vercel, Netlify, AWS Amplify

## Project Structure

```
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
├── docs/                   # Project documentation
├── .env.example            # Environment variables example
├── package.json            # Project dependencies and scripts
├── vite.config.ts          # Vite build configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation (AI agents may update this)
```

## Development Guidelines

### Code Style
- **Formatting:** Use consistent code formatting tools like Prettier.
- **Best Practices:** Follow language-specific best practices (TypeScript, React).
- **Readability:** Keep code clean, well-commented, and readable.

### Naming Conventions
- **Files:**
  - Components: `PascalCase.tsx`
  - Hooks: `useCamelCase.ts`
  - Other `.ts` / `.tsx` files: `camelCase.ts` or `PascalCase.tsx`
- **Variables:** `camelCase`
- **Functions:** `camelCase`
- **Classes/Interfaces/Types:** `PascalCase`

### React Components
- **Functional Components:** Use functional components with Hooks.
- **Props:** Define TypeScript interfaces for all component props.
- **Single Responsibility:** Keep components small and focused.
- **Example: Button Component**
  ```typescript
  interface ButtonProps {
    variant: 'primary' | 'secondary' | 'danger';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    onClick?: () => void;
    children: React.ReactNode;
  }

  export const Button: React.FC<ButtonProps> = ({
    variant,
    size = 'medium',
    disabled = false,
    onClick,
    children
  }) => {
    return (
      <button
        className={`btn btn-${variant} btn-${size}`}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
    );
  };
  ```

### State Management (Zustand Example)
```typescript
// store/userStore.ts
import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  setLoading: (isLoading) => set({ isLoading }),
}));
```

### API Service (Axios Example)
```typescript
// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;
```

### Git Workflow
- **Branch Naming:** `feature/descriptive-name`, `bugfix/issue-number`, `chore/task-description`.
- **Commit Messages:** Follow conventional commit format (e.g., `feat: add user profile page`).
- **Pull Requests (PRs):**
  - Clear description of changes.
  - Reference related issues.
  - Ensure all tests and lint checks pass.
  - Include screenshots for UI changes.

## Environment Setup

### Development Requirements
- **Node.js:** >= 18.0.0
- **Package Manager:** npm >= 8.0.0 or yarn >= 1.22.0
- **Supabase Account:** Required for backend functionality.

### Installation Steps
1. **Clone the project:**
   ```bash
   git clone <repository-url>
   ```
2. **Navigate to project directory:**
   ```bash
   cd vite_react_shadcn_ts
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Set up environment variables:**
   Create a `.env` file and add your Supabase URL and Anon Key:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
5. **Start development server:**
   ```bash
   npm run dev
   ```

## Testing Strategy

### Unit Testing
- **Framework:** Vitest + React Testing Library
- **Coverage:** Aim for high test coverage for critical components and logic.
- **Organization:** Keep test files close to the source files (e.g., `Button.test.tsx` for `Button.tsx`).
- **Example:**
  ```typescript
  // tests/components/Button.test.tsx
  import { render, screen, fireEvent } from '@testing-library/react';
  import { Button } from '../src/components/Button';

  describe('Button Component', () => {
    test('renders button with text', () => {
      render(<Button variant="primary">Click me</Button>);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    test('calls onClick when clicked', () => {
      const handleClick = vi.fn();
      render(
        <Button variant="primary" onClick={handleClick}>
          Click me
        </Button>
      );

      fireEvent.click(screen.getByText('Click me'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
  ```

### Programmatic Checks
Before submitting changes, run:
```bash
# Lint check
npm run lint

# Type check (if configured)
npm run type-check

# Build check
npm run build
```

## Deployment Guide

### Build Process
```bash
# Build command
npm run build
```

### Deployment Steps
1. Prepare production environment.
2. Configure environment variables.
3. Execute deployment scripts.
4. Verify deployment results.

## Performance Optimization

### Frontend Optimization
- **Code Splitting:** Use `React.lazy` for route-based or component-based splitting.
- **Lazy Loading:** Lazy load images and other assets.
- **Caching:** Implement caching strategies for assets and API requests.
- **Memoization:** Use `React.memo`, `useMemo`, and `useCallback` to prevent unnecessary re-renders.

### Backend Optimization
- **Database Query Optimization:** Ensure efficient Supabase queries.
- **Caching:** Use caching mechanisms for frequently accessed data.
- **Load Balancing:** (If applicable) Distribute traffic across multiple instances.

## Security Considerations

### Data Security
- **Input Validation:** Use Zod for schema validation.
- **SQL Injection Protection:** Supabase handles this, but be mindful of raw SQL queries.
- **XSS Protection:** React helps prevent XSS, but be cautious with `dangerouslySetInnerHTML`.

### Authentication & Authorization
- **User Authentication Flow:** Handled by Supabase Auth.
- **Permission Control:** Implement role-based access control (RBAC) using Supabase RLS.
- **Token Management:** Securely manage JWTs provided by Supabase.

## Monitoring and Logging

- **Application Monitoring:** Use tools like Sentry or LogRocket for performance and error tracking.
- **Log Management:** Implement a structured logging strategy.

## Common Issues

- **Issue 1: Vite Development Server Slow Startup**
  - **Solution:** Check dependency pre-build cache, use `npm run dev -- --force`, optimize `vite.config.ts`.
- **Issue 2: TypeScript Type Errors**
  - **Solution:** Ensure correct `@types` are installed, check `tsconfig.json`, run `npm run type-check`.
- **Issue 3: Supabase Connection Errors**
  - **Solution:** Verify `.env` variables, check network, ensure Supabase instance is active.

## Reference Resources

- [React Official Documentation](https://react.dev/)
- [Vite Official Documentation](https://vitejs.dev/)
- [TypeScript Official Documentation](https://www.typescriptlang.org/)
- [Supabase Documentation](https://supabase.com/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs/)
- [Shadcn/ui Documentation](https://ui.shadcn.com/)
- [React Router Documentation](https://reactrouter.com/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Vitest Documentation](https://vitest.dev/)
