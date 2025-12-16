'use client'

import { useEffect, useRef, useState } from "react"
import TripList from "./TripList";
import { getInitialFeed } from "@/services/trip/tripService";
import TripSkeleton from "./TripSkeleton";
import { useAuth } from "@/contexts/authContext";
import { useGeocode } from "../hooks/useGeocode";
import { useNotifications } from "@/shared/hooks/useNotifications";
import { City } from "@/models/city";
import { SearchData } from "@/modules/search/types/search";

let initialized = false;

export default function Feed() {
  const {user} = useAuth()
  const { city,detectUserCity } = useGeocode();
  const { requestPermission } = useNotifications();
  const [currentCity, setCurrentCity] = useState<City | null>(null);
  const [feed, setFeed] = useState<SearchData[] | null>(null);
  const [loading, setLoading] = useState(true); 
  const feedFetchRef = useRef(false);

  useEffect(() => {
    if (initialized) return;
    initialized = true;
    const initNotifications = async () => {
      if (typeof window === "undefined" || !("Notification" in window)) return;
      try {
        // Pedir permiso usando el hook
        if (Notification.permission === 'default') {
          await requestPermission();
        }

      } catch (error) {
        console.warn('No se pudieron registrar las notificaciones:', error);
      }
    };
    initNotifications();
  }, [initialized,requestPermission]);

  useEffect(() => {
    if(!user) return;
    detectUserCity();
  }, [user]);

  useEffect(() => {
    if (!city) return; // Espera a que city esté disponible
    if (feedFetchRef.current) return;

    feedFetchRef.current = true; // Marca como ejecutado

    const fetchFeed = async () => {
      try {
        setCurrentCity(city);
        const responseFeed = await getInitialFeed(city.id);
        if (responseFeed.state === "OK" && responseFeed.data) {
          setFeed(responseFeed.data);
        }
      } catch (err) {
        console.error("Error cargando feed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [city]);


  if (loading) {
    return (
      <div className="w-full">
        {Array.from({ length: 2 }).map((_, i) => (
          <TripSkeleton key={i} />
        ))}
      </div>
    );
  }


  return (
    <div className="w-full">
      <TripList feed={feed ?? []} currentCity={currentCity?.name}/>
    </div>
  );
}
