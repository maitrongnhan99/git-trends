import { Container } from "@/components/container";
import { ThemeDebug } from "@/components/theme-debug";
import { ThemeTest } from "@/components/theme-test";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Welcome to Git Trends
        </h1>
        <p className="text-lg mb-4 text-gray-500 dark:text-gray-400">
          Discover trending repositories and stay updated with the latest in the
          developer community.
        </p>
        <div className="mb-8">
          <Container
            title="Trending Repositories"
            count={10}
            link="/repositories"
          />
          <Container title="Popular MCPs" count={5} link="/mcps" />
          <Container title="New Releases" count={8} link="/releases" />
          <Container title="Top Contributors" count={12} link="/contributors" />
        </div>

        <ThemeTest />
        <ThemeDebug />
      </div>
    </main>
  );
}
