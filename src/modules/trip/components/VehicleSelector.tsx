import { useUserVehicles } from "@/modules/vehicle/hooks/useUserVehicles";
import { Vehicle } from "@/models/vehicle";
import { VehicleCardSkeleton } from "@/modules/vehicle/components/VehicleSkeleton";
import { VehicleCard } from "@/modules/vehicle/components/VehicleCard";

export function VehicleSelector({ 
  selectedVehicle, 
  onSelect 
}: { 
  selectedVehicle?: Vehicle, 
  onSelect: (v: Vehicle) => void 
}) {
  const { vehicles, loading, error } = useUserVehicles();

  if (error) return <p>{error}</p>;

  return (
    <div className="space-y-2">
      {loading ? (
        Array.from({ length: Math.max(vehicles.length, 3) }).map((_, idx) => (
          <VehicleCardSkeleton key={idx} />
        ))
      ) : (
        vehicles.map(v => (
          <div 
            key={v.id} 
            className={`rounded-lg transition-all ${
              selectedVehicle?.id === v.id 
                ? "ring-2 ring-blue-500" 
                : ""
            }`}
          >
            <VehicleCard 
              vehicle={v} 
              onClick={() => onSelect(v)} 
            />
          </div>
        ))
      )}
    </div>
  );
}
