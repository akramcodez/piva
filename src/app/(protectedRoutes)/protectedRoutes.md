# Protected Routes Documentation

## Overview

Protected routes in Piva require authentication and are managed through a combination of Clerk authentication, middleware checks, and layout-based protection.

## Core Implementation

### 1. Route Structure

```
(protectedRoutes)/
├── layout.tsx       # Main protection wrapper
├── home/           # Dashboard
├── webinars/       # Webinar management
├── products/       # Product management
├── ai-agents/      # AI agent configuration
└── settings/       # User and stripe settings
```

### 2. Feature Access Controls

- **Webinars**: Create/manage automated sales webinars
- **Products**: Handle product listings and sales
- **AI Agents**: Configure AI assistants for webinars
- **Settings**: Manage account and Demo Stripe integration

### 3. Protection Layer ([`layout.tsx`](<src/app/(protectedRoutes)/layout.tsx>))

```typescript
export default async function Layout({ children }: Props) {
  const userExist = await onAuthenticateUser();
  if (!userExist?.user) {
    redirect('/sign-in');
  }
  // ...render protected content
}
```

- Wraps all protected routes
- Verifies authentication on every request
- Handles data preloading for protected features

### 4. Access Control

#### Authentication Check

- Uses [`onAuthenticateUser`](src/actions/auth.ts) for verification
- Redirects to sign-in if unauthenticated
- Maintains session state

#### Data Protection

- User-specific content
- API access control

### 5. Protected Features

#### Webinars

- Creation and management
- Live webinar hosting
- Attendee management
- Demo Stripe integration required

#### Products

- Product creation/management
- Sales tracking
- Demo Stripe integration required

#### AI Agents

- Agent configuration
- Custom prompts
- Integration with webinars
- Currently disabled for some reasons

#### Settings

- Account management
- Analytics access
- Demo Stripe connection

### 6. Integration Points

#### Header Integration

```typescript
<Header
  user={userExist.user}
  stripeProducts={stripeProducts}
  assistants={assistants.data}
/>
```

#### Sidebar Navigation

```typescript
<Sidebar /> // Protected route navigation
```

## State Management

### 1. User Session

- Maintained through Clerk
- Synced with database
- Regular validation

### 2. Feature Access

- Based on user status
- Role-based permissions
- Demo Stripe connection status

## Common Patterns

### Protected API Routes

```typescript
const handler = async () => {
  const { user } = await onAuthenticateUser();
  if (!user) throw new Error('Unauthorized');
  // Protected logic
};
```

### Protected Actions

```typescript
'use server';
const action = async () => {
  const { user } = await onAuthenticateUser();
  if (!user) redirect('/sign-in');
  // Protected action logic
};
```

## Security Considerations

1. Always verify authentication in:

   - Server actions
   - API routes
   - Protected pages

2. Handle expired sessions:

   - Automatic sign-out
   - Data cleanup
   - Redirect to sign-in

3. Feature Protection:
   - User role validation
   - Resource access control
   - Demo Stripe integration checks
