'use client'

import { Circle, Square } from "lucide-react"; 
import Separator from "@/components/ux/Separator";
import { useState } from "react";
import { CityAutocomplete } from "@/modules/city/components/CityAutocomplete";

interface CitySearchProps {
  originCity: number | null;
  destinationCity: number | null;
  setOriginCity: (id: number | null) => void;
  setDestinationCity: (id: number | null) => void;
}

export default function CitySearch({
  originCity,
  destinationCity,
  setOriginCity,
  setDestinationCity,
}: CitySearchProps) {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
    <div
      className={`border w-full rounded-2xl flex items-center gap-2 px-3 transition-all duration-200 ${
        isFocused
          ? "border-gray-6 shadow shadow-gray-2"
          : "border-gray-2"
      }`}
    >
      <div className="flex flex-col items-center text-gray-11">
        <Circle size={8} fill="currentColor" stroke="currentColor" />
        <div className="w-0.5 h-4 bg-gray-5 my-1"></div>
        <Square size={8} fill="currentColor" stroke="currentColor" />
      </div>
      <div className="rounded-2xl w-full flex items-center">
        <div className="w-full h-full">
          <CityAutocomplete
            placeholder="Localidad origen"
            value={originCity}
            onChange={(city) => setOriginCity(city?.id ?? null)}
            excludeIds={[Number(destinationCity)]}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <div className="px-2">
            <Separator color="bg-gray-2" marginY="my-0" />
          </div>
          
          <CityAutocomplete
            placeholder="¿Hacia donde?"
            value={destinationCity}
            onChange={(city) => setDestinationCity(city?.id ?? null)}
            excludeIds={[Number(originCity)]}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
        
        
      </div>
    </div>
  );
}
