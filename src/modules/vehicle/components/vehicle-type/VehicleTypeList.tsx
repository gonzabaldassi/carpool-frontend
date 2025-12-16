"use client";
import { useEffect, useState } from "react";
import { VehicleTypeCard } from "./VehicleTypeCard";
import { getVehicleTypes } from "@/services/vehicle/vehicleTypeService";
import { VehicleTypeCardSkeleton } from "./VehicleTypeSkeleton";
import { Alert } from "@/components/ux/Alert";
import { VehicleType } from "@/models/vehicleType";

interface VehicleTypeListProps {
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export function VehicleTypeList({ selectedId, onSelect }: VehicleTypeListProps) {
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true)
    const fetchVehicleType = async () => {
      const result = await getVehicleTypes();

      if (result.state === 'OK' && result.data) {
        setVehicleTypes(result.data);
      } else {
        setError(result.messages?.[0] || "Error al obtener los tipos de vehículos");
      }
      setLoading(false);
    };

    fetchVehicleType();
  }, []);


  return (
    <div className="space-y-4">
        {loading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <VehicleTypeCardSkeleton key={idx} />
            ))
          : vehicleTypes.map((vehicleType) => (
              <VehicleTypeCard
                key={vehicleType.id}
                vehicleType={vehicleType}
                selected={selectedId === vehicleType.id}
                onSelect={onSelect}
              />
            ))}
        {error && (
          <div className="mb-4">
            <Alert type="error" message={error} />
          </div>
        )}
      </div>
  );
}