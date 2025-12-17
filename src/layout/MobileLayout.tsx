'use client';

import {  HEADER_PATHS } from '@/constants/headerPaths';
import { AppHeader } from '@/widgets/AppHeader';
import MobileNavbar from '@/widgets/mobile/MobileNavbar';
import { usePathname } from 'next/navigation';

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const showHeader = HEADER_PATHS.some(route => pathname.startsWith(route));

  const logoHeaderPaths = ["/home","/search"];
  const isLogoHeader = logoHeaderPaths.some(route => pathname.startsWith(route));
  
  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden">
      {showHeader && (
        <AppHeader showBack={!isLogoHeader} variant={isLogoHeader ? "logo" : "default"} />
      )}
      <main className="flex-1 overflow-y-auto px-8 pt-4 pb-[80px]">
        {children}
      </main>
      <MobileNavbar />
    </div>

  );
}
