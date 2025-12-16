'use client';

export function DriverFormSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full animate-pulse">
      
      {/* Clase de licencia */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <div className="h-3 w-32 bg-gray-300 dark:bg-gray-2 rounded" />
          <div className="h-10 bg-gray-300 dark:bg-gray-2 rounded" />
        </div>

        {/* Vencimiento */}
        <div className="flex flex-col gap-1">
          <div className="h-3 w-24 bg-gray-300 dark:bg-gray-2 rounded" />
          <div className="h-10 bg-gray-300 dark:bg-gray-2 rounded" />
        </div>

        {/* Localidad */}
        <div className="flex flex-col gap-1 md:col-span-2">
          <div className="h-3 w-28 bg-gray-300 dark:bg-gray-2 rounded" />
          <div className="h-10 bg-gray-300 dark:bg-gray-2 rounded" />
        </div>

        {/* Dirección */}
        <div className="flex flex-col gap-1">
          <div className="h-3 w-24 bg-gray-300 dark:bg-gray-2 rounded" />
          <div className="h-10 bg-gray-300 dark:bg-gray-2 rounded" />
        </div>

        {/* Número */}
        <div className="flex flex-col gap-1">
          <div className="h-3 w-20 bg-gray-300 dark:bg-gray-2 rounded" />
          <div className="h-10 bg-gray-300 dark:bg-gray-2 rounded" />
        </div>
      </div>

      {/* Botón */}
      <div className="h-10 w-full bg-gray-300 dark:bg-gray-2 rounded" />
    </div>
  );
}
