type Role = 'pasajero' | 'conductor';

export function RoleSwithcer({ role, onChange }: { role: Role; onChange: (r: Role) => void }) {
  return (
    <div className="flex justify-center my-4">
      <div className="relative flex border border-gray-300 rounded-full w-52 bg-gray-100">
        {/* fondo deslizante */}
        <div
          className={`
            absolute top-0 left-0 w-1/2 h-full bg-primary-dark rounded-full transition-transform duration-300 ease-in-out
            ${role === 'conductor' ? 'translate-x-full' : 'translate-x-0'}
          `}
        />
        {/* botones */}
        <button
          onClick={() => onChange('pasajero')}
          className={`w-1/2 z-10 py-2 rounded-l-full text-sm font-medium transition-colors duration-300 cursor-pointer
            ${ role === 'pasajero' ? 'text-white' : 'text-gray-2/80'}`}
        >
          Pasajero
        </button>
        <button
          onClick={() => onChange('conductor')}
          className={`w-1/2 z-10 py-2 rounded-r-full text-sm font-medium transition-colors duration-300 cursor-pointer
            ${role === 'conductor' ? 'text-white' : 'text-gray-2/80'}`}
        >
          Conductor
        </button>
      </div>
    </div>
  );
}
