'use client';

export function TripDetailSkeleton() {
  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto h-screen animate-pulse">
      <div className="w-full">
        <div className="h-6 w-40 bg-gray-300 dark:bg-gray-2 rounded mx-auto" />
        <div className="h-1 w-full bg-gray-200 dark:bg-gray-5/75 rounded mt-2" />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(9, 1fr)",
          gridTemplateRows: "repeat(11, 1fr)",
          gap: "8px",
        }}
        className="w-full h-full mt-4"
      >
        {/* Disponibilidad */}
        <div className="bg-gray-6 dark:bg-gray-8 flex flex-col rounded-xl p-3 col-span-5 row-span-2">
          <div className="h-4 w-24 bg-gray-300 dark:bg-gray-2 rounded mb-3" />
          <div className="flex-grow flex items-center justify-center">
            <div className="h-8 w-16 bg-gray-200 dark:bg-gray-5/75 rounded" />
          </div>
        </div>

        {/* Precio */}
        <div className="bg-gray-6 dark:bg-gray-8 flex flex-col rounded-xl p-3 col-span-4 row-span-2">
          <div className="h-4 w-16 bg-gray-300 dark:bg-gray-2 rounded mb-3" />
          <div className="flex-grow flex items-center justify-center">
            <div className="h-8 w-20 bg-gray-200 dark:bg-gray-5/75 rounded" />
          </div>
        </div>

        {/* Recorrido */}
        <div className="bg-gray-6 dark:bg-gray-8 flex flex-col rounded-xl p-3 col-span-9 row-span-4">
          <div className="h-4 w-28 bg-gray-300 dark:bg-gray-2 rounded mb-3" />
          <div className="flex flex-col gap-2 ml-2">
            <div className="h-3 w-40 bg-gray-200 dark:bg-gray-5/75 rounded" />
            <div className="h-3 w-32 bg-gray-200 dark:bg-gray-5/75 rounded" />
            <div className="h-3 w-28 bg-gray-200 dark:bg-gray-5/75 rounded" />
          </div>
        </div>

        {/* Datos del conductor */}
        <div className="bg-gray-6 dark:bg-gray-8 flex flex-col rounded-xl p-3 col-span-9 row-span-2">
          <div className="h-4 w-36 bg-gray-300 dark:bg-gray-2 rounded mb-3" />
          <div className="flex gap-4 items-center">
            <div className="w-14 h-14 bg-gray-300 dark:bg-gray-2 rounded-full" />
            <div className="flex flex-col gap-2">
              <div className="h-3 w-28 bg-gray-200 dark:bg-gray-5/75 rounded" />
              <div className="flex gap-2 items-center">
                <div className="h-3 w-8 bg-gray-200 dark:bg-gray-5/75 rounded" />
                <div className="h-3 w-20 bg-gray-200 dark:bg-gray-5/75 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Datos del vehículo */}
        <div className="bg-gray-6 dark:bg-gray-8 flex flex-col rounded-xl p-3 col-span-6 row-span-2">
          <div className="h-4 w-32 bg-gray-300 dark:bg-gray-2 rounded mb-3" />
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-300 dark:bg-gray-2 rounded" />
            <div className="flex flex-col gap-2">
              <div className="h-3 w-28 bg-gray-200 dark:bg-gray-5/75 rounded" />
              <div className="h-3 w-20 bg-gray-200 dark:bg-gray-5/75 rounded" />
              <div className="h-3 w-24 bg-gray-200 dark:bg-gray-5/75 rounded" />
            </div>
          </div>
        </div>

        {/* Equipaje */}
        <div className="bg-gray-6 dark:bg-gray-8 flex flex-col items-center rounded-xl p-3 col-span-3 row-span-2">
          <div className="h-4 w-20 bg-gray-300 dark:bg-gray-2 rounded mb-3" />
          <div className="w-10 h-10 bg-gray-300 dark:bg-gray-2 rounded-lg mb-2" />
          <div className="h-3 w-16 bg-gray-200 dark:bg-gray-5/75 rounded" />
        </div>

        {/* Botón Reservar */}
        <div className="flex justify-center items-center col-span-9 row-span-1">
          <div className="h-10 w-40 bg-gray-300 dark:bg-gray-2 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
