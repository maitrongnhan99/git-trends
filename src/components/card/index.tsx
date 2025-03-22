import Image from "next/image";
import { FC } from "react";

interface CardProps {
  title: string;
  logoSrc: string;
  logoAlt: string;
  packageName: string;
  description: string;
  downloads: number;
  isNew?: boolean;
}

const Card: FC<CardProps> = ({
  title,
  logoSrc,
  logoAlt,
  packageName,
  description,
  downloads,
  isNew = false,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md dark:shadow-gray-900/30 w-80 flex-shrink-0 border border-gray-100 dark:border-gray-700 transition-colors">
      <div className="flex items-center mb-2">
        <div className="relative w-6 h-6 mr-2">
          <Image
            alt={logoAlt}
            className="rounded-full"
            src={logoSrc}
            fill
            sizes="24px"
          />
        </div>
        <h2 className="text-blue-600 dark:text-blue-400 font-bold">{title}</h2>
        {isNew && (
          <span className="bg-blue-500 dark:bg-blue-600 text-white text-xs rounded-full px-2 py-1 ml-2">
            New
          </span>
        )}
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
        {packageName}{" "}
        <span className="text-green-500 dark:text-green-400">•</span>
      </p>
      <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
        {description}
      </p>
      <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4 mr-1"
        >
          <path
            fillRule="evenodd"
            d="M15.22 6.268a.75.75 0 01.44.44l2.41 7.39a.75.75 0 01-.366.874l-6.5 3.25a.75.75 0 01-.67 0l-6.5-3.25a.75.75 0 01-.366-.874l2.41-7.39a.75.75 0 01.44-.44l6.5-2.166a.75.75 0 01.478 0l6.5 2.166zM13.875 12.75a.75.75 0 100-1.5.75.75 0 000 1.5z"
            clipRule="evenodd"
          />
        </svg>
        {downloads.toLocaleString()}
      </div>
    </div>
  );
};

export { Card };
