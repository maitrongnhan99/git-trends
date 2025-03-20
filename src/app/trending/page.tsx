import { Navbar } from "../../components/navbar";

export default function TrendingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold">Trending Repositories</h1>
          <p className="mt-3 text-xl text-gray-600 dark:text-gray-400">
            Discover popular repositories on GitHub
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-8">
            <p className="text-gray-600 dark:text-gray-400 text-center py-12">
              Connect to GitHub to see trending repositories
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
