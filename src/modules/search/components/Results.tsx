'use client';

import { fetchCityById } from "@/services/city/cityService";
import { getTrips } from "@/services/trip/tripService";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import TripSkeleton from "@/modules/feed/components/TripSkeleton";
import CitySearch from "./CitySearch";
import FilterBar from "./FilterBar";
import { SearchData } from "../types/search";
import { TripFilters } from "@/models/trip";
import { City } from "@/models/city";
import TripList from "@/modules/feed/components/TripList";

export default function Results() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Inicializamos desde URL
  const originParam = searchParams.get("origin");
  const destinationParam = searchParams.get("destination");
  const departureDateParam = searchParams.get("departureDate");
  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam = searchParams.get("maxPrice");
  const orderByRatingParam = searchParams.get("orderByDriverRating");

  // Ciudades seleccionadas
  const [originCityId, setOriginCityId] = useState<number | null>(originParam ? Number(originParam) : null);
  const [destinationCityId, setDestinationCityId] = useState<number | null>(destinationParam ? Number(destinationParam) : null);

  // Feed
  const [feed, setFeed] = useState<SearchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [originCity, setOriginCity] = useState<City | null>();
  const [destinationCity, setDestinationCity] = useState<City | null>();

  // Filtros
  const [departureDate, setDepartureDate] = useState<string | undefined>(departureDateParam ?? undefined);
  const [minPrice, setMinPrice] = useState<number | undefined>(minPriceParam ? Number(minPriceParam) : undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(maxPriceParam ? Number(maxPriceParam) : undefined);
  const maxSeatPrice = feed.length > 0
    ? Math.max(...feed.map(item => item.seatPrice))
    : 10000;
  const [orderByDriverRating, setOrderByDriverRating] = useState(orderByRatingParam === "true");

  const fetchTrips = useCallback(async () => {
    if (!originCityId || !destinationCityId) return;

    setLoading(true);
    try {
      const filters: TripFilters = {
        originCityId,
        destinationCityId,
      };
      if (departureDate) filters.departureDate = departureDate;
      if (minPrice !== undefined) filters.minPrice = minPrice;
      if (maxPrice !== undefined) filters.maxPrice = maxPrice;
      if (orderByDriverRating) filters.orderByDriverRating = orderByDriverRating;

      const res = await getTrips(filters);
      const responseOriginCity = await fetchCityById(originCityId);
      const responseDestinationCity = await fetchCityById(destinationCityId);

      setOriginCity(responseOriginCity.data);
      setDestinationCity(responseDestinationCity.data);

      if (res.state === "OK" && res.data) {
        setFeed(res.data);
      } else {
        setFeed([]);
      }
    } catch (error) {
      console.error("Error fetching feed:", error);
      setFeed([]);
    } finally {
      setLoading(false);
    }
  }, [
    originCityId,
    destinationCityId,
    departureDate,
    minPrice,
    maxPrice,
    orderByDriverRating,
  ]);

  // --- Cada vez que cambien filtros o ciudades ---
  useEffect(() => {
    if (!originCityId || !destinationCityId) return;

    fetchTrips();

    const queryParams = new URLSearchParams();
    queryParams.set("origin", originCityId.toString());
    queryParams.set("destination", destinationCityId.toString());
    if (departureDate) queryParams.set("departureDate", departureDate);
    if (minPrice !== undefined) queryParams.set("minPrice", minPrice.toString());
    if (maxPrice !== undefined) queryParams.set("maxPrice", maxPrice.toString());
    if (orderByDriverRating) queryParams.set("orderByDriverRating", orderByDriverRating.toString());

    router.replace(`/search/results?${queryParams.toString()}`);
  }, [originCityId, destinationCityId, departureDate, minPrice, maxPrice, orderByDriverRating, router, fetchTrips]);

  // --- Limpiar filtros ---
  const clearFilters = () => {
    setDepartureDate(undefined);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setOrderByDriverRating(false);

    const queryParams = new URLSearchParams();
    if (originCityId) queryParams.set("origin", originCityId.toString());
    if (destinationCityId) queryParams.set("destination", destinationCityId.toString());

    router.replace(`/search/results?${queryParams.toString()}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="border border-gray-2 rounded-2xl md:mt-4 p-2 flex items-center gap-3 px-3">
          <div className="flex flex-col items-center">
            <div className="h-2 w-2 bg-gray-2 rounded-full animate-pulse" />
            <div className="w-0.5 h-4 bg-gray-2 my-1 animate-pulse" />
            <div className="h-2 w-2 bg-gray-2 rounded-full animate-pulse" />
          </div>
          <div className="w-full space-y-1">
            <div className="h-4 w-32 bg-gray-2 rounded animate-pulse" />
            <div className="w-full border-b bg-gray-2/70 my-2 animate-pulse"></div>
            <div className="h-4 w-40 bg-gray-2 rounded animate-pulse" />
          </div>
        </div>

        <div className="flex items-center gap-2 animate-pulse">
          <div className="h-5 w-1/4 bg-gray-2 rounded-lg" />
          <div className="h-5 w-1/6 bg-gray-2 rounded-lg" />
          <div className="h-5 w-1/6 bg-gray-2 rounded-lg" />
        </div>

        {Array.from({ length: 2 }).map((_, i) => (
          <TripSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="md:mt-4 flex items-center gap-2">
        <CitySearch
          originCity={originCityId}
          destinationCity={destinationCityId}
          setOriginCity={setOriginCityId}
          setDestinationCity={setDestinationCityId}
        />
      </div>

      <FilterBar
        selectedDate={departureDate}
        onDateChange={(date) => {
          if (!date) {
            // si se deselecciona, limpiar filtro
            setDepartureDate(undefined);
            return;
          }

          const normalized = new Date(date);
          normalized.setHours(0, 0, 0, 0);
          setDepartureDate(normalized.toISOString().slice(0, 10));
        }}
        minPrice={minPrice}
        maxPrice={maxPrice}
        maxSeatPrice={maxSeatPrice}
        onMinPriceChange={setMinPrice}
        onMaxPriceChange={setMaxPrice}
        sortByRating={orderByDriverRating}
        setSortByRating={setOrderByDriverRating}
        onClearFilters={clearFilters}
      />

      <TripList feed={feed} originSearch={originCity} destinationSearch={destinationCity} />
    </div>
  );
}
