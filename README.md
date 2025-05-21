# CreatorHub - Digital Asset Marketplace

A modern marketplace platform for buying and selling digital assets with creator profiles and asset previews.

![CreatorHub](https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400)

## Features

- **Browse & Discover:** Explore digital assets across multiple categories
- **Creator Profiles:** Showcase your work and build your brand
- **Asset Preview:** See detailed previews before purchasing
- **Secure Payments:** Buy and sell with confidence
- **User Dashboard:** Manage purchased assets and favorites
- **PostgreSQL Database:** Persistent storage for all marketplace data

## Tech Stack

- **Frontend:** React with TypeScript
- **Styling:** Tailwind CSS with Shadcn UI components
- **Backend:** Node.js with Express
- **Database:** PostgreSQL (with in-memory fallback)
- **State Management:** React Query
- **Authentication:** Custom JWT-based auth with session management

## Setup & Installation

### Prerequisites

- Node.js (v14+)
- npm or yarn
- PostgreSQL database (optional, falls back to in-memory storage)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/creatorhub.git
cd creatorhub
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with:
```
DATABASE_URL=postgresql://user:password@localhost:5432/creatorhub
SESSION_SECRET=your_session_secret_here
```

4. Run database migrations:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:5000`

## User Guide

### For Buyers

1. **Browse Assets:** Explore categories or use the search function
2. **View Details:** Click on assets to see detailed information and previews
3. **Create Account:** Sign up to save favorites and make purchases
4. **Purchase:** Follow the checkout process to buy digital assets
5. **Download:** Access your purchased items from your profile dashboard

### For Creators

1. **Become a Creator:** Sign up and select "creator account" option
2. **Set Up Profile:** Add your bio, profile picture, and portfolio details
3. **Upload Assets:** Add your digital products with descriptions and previews
4. **Set Pricing:** Determine the price points for your work
5. **Track Sales:** Monitor your performance in the creator dashboard

## Project Structure

```
├── client/                # Frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility libraries
│   │   ├── pages/         # Application views
│   │   └── App.tsx        # Main application component
│
├── server/                # Backend application
│   ├── auth.ts            # Authentication logic
│   ├── routes.ts          # API endpoints
│   ├── storage.ts         # Database operations
│   └── index.ts           # Server entry point
│
└── shared/                # Shared code between client and server
    └── schema.ts          # Data models and validation
```

## API Documentation

The API follows RESTful conventions with the following main endpoints:

- **Authentication:**
  - `POST /api/auth/signup` - Create a new user account
  - `POST /api/auth/login` - Log in a user
  - `GET /api/auth/me` - Get current user info

- **Users:**
  - `GET /api/users/:id` - Get user details
  - `GET /api/creators` - Get list of creators

- **Categories:**
  - `GET /api/categories` - List all categories
  - `GET /api/categories/:id` - Get category details

- **Assets:**
  - `GET /api/assets` - List assets (with optional filters)
  - `GET /api/assets/:id` - Get asset details
  - `GET /api/assets/featured` - Get featured assets
  - `GET /api/assets/recent` - Get recently added assets
  - `GET /api/assets/trending` - Get trending assets
  - `POST /api/assets` - Create new asset (creator only)

## Development Notes

- **Authentication:** Uses express-session for managing user sessions
- **Database:** Can operate with PostgreSQL or fallback to in-memory storage
- **Asset Storage:** Currently uses URLs, future versions will include file upload

## Future Enhancements

- Real payment gateway integration (Stripe, PayPal)
- File upload system for creators
- Advanced analytics dashboard
- Messaging system between buyers and creators
- Reviews and ratings
- Enhanced security features

## License

This project is licensed under the MIT License - see the LICENSE file for details.