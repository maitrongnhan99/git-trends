# Building GitTrends: GitHub Repository Analytics Dashboard

A comprehensive implementation plan for creating GitTrends using Next.js, TailwindCSS, GitHub API, PostgreSQL, and Prisma.

## Phase 1: Project Setup and Configuration

### Set up Next.js Project with Tailwind CSS

1. Configure Tailwind CSS for dark mode in `tailwind.config.js`:

   ```js
   module.exports = {
     darkMode: "class",
     // other configurations
   };
   ```

2. Implement Dark Mode Toggle:
   - Install next-themes package for theme management:
     ```bash
     yarn add next-themes
     ```
   - Create a ThemeProvider component to handle dark/light mode transitions

### PostgreSQL Database Setup

1. Create a new PostgreSQL database for the application:

   ```sql
   CREATE DATABASE gittrends;
   ```

2. Configure the database connection environment variables in `.env`:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/gittrends
   ```

### Prisma Integration

1. Install and initialize Prisma:

   ```bash
   yarn add prisma --dev
   npx prisma init
   ```

2. Define the database schema in `prisma/schema.prisma` with models for:
   - Users
   - Repositories (stars, forks, commits data)
   - UserPreferences (dashboard settings)
   - TrendingRepos (tracking trending repositories)
