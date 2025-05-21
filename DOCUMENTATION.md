# CreatorHub - Operation Manual

## Overview

CreatorHub is a digital asset marketplace where creators can sell their digital products (graphics, code, templates, fonts, etc.) and buyers can discover and purchase them. This document explains how to use the platform, both as a buyer and as a creator.

## System Architecture

The application follows a modern full-stack architecture:

1. **Frontend**: React-based user interface
2. **Backend**: Express.js API server
3. **Database**: PostgreSQL for data persistence

## Getting Started

### Installation and Setup

1. Clone the repository
2. Install dependencies with `npm install`
3. Configure environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `SESSION_SECRET`: Secret key for session encryption
4. Run database migrations: `npm run db:push`
5. Start the application: `npm run dev`

### Initial Configuration

On first run, the system will:
1. Create database tables
2. Seed default categories
3. Create sample assets and users

## User Guide

### Account Management

#### Registration

1. Click the "Sign Up" button in the navigation
2. Fill in required information:
   - Username
   - Display Name
   - Password
   - Bio (optional)
3. Toggle "Creator Account" if you plan to sell assets
4. Click "Create Account"

#### Login

1. Click the "Login" button
2. Enter your username and password
3. Click "Login"

#### Profile Management

1. Access your profile through the avatar icon in the top right
2. View your:
   - Purchased assets
   - Created assets (if you're a creator)
   - Favorites
3. Edit your profile information

### For Buyers

#### Browsing Assets

1. **Home Page**: View featured, trending, and recent assets
2. **Explore Page**: Browse all assets with filters
3. **Categories**: Browse assets by category
4. **Search**: Use the search bar to find specific assets

#### Asset Details

1. Click on any asset to view details
2. Preview images and information
3. See creator information
4. View price and other details

#### Purchasing Assets

1. Click "Buy Now" on an asset detail page
2. Review purchase information
3. Provide payment details
4. Complete purchase
5. Access the downloaded asset from your profile

#### Managing Purchases

1. Go to your profile
2. Select the "Purchased" tab
3. Download or view your purchased assets

### For Creators

#### Creator Dashboard

1. Toggle to creator mode in your profile
2. View analytics and sales information

#### Uploading Assets

1. Click "Upload New Asset" from your profile
2. Provide asset details:
   - Title
   - Description
   - Category
   - Price
   - Preview images
   - File to sell
3. Submit for review (if enabled) or publish directly

#### Managing Assets

1. Go to your profile
2. Select the "My Assets" tab
3. Edit, update, or delete your assets
4. View performance statistics

## System Features

### Asset Management

- **Categories**: Assets are organized in categories for easy browsing
- **Featured Assets**: Highlighted on the home page
- **Trending Assets**: Sorted by popularity
- **Recent Assets**: Latest uploads shown prominently

### Search and Discovery

- **Full-text Search**: Find assets by title, description, or tags
- **Category Filters**: Browse within specific categories
- **Price Filters**: Filter by price range
- **Creator Filters**: View assets from specific creators

### User Authentication

- **Secure Sessions**: User sessions are encrypted
- **Role-based Access**: Different permissions for buyers and creators
- **Profile Management**: Customize profiles with avatars and bio

### Payment Processing

- Secure payment processing system
- Transaction history
- Revenue tracking for creators

## Technical Details

### API Endpoints

#### Authentication

- `POST /api/auth/signup`: Create a new account
- `POST /api/auth/login`: Authenticate a user
- `GET /api/auth/me`: Get current user information
- `POST /api/auth/logout`: End the current session

#### Users

- `GET /api/users/:id`: Get user profile
- `GET /api/creators`: Get list of creators

#### Categories

- `GET /api/categories`: List categories
- `GET /api/categories/:id`: Get category details

#### Assets

- `GET /api/assets`: List assets with filters
- `GET /api/assets/:id`: Get asset details
- `POST /api/assets`: Create a new asset (creators only)
- `GET /api/assets/featured`: Get featured assets
- `GET /api/assets/recent`: Get recent assets
- `GET /api/assets/trending`: Get trending assets

### Database Schema

- **Users**: User accounts and profiles
- **Categories**: Asset categories
- **Assets**: Digital products for sale
- **Purchases**: Record of transactions

## Troubleshooting

### Common Issues

1. **Database Connection**: Ensure DATABASE_URL is correctly configured
2. **Session Problems**: Check SESSION_SECRET is set
3. **Asset Upload Failures**: Verify file size and format restrictions

### Error Handling

The application provides detailed error messages for:
- Authentication failures
- Permission issues
- Data validation errors

## Maintenance

### Database Backups

It's recommended to:
1. Set up regular PostgreSQL backups
2. Store backups securely off-site

### Updates

When updating the application:
1. Back up the database
2. Run migrations (`npm run db:push`)
3. Test functionality before deploying to production

## Security Considerations

- User passwords are never stored in plaintext
- Payment information is not stored on the server
- API routes are protected against unauthorized access
- Session data is encrypted

## Customization

The application can be customized in several ways:

1. **Styling**: Modify Tailwind configuration in `tailwind.config.ts`
2. **Layout**: Adjust components in the `components` directory
3. **Business Logic**: Modify API routes in `server/routes.ts`
4. **Data Model**: Update schemas in `shared/schema.ts`

## Performance Optimization

For high-traffic deployments:
1. Consider implementing a caching layer
2. Optimize database queries
3. Use a CDN for static assets

---

This manual provides a comprehensive overview of CreatorHub's operation. For specific technical questions, refer to the codebase documentation or open an issue in the project repository.