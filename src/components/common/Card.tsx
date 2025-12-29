import { ReactNode } from "react";

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="border bg-background rounded-xl">
      {children}
    </div>
  );
}

export function CardContent({ children }: { children: ReactNode }) {
  return <div className="p-4">{children}</div>;
}
