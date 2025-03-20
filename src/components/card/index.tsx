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
    <div className="bg-gray-900 p-4 rounded-lg w-80 flex-shrink-0">
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
        <h2 className="text-orange-500 font-bold">{title}</h2>
        {isNew && (
          <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-1 ml-2">
            New
          </span>
        )}
      </div>
      <p className="text-gray-400 text-sm mb-2">
        {packageName} <span className="text-green-500">•</span>
      </p>
      <p className="text-gray-400 text-sm mb-2">{description}</p>
      <div className="flex items-center text-gray-400 text-sm">
        <i className="fas fa-chart-line mr-1"></i>
        {downloads}
      </div>
    </div>
  );
};

export { Card };
