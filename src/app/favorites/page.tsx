"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { FC } from "react";

const FavoritesPage: FC = () => {
  return (
    <ProtectedRoute>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold">Favorite Repositories</h1>
          <p className="mt-3 text-xl text-gray-600 dark:text-gray-400">
            Your saved GitHub repositories
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-8">
            <p className="text-gray-600 dark:text-gray-400 text-center py-12">
              You haven&apos;t added any favorites yet.
            </p>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
};

export default FavoritesPage;
