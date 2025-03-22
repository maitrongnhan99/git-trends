"use client";

import { FC, InputHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  fullWidth?: boolean;
  error?: boolean;
}

const Input: FC<InputProps> = forwardRef<HTMLInputElement, InputProps>(
  ({ className, fullWidth = true, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={twMerge(
          "bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block p-2.5",
          "dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-500 dark:text-slate-900 dark:focus:ring-blue-500 dark:focus:border-blue-500",
          "focus:ring-0 focus:outline-0",
          error ? "border-red-500" : "",
          fullWidth ? "w-full" : "",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
