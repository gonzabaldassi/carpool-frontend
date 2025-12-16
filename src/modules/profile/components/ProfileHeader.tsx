import { R2_PUBLIC_PREFIX } from '@/constants/imagesR2';
import { useAuth } from '@/contexts/authContext';
import Image from 'next/image';


export function ProfileHeader() {
  const { user, prevImage } = useAuth();

  const imageToShow = prevImage || user?.profileImage;

  return (
    <div className="flex flex-col items-center gap-2">
      {imageToShow ? (
        <Image
          src={imageToShow}
          alt="Foto de perfil"
          width={96}
          height={96}
          className="rounded-full object-cover"
        />
      ) : (
        <Image
          src={`${R2_PUBLIC_PREFIX}/default-profile.png`}
          alt="Foto de perfil"
          width={96}
          height={96}
          className="rounded-full object-cover"
        />
      )}
      <h2 className="text-xl font-semibold text-gray-2 dark:text-gray-1">{user?.username}</h2>
    </div>
  );
}
