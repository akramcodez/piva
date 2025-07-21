# Authentication System Documentation

## Overview

Piva uses Clerk for authentication combined with custom middleware and database integration for user management.

## Core Components

### 1. Clerk Authentication

- Handles user sign-in/sign-up
- Manages authentication state
- Provides user tokens and session management

### 2. Middleware ([`middleware.ts`](src/middleware.ts))

```typescript
const publicRoutes = [
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api(.*)',
  '/live-webinar(.*)',
  '/callback(.*)',
];
```

- Protects all non-public routes
- Redirects unauthenticated users to sign-in
- Allows public access to specified routes

### 3. Authentication Flow

1. User visits protected route
2. Middleware checks authentication
3. If authenticated:
   - Access granted
   - User data synced with database
4. If not authenticated:
   - Redirect to sign-in
   - After sign-in, return to original route

### 4. Server-Side Authentication ([`auth.ts`](src/actions/auth.ts))

```typescript
export const onAuthenticateUser = async () => {
  const { userId } = auth();
  if (!userId) return { user: null };

  const user = await prismaClient.user.findUnique({
    where: { id: userId },
  });

  return { user };
};
```

- Validates user sessions
- Syncs with database
- Used in server actions and API routes

### 5. Protected Routes

- Wrapped in `(protectedRoutes)` layout
- Require valid authentication
- Automatic redirect if session expires
- Full access to app features

### 6. Public Routes

- Landing page
- Authentication pages
- Public webinar views
- API endpoints
- No authentication required
