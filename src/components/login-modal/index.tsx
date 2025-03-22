"use client";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { FC, Fragment } from "react";
import { LoginForm } from "../login-form";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignupClick?: () => void;
}

const LoginModal: FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSignupClick,
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white dark:bg-slate-800 dark:border-slate-700 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-center mb-6">
                  <Link
                    href="/"
                    className="flex items-center text-2xl font-semibold text-gray-900 dark:text-slate-900"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Image
                      className="w-8 h-8 mr-2"
                      src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
                      alt="logo"
                      width={32}
                      height={32}
                    />
                    Git Trends
                  </Link>
                </div>

                <DialogTitle
                  as="h3"
                  className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-slate-900 mb-4"
                >
                  Sign in to your account
                </DialogTitle>

                <LoginForm onSuccess={onClose} onSignupClick={onSignupClick} />
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export { LoginModal };
