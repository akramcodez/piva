# Piva.AI - AI-Powered Webinar Platform

A modern SaaS platform for hosting AI-enhanced webinars with automated sales capabilities, real-time chat, and intelligent customer interaction.

## Features

- **AI-Powered Webinars**: Host live webinars with AI agent assistance
- **Real-time Chat**: Stream-powered chat with automated moderation
- **Product Integration**: Seamless product sales during webinars
- **Demo Stripe Integration**: It's not real Stripe Account integration
- **Analytics Dashboard**: Comprehensive webinar and sales analytics
- **Responsive Design**: Mobile-first responsive UI

## Architecture

### Authentication System

Robust authentication using Clerk with custom middleware protection.

- [Authentication Documentation](<src/app/(auth)/auth.md>)

### Route Structure

- **Protected Routes**: Authenticated user features and dashboard
  - [Protected Routes Documentation](<src/app/(protectedRoutes)/protectedRoutes.md>)
- **Public Routes**: Landing pages and public webinar access
  - [Public Routes Documentation](<src/app/(publicRoutes)/publicRoutes.md>)

## Tech Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui
- **State Management**: Zustand
- **Authentication**: Clerk

### Backend

- **Runtime**: Node.js
- **Database**: PostgreSQL + Prisma ORM
- **Real-time**: Stream Chat
- **AI Integration**: Vapi.ai

### Deployment

- **Platform**: Vercel
- **Database**: Neon

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Stripe account
- Clerk account
- Stream account
- Vapi.ai account

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/piva-ai.git
   cd piva-ai
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env.local
   ```

4. **Configure Environment Variables**

   ```env
   # Database
   DATABASE_URL="postgresql://..."

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=

   # Stripe
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
   STRIPE_SECRET_KEY=

   # Stream Chat
   NEXT_PUBLIC_STREAM_API_KEY=
   STREAM_SECRET_KEY=

   # Vapi.ai
   VAPI_API_KEY=
   ```

5. **Database Setup**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

6. **Run Development Server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/              # Authentication routes
│   ├── (protectedRoutes)/   # Authenticated user routes
│   ├── (publicRoutes)/      # Public access routes
│   └── api/                 # API routes
├── components/
│   ├── ui/                  # Reusable UI components
│   └── ReusableComponents/  # Feature-specific components
├── actions/                 # Server actions
├── lib/                     # Utility functions
├── store/                   # State management
└── types/                   # TypeScript definitions
```

## 🎯 Core Features

### Dashboard (`/home`)

- Webinar analytics
- Revenue tracking
- Quick actions
- Recent activity

### Webinar Management (`/webinars`)

- Create/edit webinars
- Schedule management
- Attendee tracking
- AI agent configuration

### Product Management (`/products`)

- Product catalog
- Sales tracking
- Stripe integration
- Inventory management

### AI Agents (`/ai-agents`)

- Custom AI assistants
- Prompt configuration
- Performance analytics
- Integration settings

### Settings (`/settings`)

- Account management
- Stripe connection
- Platform preferences
- Analytics configuration

## Security

- **Authentication**: Clerk-based secure authentication
- **Authorization**: Route-level protection
- **Data Protection**: Encrypted sensitive data
- **Payment Security**: PCI-compliant Stripe integration
- **API Security**: Rate limiting and validation

## Deployment

### Vercel Deployment

1. **Connect to Vercel**

   ```bash
   npm i -g vercel
   vercel login
   vercel
   ```

2. **Configure Environment Variables**

   - Add all environment variables in Vercel dashboard
   - Set up production database
   - Configure domain settings

3. **Deploy**
   ```bash
   vercel --prod
   ```

## API Documentation

### Authentication

All protected API routes require valid authentication headers.

### Endpoints

- `GET /api/webinars` - List user webinars
- `POST /api/webinars` - Create new webinar
- `GET /api/products` - List user products
- `POST /api/stripe-connect` - Stripe connection
- `GET /api/analytics` - Get analytics data

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:

- Email: skcodewizard786@gmail.com
- Twitter: [@akramcodez](https://twitter.com/akramcodez)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Clerk](https://clerk.dev/) - Authentication
- [Stripe](https://stripe.com/) - Payment processing
- [Stream](https://getstream.io/) - Real-time chat
- [Vapi.ai](https://vapi.ai/) - AI voice integration
- [Shadcn/ui](https://ui.shadcn.com/) - UI components

---

Built with ❤️ by SK Akram
