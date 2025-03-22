"use client";

import { LoginButton } from "@/components/login-button";
import { Logo } from "@/components/logo";
import { ProfileButton } from "@/components/profile-button";
import { SignupButton } from "@/components/signup-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/utils/auth-context";
import { motion } from "framer-motion";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface NavbarProps {
  className?: string;
}

const Navbar: FC<NavbarProps> = ({ className }) => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setHasScrolled(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <motion.header
      className={twMerge(
        "sticky top-0 z-50 w-full transition-colors",
        hasScrolled
          ? "border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          : "bg-transparent",
        className
      )}
    >
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center space-x-2 hover:opacity-90"
          >
            <Logo className="h-6 w-6" />
            <span className="font-bold">GitTrends</span>
          </Link>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <ProfileButton />
            ) : (
              <>
                <LoginButton />
                <SignupButton />
              </>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export { Navbar };
