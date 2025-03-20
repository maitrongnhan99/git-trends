import Link from "next/link";
import { FC } from "react";
import { Card } from "../card";

interface ContainerProps {
  title: string;
  count: number;
  link: string;
}

const Container: FC<ContainerProps> = ({ title, count, link }) => {
  return (
    <div className="container mx-auto py-8 ">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-black dark:text-slate-800">
            {title}
          </h1>
          <span className="bg-gray-700 text-gray-300 text-sm rounded-full px-2 py-1">
            {count}
          </span>
        </div>
        <Link href={link} className="text-gray-800 text-sm dark:text-slate-700">
          View all
        </Link>
      </div>
      <div className="flex space-x-4 overflow-x-auto">
        <Card
          title="TypeScript Definitor"
          logoSrc="https://storage.googleapis.com/a1aa/image/cpqREtmRC1O8g3osVEEmMsG5_PXMe_2axOe0WEpAOYQ.jpg"
          logoAlt="TypeScript Definitor logo"
          packageName="@runninghare/ts-def-mcp"
          description="Locate the original definitions of TypeScript symbols in your codebase. Enhance your AI code editor's capabilities by seamlessly..."
          downloads={3}
          isNew={true}
        />
        <Card
          title="Sequential Thinking"
          logoSrc="https://storage.googleapis.com/a1aa/image/cM9H0QZgGqnlLFb9ZHPXz9FHXy28wl7Udgw6w1dYRhQ.jpg"
          logoAlt="Sequential Thinking logo"
          packageName="@smithery-ai/server-sequential-thinking"
          description="An MCP server implementation that provides a tool for dynamic and reflective problem-solving through a structured thinking process."
          downloads={222010}
        />
        <Card
          title="Github"
          logoSrc="https://storage.googleapis.com/a1aa/image/AZ2L0nPde6Rsrq2MTRpmd6qcSgiG2QsPFvCdFmTPEpo.jpg"
          logoAlt="Github logo"
          packageName="@smithery-ai/github"
          description="Access the GitHub API, enabling file operations, repository management, search functionality, and more."
          downloads={57350}
        />
        <Card
          title="Magic MCP"
          logoSrc="https://storage.googleapis.com/a1aa/image/_xrj614B8o5ilqhzGrhbbVXpdgaAAqolxaWCa9TDQo0.jpg"
          logoAlt="Magic MCP logo"
          packageName="@21st-dev/magic-mcp"
          description="v0 for MCP. Frontend feels like Magic"
          downloads={12160}
        />
        <Card
          title="Brave Search"
          logoSrc="https://storage.googleapis.com/a1aa/image/4PvEdqIYE0uHva9AMfPp1gRa9tvi5I92bV2KT8YUi6w.jpg"
          logoAlt="Brave Search logo"
          packageName="@smithery-ai/brave-search"
          description="Integrate web and local search capabilities."
          downloads={17470}
        />
      </div>
    </div>
  );
};

export { Container };
