"use client";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export default function Button({ children, onClick, type = "button" }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="mt-2 p-3 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg text-white font-semibold hover:opacity-90 transition"
    >
      {children}
    </button>
  );
}
