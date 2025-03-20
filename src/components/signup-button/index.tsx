"use client";

import { FC, useState } from "react";
import { LoginModal } from "../login-modal";
import { SignupModal } from "../signup-modal";

interface SignupButtonProps {
  className?: string;
  buttonText?: string;
}

const SignupButton: FC<SignupButtonProps> = ({
  className = "text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-slate-600 dark:hover:bg-slate-700 dark:focus:ring-slate-800",
  buttonText = "Sign up",
}) => {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openSignupModal = () => {
    setIsSignupModalOpen(true);
    setIsLoginModalOpen(false);
  };

  const closeSignupModal = () => setIsSignupModalOpen(false);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsSignupModalOpen(false);
  };

  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <>
      <button onClick={openSignupModal} className={className}>
        {buttonText}
      </button>
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={closeSignupModal}
        onLoginClick={openLoginModal}
      />
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </>
  );
};

export { SignupButton };
