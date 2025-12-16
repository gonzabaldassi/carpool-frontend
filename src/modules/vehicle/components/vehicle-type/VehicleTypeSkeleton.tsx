'use client';

export function VehicleTypeCardSkeleton() {
  return (
    <div className="flex items-center justify-between border border-gray-2 rounded-lg p-4 shadow animate-pulse">
      
      {/* Left: imagen y texto */}
      <div className="flex items-center gap-4">
        {/* Imagen placeholder */}
        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-2 rounded-full flex-shrink-0" />

        {/* Texto placeholder */}
        <div className="flex flex-col gap-1">
          <div className="h-3 w-20 bg-gray-300 dark:bg-gray-2 rounded" />
          <div className="h-3 w-16 bg-gray-200 dark:bg-gray-2/75 rounded" />
        </div>
      </div>

      {/* Right: check selection placeholder */}
      <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full" />
    </div>
  );
}
