import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
}) {
  return (
    <button
      {...props}
      className={clsx(
        "px-4 py-2 rounded-lg text-sm font-medium transition",
        variant === "primary" &&
          "bg-primary text-white hover:bg-primary/90",
        variant === "ghost" &&
          "bg-transparent hover:bg-muted",
        variant === "danger" &&
          "bg-red-500 text-white hover:bg-red-600",
        className
      )}
    />
  );
}
