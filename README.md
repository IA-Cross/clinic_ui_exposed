# Clínica Odontológica Láser Verboonen

A modern React web application for a laser dental clinic, featuring a public website with blog functionality and an admin panel for content management.

## Features

### Public Features
- Modern, responsive homepage with hero section, about section, and latest blog posts
- Blog listing page with category filtering and search
- Individual blog post pages with related articles
- Contact form
- Newsletter subscription

### Admin Features
- Secure login system
- Blog management dashboard with statistics
- Create, edit, publish, and delete blog posts
- Rich text editor for blog content
- Draft management system
- Image upload support (via URL)
- Category and tag management
- Quick links management

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **React Router** for navigation
- **Tailwind CSS** for styling
- **React Hook Form** for form handling
- **date-fns** for date formatting
- **localStorage** for data persistence (can be replaced with backend API)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/       # Reusable React components
│   ├── common/      # Common components (Header, Footer, Button, etc.)
│   ├── blog/        # Blog-related components
│   ├── admin/       # Admin panel components
│   └── forms/       # Form components
├── pages/           # Page components
├── context/         # React Context providers (Auth, Blog)
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## Admin Access

For demo purposes, any username and password will work for admin login. In production, this should be replaced with proper authentication.

## Data Persistence

Currently, the application uses `localStorage` to persist blog posts and authentication state. This allows the app to work immediately without a backend. To connect to a backend API:

1. Replace `src/utils/storage.ts` functions with API calls
2. Update `src/context/BlogContext.tsx` to use API endpoints
3. Update `src/context/AuthContext.tsx` for proper authentication

## License

© 2023 Clínica Odontológica Láser Verboonen. All rights reserved.
