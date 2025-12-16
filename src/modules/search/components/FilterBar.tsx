"use client";

import { useState } from "react";
import { Star, DollarSign, Calendar1, BrushCleaning } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/Input";
import { parseLocalDate } from "@/shared/utils/date";

function formatShortDate(date: Date) {
  return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short" })
    .format(date)
    .replace(".", "")
    .replace(" ", "-");
}

interface FilterBarProps {
  selectedDate?: string; // fecha seleccionada en formato ISO (yyyy-mm-dd)
  onDateChange?: (date: Date | undefined) => void;

  minPrice?: number;
  maxPrice?: number;
  maxSeatPrice: number
  onMinPriceChange?: (value: number) => void;
  onMaxPriceChange?: (value: number) => void;

  sortByRating?: boolean; // toggle para ordenar por puntuación descendente
  setSortByRating?: (active: boolean) => void;
  onClearFilters?: () => void;
}

export default function FilterBar({
  selectedDate,
  onDateChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  sortByRating = false,
  setSortByRating,
  onClearFilters,
  maxSeatPrice
}: FilterBarProps) {
  
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [localMin, setLocalMin] = useState<number>(minPrice ?? 0);
  const [localMax, setLocalMax] = useState<number>(maxPrice ?? maxSeatPrice);
  const [isPricePopoverOpen, setIsPricePopoverOpen] = useState(false);

  const activePrice = (minPrice !== undefined && minPrice >= 0) || (maxPrice !== undefined && maxPrice !== 15000);


  const hasActiveFilters =
  !!selectedDate ||
  activePrice ||
  sortByRating;

  const handleMinChange = (value: number) => {
    const val = Math.min(value, localMax); // no puede superar al max
    setLocalMin(val);
  };

  const handleMaxChange = (value: number) => {
    setLocalMax(value); // permitir siempre la edición
  };

  const handleMaxBlur = () => {
    // validar solo al salir del input
    if (localMax < localMin) {
      setLocalMax(maxSeatPrice);
    }
  };

  const handleApplyPrice = () => {
    if (onMinPriceChange) onMinPriceChange(localMin);
    if (onMaxPriceChange) onMaxPriceChange(localMax);
    setIsPricePopoverOpen(false);

  };

  return (
    <div className="flex flex-wrap gap-2">
      {/* FILTRO FECHA */}
      <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <DialogTrigger asChild>
          <button
            className={`flex items-center gap-1 px-3 py-1 border rounded-lg hover:bg-gray-2 transition ${
              selectedDate ? "border-gray-6 bg-gray-8" : "border-gray-2"
            }`}
          >
            <Calendar1 size={14} />
            <span className="text-sm">
              {selectedDate
                ? formatShortDate(parseLocalDate(selectedDate))
                : "Seleccionar fecha"}
            </span>
          </button>
        </DialogTrigger>

        <DialogContent className="w-full max-w-sm sm:max-w-md flex flex-col items-center gap-6">
          <DialogHeader>
            <DialogTitle>Selecciona una fecha</DialogTitle>
          </DialogHeader>
          <Calendar
            mode="single"
            selected={selectedDate ? parseLocalDate(selectedDate) : undefined}
            onSelect={(date) => {
              if (!onDateChange) return;

              // Si no hay fecha seleccionada → limpiar
              if (!date) {
                onDateChange(undefined);

                setIsCalendarOpen(false);
                return;
              }

              const newDate = new Date(date);
              newDate.setHours(0, 0, 0, 0);

              const current = selectedDate ? parseLocalDate(selectedDate) : null;

              // 👉 Si se hizo clic en la MISMA fecha → deseleccionar
              const isSame =
                current && current.toDateString() === newDate.toDateString();

              onDateChange(isSame ? undefined : newDate);
              setIsCalendarOpen(false);
            }}

            className="rounded-md border w-64 h-[320px]"
            classNames={{
              today: "ring-1 ring-gray-5 rounded-lg",
              outside: "text-muted-foreground",
            }}
          />
        </DialogContent>
      </Dialog>

      {/* FILTRO PRECIO */}
      <Popover open={isPricePopoverOpen} onOpenChange={setIsPricePopoverOpen}>
        <PopoverTrigger asChild>
          <button
            className={`flex items-center gap-1 px-3 py-1 border rounded-lg border-gray-2  hover:bg-gray-2 transition ${activePrice ?"border-gray-6 bg-gray-8" : "border-gray-2" }`}
            onClick={() => setIsPricePopoverOpen(true)}
          >
            <DollarSign size={14} />
            <span className="text-sm">Precio</span>
            
          </button>
        </PopoverTrigger>

        <PopoverContent 
          className="w-64" 
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <p className="text-sm mb-2 font-medium">Rango de precio ($)</p>

          <Slider
            min={0}
            max={maxSeatPrice}
            step={100}
            value={[localMin, localMax]}
            onValueChange={(val) => {
              handleMinChange(val[0]);
              handleMaxChange(val[1]);
            }}
            
          />

          <div className="flex justify-between gap-2 mt-3">
            <div className="flex flex-col w-1/2">
              <span className="text-xs mb-1">Mínimo</span>
              <Input
                type="text"
                inputMode="numeric"
                value={String(localMin)}
                onChange={(e) => {
                  const raw = e.target.value;

                  // Solo dígitos
                  const cleaned = raw.replace(/\D+/g, "");

                  // Normalizar ceros a la izquierda
                  const normalized = cleaned.replace(/^0+/, "");

                  // Si quedó vacío → volver a 0
                  const finalValue = normalized === "" ? 0 : Number(normalized);

                  handleMinChange(finalValue);
                }}
                className="text-sm"
              />

            </div>
            <div className="flex flex-col w-1/2">
              <span className="text-xs mb-1">Máximo</span>
              <Input
                type="text"
                inputMode="numeric"
                value={localMax === 0 ? "" : localMax}
                onChange={(e) => {
                  const raw = e.target.value;
                  const cleaned = raw.replace(/\D+/g, "");
                  const normalized = cleaned.replace(/^0+/, "");
                  handleMaxChange(normalized ? Number(normalized) : 0);
                }}
                onBlur={handleMaxBlur}
                className="text-sm"
              />

            </div>
          </div>

          <button
            onClick={handleApplyPrice}
            className="mt-4 w-full text-sm bg-gray-8 text-white rounded-lg py-1 hover:bg-gray-7 transition"
          >
            Aplicar
          </button>
        </PopoverContent>
      </Popover>

      {/* FILTRO ORDENAR POR PUNTUACIÓN */}
      <button
        className={`flex  items-center gap-1 px-3 py-1 border rounded-lg border-gray-2 hover:bg-gray-2 transition ${
          sortByRating ? "border-gray-6 bg-gray-8" : ""
        }`}
        onClick={() => setSortByRating && setSortByRating(!sortByRating)}
      > 
        {sortByRating?(<Star size={14} fill="currentColor" stroke="none"/>) : (<Star size={14} />)}
        <span className="text-sm">Puntuación</span>

      </button>
      {onClearFilters && hasActiveFilters &&(
        <button
          className="flex items-center gap-1 px-3 py-1 text-sm  rounded-xl bg-gray-2 transition"
          onClick={onClearFilters}
        >
          <span><BrushCleaning size={14}/></span>
          Limpiar filtros
          
        </button>
      )}
      
    </div>
  );
}