import { Bell, ChevronRight, Lock, ShieldHalf, UserRoundCog } from "lucide-react";
import Link from "next/link";


export function SettingsOptions() {
    const linkClasses = `
        flex items-center justify-between gap-2 px-4 py-3
        rounded-lg transition-colors duration-200
        hover:bg-gray-1 dark:hover:bg-gray-2
        text-sm font-regular text-gray-700 dark:text-gray-200
    `;
    return(
        <div className="flex flex-col gap-3 shadow-md">
        {/* Bloque 1: Personal */}
        <div>
            <p className='px-6 text-sm mb-0.5 text-white/75'>Configuraciones</p>
            <div className="flex flex-col gap-1 p-2 bg-white dark:bg-gray-2/50 rounded-xl">
                <Link href="/settings/account" className={linkClasses}>
                    <div className="flex items-center gap-2">   
                    <UserRoundCog size={18}/>
                    <span>Cuenta</span>
                    </div>
                    
                    <ChevronRight size={18} />
                </Link>

                <Link href="/settings/security" className={linkClasses}>
                    <div className="flex items-center gap-2">   
                    <Lock size={18}/>
                    <span>Seguridad</span>
                    </div>
                    
                    <ChevronRight size={18} />
                </Link>

                <Link href="/settings" className={linkClasses}>
                    <div className="flex items-center gap-2">   
                    <Bell size={18}/>
                    <span>Notificaciones</span>
                    </div>
                    
                    <ChevronRight size={18} />
                </Link>

                <Link href="/settings" className={linkClasses}>
                    <div className="flex items-center gap-2">   
                    <ShieldHalf size={18}/>
                    <span>Privacidad</span>
                    </div>
                    
                    <ChevronRight size={18} />
                </Link>
            </div>

            
        </div>
    </div>
  );
}
