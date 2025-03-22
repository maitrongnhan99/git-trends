"use client";

import { FC, useState } from "react";
import { Button } from "../cores/button";
import { LoginModal } from "../login-modal";
import { SignupModal } from "../signup-modal";

interface SignupButtonProps {
  buttonText?: string;
}

const SignupButton: FC<SignupButtonProps> = ({ buttonText = "Sign up" }) => {
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
      <Button variant="default" onClick={openSignupModal}>
        {buttonText}
      </Button>
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
