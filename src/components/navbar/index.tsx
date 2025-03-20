"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { FC, useState } from "react";
import { twMerge } from "tailwind-merge";
import { LoginButton } from "../login-button";
import { SignupButton } from "../signup-button";
import { ThemeToggle } from "../theme-toggle";

const Navbar: FC = () => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Add background effect when scrolled
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  return (
    <motion.nav
      className={twMerge(
        "fixed top-4 left-0 right-0 max-w-7xl mx-auto z-50 rounded-full border border-gray-200 transition-all duration-300 dark:border-slate-700",
        isScrolled
          ? "bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-md"
          : "bg-white dark:bg-slate-800"
      )}
      initial={{ y: 0 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <Link href="/" className="flex">
            <div className="flex-shrink-0 flex items-center">
              <i className="fas fa-chart-bar text-2xl text-black dark:text-white"></i>
              <span className="ml-2 text-xl font-bold text-black dark:text-white">
                GitTrends
              </span>
            </div>
          </Link>
          {/* <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <Link
              href="#"
              className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Use Cases
            </Link>
            <Link
              href="#"
              className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Pricing
            </Link>
            <Link
              href="#"
              className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Company
            </Link>
            <Link
              href="#"
              className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Careers
            </Link>
          </div> */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <SignupButton />
            <LoginButton
              className="text-gray-700 bg-transparent hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-slate-300 dark:hover:bg-slate-700 dark:focus:ring-slate-800"
              textColorClass=""
            />
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export { Navbar };
