"use client";
import { deleteVehicle, getVehicles } from "@/services/vehicle/vehicleService";
import { useEffect, useState } from "react";
import { VehicleCard } from "./VehicleCard";
import { VehicleActionsModal } from "./VehicleActionsModal";
import { useRouter } from "next/navigation";
import { VehicleCardSkeleton } from "./VehicleSkeleton";
import { Vehicle } from "@/models/vehicle";
import { Alert } from "@/components/ux/Alert";
import useIsMobile from "@/shared/hooks/useIsMobile";
import { AlertDialog } from "@/components/ux/AlertDialog";

export function VehicleList() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false)

  const isMobile = useIsMobile();
  const router = useRouter();

  const fetchVehicle = async () => {
    setLoading(true)
    const result = await getVehicles();
    if (result.state === "OK" && result.data) {
      setVehicles(result.data);
    } else {
      setError(result.messages?.[0] || "Error al obtener vehículos");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVehicle();
  }, []);

  const handleDelete = async (id: number) => {
    const response = await deleteVehicle(id);
    if (response.state === "OK") {
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      setIsModalOpen(false);
    } else {
      setIsErrorDialogOpen(true);
      setDeleteError(response.messages?.[0] || "Error al eliminar el vehículo");
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/vehicle/edit/${id}`);
  };

  const handleCardClick = (vehicle: Vehicle) => {
    if (isMobile) {
      setSelectedVehicle(vehicle);
      setIsModalOpen(true);
    } else {
      router.push(`/vehicle/edit/${vehicle.id}`);
    }
  };


  return (
    <div className="space-y-4">
      {loading ? (
        Array.from({ length: Math.max(vehicles.length, 3) }).map((_, idx) => (
          <VehicleCardSkeleton key={idx} />
        ))
      ) : error ? (
        <Alert type="error" message={error} />
      ) : vehicles.length === 0 ? (
        <Alert type="info" message="Todavía no tenés vehículos registrados." />
      ) : (
        vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onClick={() => handleCardClick(vehicle)}
          />
        ))
      )}

      {selectedVehicle && (
        <VehicleActionsModal
          vehicle={selectedVehicle}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirmDelete={() => (setConfirmDialogOpen(true), setIsModalOpen(false))}
          onEdit={handleEdit}
        />
      )}

      <AlertDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={() => handleDelete(selectedVehicle!.id)}
        type="error"
        title="Confirmar eliminación"
        description="¿Estás seguro de que querés eliminar este vehículo? Esta acción no se puede deshacer."
        confirmText="Aceptar"
        cancelText="Cancelar"
      />

      {deleteError && (
        <AlertDialog
          isOpen={isErrorDialogOpen}
          onClose={() => setIsErrorDialogOpen(false)}
          type="error"
          title="Error al eliminar el vehículo"
          description={deleteError}
          confirmText="Aceptar"
          singleButton={true}
        />
      )}


    </div>
  );
}
