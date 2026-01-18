import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  animate?: boolean;
  delay?: number;
}

export default function Card({ children, className = '', onClick, animate = true, delay = 0 }: CardProps) {
  const baseClasses = 'glass rounded-2xl p-5 transition-all duration-300';
  const interactiveClasses = onClick ? 'cursor-pointer hover:border-genie-500/30 hover:shadow-lg hover:shadow-genie-500/10' : '';
  
  if (!animate) {
    return (
      <div className={`${baseClasses} ${interactiveClasses} ${className}`} onClick={onClick}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`${baseClasses} ${interactiveClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
