import { ReactNode } from 'react';
import { cn } from '../lib/utils';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  isFullWidth?: boolean;
}

export default function PageContainer({ children, className, isFullWidth = false }: PageContainerProps) {
  return (
    <div className={cn(
      "w-full mx-auto px-4 md:px-8",
      !isFullWidth && "max-w-7xl",
      className
    )}>
      {children}
    </div>
  );
}
