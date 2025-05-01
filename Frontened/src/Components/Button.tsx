import React, { ReactNode } from "react";
import { ChevronRight } from 'lucide-react';

interface ButtonProp {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  icon?: ReactNode;
  className?: string;
}

export const Button = (props: ButtonProp) => {
  const { label, onClick, variant = "primary", icon, className = "" } = props;

  // Base styles that apply to all buttons
  const baseStyles = "px-6 py-2 rounded-xl font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-300 cursor-pointer flex items-center justify-between";

  // Variant-specific styles
  const variantStyles = {
    primary: "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white focus:ring-violet-400",
    secondary: "bg-white/10 hover:bg-white/15 backdrop-blur-sm text-white border border-white/20 focus:ring-white/30"
  };

  return (
    <button 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`} 
      onClick={onClick}
    >
      <div className="flex items-center">
        {icon && <span className="mr-3">{icon}</span>}
        <span>{label}</span>
      </div>
      <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
    </button>
  );
};