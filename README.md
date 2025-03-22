# Git Trends

A GitHub Repository Analytics Dashboard that helps developers discover trending repositories, track metrics, and stay updated with the latest developments in the GitHub community.

![license](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.2.2-black)
![React](https://img.shields.io/badge/React-19.0.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0.0-38B2AC)

## ✨ Features

- **Trending Repositories**: Discover popular GitHub repositories across different programming languages
- **Analytics Dashboard**: Track stars, forks, and commit activity over time
- **User Authentication**: Log in with GitHub to access personalized features
- **Favorites Management**: Save and organize repositories of interest
- **Dark Mode Support**: Switch between light and dark themes for comfortable viewing

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- Yarn package manager
- PostgreSQL database

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/git-trends.git
cd git-trends
```

2. Install dependencies:

```bash
yarn
```

3. Set up environment variables:

Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL=postgresql://user:password@localhost:5432/gittrends
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
```

4. Set up the database:

```bash
npx prisma db push
```

5. Run the development server:

```bash
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🧰 Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS 4
- **State Management**: React Hooks
- **Styling**: TailwindCSS, Headless UI
- **Authentication**: NextAuth.js with GitHub provider
- **Database**: PostgreSQL, Prisma ORM
- **Deployment**: Vercel (recommended)

## 📚 Project Structure

```
git-trends/
├── public/           # Static assets
├── prisma/           # Database schema and migrations
├── src/
│   ├── app/          # Next.js app router pages and layouts
│   ├── components/   # Reusable UI components
│   ├── lib/          # Utility functions and shared logic
│   ├── hooks/        # Custom React hooks
│   └── types/        # TypeScript type definitions
└── ...
```

## 📝 Development Guidelines

- Follow the TypeScript coding standards
- Use arrow functions for React components and include proper type definitions
- Write tests for critical functionality
- Follow the Git workflow described in CONTRIBUTING.md

## 🧪 Running Tests

```bash
yarn test
```

## 🚢 Deployment

The easiest way to deploy Git Trends is to use the [Vercel Platform](https://vercel.com):

1. Connect your GitHub repository to Vercel
2. Configure the environment variables
3. Deploy

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgements

- [GitHub API](https://docs.github.com/en/graphql) for providing repository data
- [Next.js](https://nextjs.org/) for the application framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Prisma](https://www.prisma.io/) for database access
