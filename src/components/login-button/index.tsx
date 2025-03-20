"use client";

import { FC, useState } from "react";
import { LoginModal } from "../login-modal";
import { SignupModal } from "../signup-modal";

interface LoginButtonProps {
  className?: string;
  buttonText?: string;
  textColorClass?: string;
}

const LoginButton: FC<LoginButtonProps> = ({
  className = "text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800",
  buttonText = "Sign in",
  textColorClass = "text-white dark:text-gray-100",
}) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsSignupModalOpen(false);
  };

  const closeLoginModal = () => setIsLoginModalOpen(false);

  const openSignupModal = () => {
    setIsSignupModalOpen(true);
    setIsLoginModalOpen(false);
  };

  const closeSignupModal = () => setIsSignupModalOpen(false);

  return (
    <>
      <button
        type="button"
        onClick={openLoginModal}
        className={`${className} ${textColorClass}`}
      >
        {buttonText}
      </button>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onSignupClick={openSignupModal}
      />
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={closeSignupModal}
        onLoginClick={openLoginModal}
      />
    </>
  );
};

export { LoginButton };
