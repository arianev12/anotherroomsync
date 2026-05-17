import { ReactNode } from "react";

interface GlassmorphismCardProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}

export function GlassmorphismCard({ 
  children, 
  className = "", 
  padding = true 
}: GlassmorphismCardProps) {
  return (
    <div
      className={`
        relative 
        bg-white
        dark:bg-[#1E2939] 
        rounded-[40px] 
        border border-gray-200 dark:border-gray-700 
        shadow-[0_20px_40px_rgba(0,0,0,0.1)] 
        dark:shadow-[0_20px_40px_rgba(0,0,0,0.3)]
        ${padding ? 'p-6 md:p-8 lg:p-10' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}