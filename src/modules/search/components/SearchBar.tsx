'use client';

import { Calendar1, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CitySearch from "./CitySearch";

export default function SearchBar() {
  const [originCity, setOriginCity] = useState<number | null>(null);
  const [destinationCity, setDestinationCity] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [error, setError] = useState<string>(""); 
  const router = useRouter();

  const handleSearch = () => {
    if (!originCity || !destinationCity) {
      setError("Debes seleccionar origen y destino.");
      return;
    }

    setError(""); // limpiar error si todo bien
    const queryParams = new URLSearchParams();

    queryParams.append("origin", originCity.toString());
    queryParams.append("destination", destinationCity.toString());

    if (selectedDate) {
      const departureDate = selectedDate.toISOString().slice(0, 10);
      queryParams.append("departureDate", departureDate);
    }

    router.push(`/search/results?${queryParams.toString()}`);
  };

  return (
    <div className="shadow-lg w-full flex flex-col gap-2">
      <div className="flex items-center gap-4 md:mt-4">
        {/* Origen y destino */}
        <CitySearch 
          originCity={originCity}
          destinationCity={destinationCity}
          setOriginCity={setOriginCity}
          setDestinationCity={setDestinationCity}
        />

        {/* Botones */}
        <div className="flex flex-col gap-2 ">
          <button
            onClick={handleSearch}
            className={`bg-gray-2 hover:bg-gray-2 transition p-2 rounded-full ${!originCity || !destinationCity ? "opacity-50 " : ""}`}
            disabled={!originCity || !destinationCity} // <- botón deshabilitado
          >
            <Search size={16} />
          </button>

          {/* Dialog calendario */}
          <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <DialogTrigger asChild>
              <button 
                className={`bg-gray-2 p-2 rounded-full ${selectedDate && 'border border-gray-9'}`}
                onClick={() => setIsCalendarOpen(true)}
              >
                <Calendar1 size={16} />
              </button>
            </DialogTrigger>

            <DialogContent className="w-full max-w-sm sm:max-w-md md:max-w-md flex flex-col items-center gap-6">
              <DialogHeader>
                <DialogTitle>¿Cuándo vas a viajar?</DialogTitle>
              </DialogHeader>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setIsCalendarOpen(false);
                }}
                className="rounded-md border w-72 h-[320px]"
                classNames={{
                  selected: "",
                  today: "ring-1 ring-gray-5 rounded-lg",
                  outside: "text-muted-foreground",
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Mensaje de error */}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
