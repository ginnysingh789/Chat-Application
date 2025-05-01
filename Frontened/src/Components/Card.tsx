import { ReactNode } from "react";

// Include className as an optional prop in cardProps
type cardProps = {
  children: ReactNode | string;
  className?: string;  // Allow className as an optional prop
}

export const Card = ({ children, className }: cardProps) => {
  return (
    <div className={`bg-white rounded-xl shadow-md p-4 ${className}`}>
      {/* Header */}
      {children}
    </div>
  );
};
