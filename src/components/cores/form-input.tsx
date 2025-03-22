"use client";

import {
  Controller,
  FieldPath,
  FieldValues,
  Path,
  RegisterOptions,
  useFormContext,
} from "react-hook-form";
import { When } from "react-if";
import { twMerge } from "tailwind-merge";
import { Input, InputProps } from "./input";

interface FormInputProps<T extends FieldValues>
  extends Omit<InputProps, "name" | "error"> {
  name: Path<T>;
  rules?: Omit<
    RegisterOptions<T, FieldPath<T>>,
    "valueAsNumber" | "valueAsDate" | "setValueAs"
  >;
  label?: string;
  labelClassName?: string;
  errorClassName?: string;
}

const FormInput = <T extends FieldValues>({
  name,
  rules,
  label,
  labelClassName,
  errorClassName,
  className,
  ...props
}: FormInputProps<T>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  const errorMessage = errors[name as FieldPath<T>]?.message as
    | string
    | undefined;
  const hasError = !!errorMessage;

  return (
    <div className={twMerge("w-full mb-4", className)}>
      <When condition={!!label}>
        <label
          htmlFor={props.id || name.toString()}
          className={twMerge(
            "block mb-2 text-sm font-medium text-gray-900 dark:text-slate-900",
            labelClassName
          )}
        >
          {label}
        </label>
      </When>

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <Input
            {...field}
            {...props}
            id={props.id || name.toString()}
            error={hasError}
            value={field.value ?? ""}
          />
        )}
      />

      <When condition={hasError}>
        <p
          className={twMerge(
            "mt-1 text-sm text-red-500 dark:text-red-400",
            errorClassName
          )}
        >
          {errorMessage}
        </p>
      </When>
    </div>
  );
};

export { FormInput };
