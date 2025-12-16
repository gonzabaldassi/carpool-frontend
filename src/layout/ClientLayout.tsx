'use client'
import { useEffect, useState } from 'react';
import DesktopLayout from './DesktopLayout';
import MobileLayout from './MobileLayout';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768); // ejemplo: md breakpoint
    };

    handleResize(); // check initial size

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <TooltipProvider>
      {isDesktop ? (
        <DesktopLayout>{children}</DesktopLayout>
      ) : (
        <MobileLayout>{children}</MobileLayout>
      )}
    </TooltipProvider>
}
