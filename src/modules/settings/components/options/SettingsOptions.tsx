'use client'
import { useNotifications } from "@/shared/hooks/useNotifications";
import { Bell, ChevronRight, Lock, ShieldHalf, UserRoundCog } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function SettingsOptions() {
  const { registerNotifications, disableNotifications,hasActiveTokens, isLoading } = useNotifications();
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    hasActiveTokens().then(setIsEnabled);
  }, []);

  const handleToggle = async () => {
    if (isLoading) return;
    if (isEnabled) {
      await disableNotifications();
      setIsEnabled(false);
    } else {
      await registerNotifications();
      setIsEnabled(true);
    }
  };

  const linkClasses = `
    flex items-center justify-between gap-2 px-4 py-3
    rounded-lg transition-colors duration-200
    hover:bg-gray-1 dark:hover:bg-gray-2
    text-sm font-regular text-gray-700 dark:text-gray-200
    cursor-pointer
  `;

  return (
    <div className="flex flex-col gap-3 shadow-md">
      <div>
        <p className='px-6 text-sm mb-0.5 text-white/75'>Configuraciones</p>
        <div className="flex flex-col gap-1 p-2 bg-white dark:bg-gray-2/50 rounded-xl">

          <Link href="/settings/account" className={linkClasses}>
            <div className="flex items-center gap-2">
              <UserRoundCog size={18} />
              <span>Cuenta</span>
            </div>
            <ChevronRight size={18} />
          </Link>

          <Link href="/settings/security" className={linkClasses}>
            <div className="flex items-center gap-2">
              <Lock size={18} />
              <span>Seguridad</span>
            </div>
            <ChevronRight size={18} />
          </Link>

          <div className={linkClasses}>
            <div className="flex items-center gap-2">
              <Bell size={18} />
              <span>Notificaciones push</span>
            </div>
            <button
              role="switch"
              aria-checked={isEnabled}
              aria-label="Activar o desactivar notificaciones push"
              disabled={isLoading}
              onClick={handleToggle}
              className={`
                relative inline-flex h-6 w-11 shrink-0 items-center rounded-full
                transition-colors duration-200 focus:outline-none
                disabled:opacity-40 disabled:cursor-not-allowed
                ${isEnabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 rounded-full bg-white shadow
                  transform transition-transform duration-200
                  ${isEnabled ? 'translate-x-6' : 'translate-x-1'}
                  ${isLoading ? 'animate-pulse' : ''}
                `}
              />
            </button>
          </div>

          <Link href="/settings" className={linkClasses}>
            <div className="flex items-center gap-2">
              <ShieldHalf size={18} />
              <span>Privacidad</span>
            </div>
            <ChevronRight size={18} />
          </Link>

        </div>
      </div>
    </div>
  );
}