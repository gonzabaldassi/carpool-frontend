'use client';

import { ProfileHeader } from "@/modules/profile/components/ProfileHeader";


export default function ProfileLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="max-w-md mx-auto">
      <div className=' md:py-8'>
        <ProfileHeader />
        <div className="mt-6">{children}</div>
      </div>
      
    </div>
  );
}
