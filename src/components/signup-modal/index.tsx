"use client";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick?: () => void;
}

const SignupModal: FC<SignupModalProps> = ({
  isOpen,
  onClose,
  onLoginClick,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { theme } = useTheme();

  console.log("theme", theme);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to sign up");
      }

      // Reset form and close modal on success
      reset();
      onClose();
      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Signup failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginClick = () => {
    onClose();
    if (onLoginClick) {
      onLoginClick();
    }
  };

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
          <div className="fixed inset-0 bg-black/25" />
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
                  Create an account
                </DialogTitle>

                {error && (
                  <div className="p-3 mb-4 text-sm text-red-500 bg-red-100 border border-red-200 rounded-md dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                    {error}
                  </div>
                )}

                <form
                  className="space-y-4 md:space-y-6"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-slate-900"
                    >
                      Your name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className={`bg-gray-50 border ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      } text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-100 dark:border-slate-600 dark:placeholder-slate-500 dark:text-slate-900 dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                      placeholder="John Doe"
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-slate-900"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className={`bg-gray-50 border ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      } text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-500 dark:text-slate-900 dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                      placeholder="name@company.com"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-slate-900"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      placeholder="••••••••"
                      className={`bg-gray-50 border ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      } text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-500 dark:text-slate-900 dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                      {...register("password")}
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-slate-900"
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      placeholder="••••••••"
                      className={`bg-gray-50 border ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      } text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-500 dark:text-slate-900 dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                      {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-slate-600 dark:hover:bg-slate-700 dark:focus:ring-slate-800 dark:text-slate-900 disabled:opacity-70"
                  >
                    {isLoading ? "Creating account..." : "Create account"}
                  </button>

                  <p className="text-sm font-light text-gray-500 dark:text-slate-500">
                    Already have an account?{" "}
                    <button
                      type="button"
                      className="font-medium text-primary-600 hover:underline dark:text-slate-900 bg-transparent"
                      onClick={handleLoginClick}
                    >
                      Sign in
                    </button>
                  </p>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export { SignupModal };
