'use client';

import { Alert } from '@/components/ux/Alert';
import { useAuth } from '@/contexts/authContext';
import { ProfileOptions } from '@/modules/profile/components/ProfileOptions';
import { RoleSwithcer } from '@/modules/profile/components/RoleSwitcher';

import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, logout, profileViewRole, setProfileViewRole } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const isDriver = user.roles?.includes('driver');

  const handleRegisterAsDriver = () => {
    router.push('/register-driver');
  };

  return (
    <>
      <RoleSwithcer role={profileViewRole} onChange={setProfileViewRole} />

      {profileViewRole === 'conductor' && !isDriver ? (
        <div className="mt-6 space-y-3">
          <Alert type="info" message="Aún no estás registrado como conductor.">
            <button
              onClick={handleRegisterAsDriver}
              className="mt-2 text-sm text-blue-600 hover:underline cursor-pointer"
            >
              Registrarme como conductor
            </button>
          </Alert>
        </div>
      ) : (
        <ProfileOptions
          role={profileViewRole === 'conductor' ? 'driver' : 'passenger'}
          logout={logout}
        />
      )}
    </>
  );
}