'use client'

import { R2_PUBLIC_PREFIX } from '@/constants/imagesR2';
import { getMatchingHeaderPath, HEADER_TITLES } from '@/constants/headerPaths';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface AppHeaderProps {
  showBack?: boolean;
  rightAction?: React.ReactNode;
  variant?: string
}

export const AppHeader = ({ showBack, rightAction, variant }: AppHeaderProps) => {
  const pathname = usePathname();

  const matchingPath = getMatchingHeaderPath(pathname);
  const title = matchingPath ? HEADER_TITLES[matchingPath] : 'App';

    if (variant === "logo") {
      return (
        <header className="flex items-center justify-center h-10 bg-white dark:bg-dark-5 border-b border-gray-6 dark:border-gray-2">
          <Image
            src={`${R2_PUBLIC_PREFIX}/logo-carpool.png`}
            alt="Header"
            width={105}
            height={24}
          />
        </header>
      );
    }

  return (
    <div className="flex items-center justify-between h-10 px-4 bg-white dark:bg-dark-5 border-b border-gray-6 dark:border-gray-2">
      {showBack ? (
        <button onClick={() => history.back()} className="text-gray-700 dark:text-gray-200 cursor-pointer">
          <ChevronLeft size={16}/>
        </button>
      ) : (
        <div className="w-6" /> // espacio para alinear
      )}

      <h1 className=" font-semibold text-gray-900 dark:text-white">{title}</h1>

      <div>{rightAction}</div>
    </div>
  );
};
