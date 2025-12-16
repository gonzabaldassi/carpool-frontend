import { R2_PUBLIC_PREFIX } from "@/constants/imagesR2";
import { VehicleType } from "@/models/vehicleType";
import Image from "next/image";


interface VehicleTypeCardProps {
  vehicleType: VehicleType;
  selected: boolean;
  onSelect: (id: number) => void;
}

export function VehicleTypeCard({ vehicleType, selected, onSelect }: VehicleTypeCardProps) {
  return (
    <div
      onClick={() => onSelect(vehicleType.id)}
      className={`flex items-center justify-between border rounded-lg p-4 shadow cursor-pointer transition-all
        ${selected ? "border-primary shadow-md" : "border-gray-2 hover:shadow-md hover:dark:bg-gray-2"}`}
    >
      <div className="flex items-center gap-4">
        
        <div className="w-10 h-10 relative flex-shrink-0">
          <Image
            src={`${R2_PUBLIC_PREFIX}/${vehicleType.name.toLowerCase()}.png`}
            alt="Vehicle logo"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
        
        <div>
          <p className="font-medium leading-none">{vehicleType.name}</p>
          <p className="font-light font-inter text-xs text-dark-2 dark:text-gray-1/75">{vehicleType.description}</p>
        </div>
      </div>
      {selected && <div className="rounded-full shadow-md bg-primary p-1"/>}
    </div>
  );
}
