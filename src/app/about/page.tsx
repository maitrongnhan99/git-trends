import { Navbar } from "../../components/navbar";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold">About GitTrends</h1>
          <p className="mt-3 text-xl text-gray-600 dark:text-gray-400">
            Learn more about our GitHub repository analytics platform
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-semibold mb-6">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
              GitTrends is a comprehensive GitHub repository analytics dashboard
              designed to help developers, teams, and organizations track and
              analyze their GitHub repositories with ease.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
              Our platform provides valuable insights into repository
              performance, including stars, forks, commits, and more, allowing
              users to make data-driven decisions about their projects.
            </p>

            <h2 className="text-2xl font-semibold mb-6 mt-12">Key Features</h2>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-3 text-lg">
              <li>Real-time repository analytics</li>
              <li>Trending repositories discovery</li>
              <li>Favorite repositories tracking</li>
              <li>Customizable dashboard</li>
              <li>Dark mode support</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-6 mt-12">
              Technology Stack
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
              GitTrends is built with modern technologies to ensure a fast,
              responsive, and reliable experience:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-3 text-lg">
              <li>Next.js for the frontend</li>
              <li>Tailwind CSS for styling</li>
              <li>GitHub API for repository data</li>
              <li>PostgreSQL for data storage</li>
              <li>Prisma for database access</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
