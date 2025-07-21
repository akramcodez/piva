# Public Routes Documentation

## Overview

Public routes in Piva are accessible without authentication, providing landing pages, webinar access, and public API endpoints.

## Core Implementation

### 1. Route Structure

```
(publicRoutes)/
├── layout.tsx          # Public layout wrapper
├── live-webinar/       # Public webinar access
│   ├── page.tsx       # Landing page
│   ├── [liveWebinarId]/ # Dynamic webinar routes
│   │   ├── page.tsx   # Webinar view
│   │   ├── call/      # Webinar call handling
│   │   └── _components/ # Shared components
└── callback/          # Auth callback handling
```

### 2. Public Features

#### Live Webinar Access

- Publicly accessible webinar pages
- AI agent interaction for non-authenticated users
- CTA and purchase flows
- Real-time chat integration

### 3. Component Structure

#### Webinar Components

```typescript
// Common components for webinar display
<RenderWebinar />      // Webinar rendering
<LiveWebinar />        // Live session handling
<CTADialogBox />      // Call-to-action components
<PurchaseDialogBox /> // Purchase flow handling
```

### 4. Key Functionalities

#### Webinar Access Control

- Public access to webinar content
- Purchase validation
- Chat access management
- AI agent interaction limits

#### Purchase Flows

- Product showcase
- Purchase validation
- Access granting

### 5. Integration Points

#### Stream Chat

```typescript
// Real-time chat integration
const channel = client.channel('livestream', webinar.id, {
  name: webinar.title,
});
```

#### AI Agent Integration

```typescript
// AI agent connection for public users
const AutoConnectCall = ({ userName, assistantId }) => {
  // Handle AI agent interactions
};
```

## Common Patterns

### Public API Routes

```typescript
// No authentication required
export async function GET(req: Request) {
  // Public API logic
}
```

### Public Actions

```typescript
'use server';
export async function publicAction() {
  // Public action logic
}
```

## Security Considerations

1. Access Controls

   - Rate limiting
   - CORS policies
   - Data exposure limits

2. Public Data
   - Limited data exposure
   - Sanitized responses
   - Protected sensitive info
