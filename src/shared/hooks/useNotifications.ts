'use client';

import { useEffect, useState, useCallback } from 'react';
import { getFCMToken, onMessageListener } from '../lib/firebase/firebase';

interface UseNotificationsReturn {
  isLoading: boolean;
  registerNotifications: () => Promise<void>;
  requestPermission: () => Promise<NotificationPermission>;
  error: string | null;
}

export function useNotifications(): UseNotificationsReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onMessageListener((payload) => {
      if (document.visibilityState !== 'visible') return;
      
      const title = payload.notification?.title || payload.data?.title;
      const body = payload.notification?.body || payload.data?.body;

      if (!title) return;

      new Notification(title, {
        body: body ?? '',
        icon: '/icons/icon-192.png',
        badge: '/badge-72.svg',
        data: payload.data,
      });
    });
    
    return () => {

    };
  }, []);

  const registerNotifications = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const token = await getFCMToken();

      if (!token) {
        setIsLoading(false);
        return;
      }

      // Enviar token al backend
      const response = await fetch('/api/notification/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token }),
        credentials: 'include',
      });

      if (!response.ok) {
        console.error('Error backend al registrar token');
      } 
    } catch (error: unknown) { 
      let errorMessage = 'Error desconocido';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      console.error('Error en registro:', errorMessage);
      setError(`Error técnico: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, []);


  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (typeof window === "undefined" || !('Notification' in window)) {
      return 'denied';
    }

    const result = await Notification.requestPermission();
    console.log("ANTES DEL ENTRAR AL IF: ", result);

    if (result === 'granted') {
      console.log("ESTA ENTRANDO AL IF");
      await registerNotifications();
    }
    
    return result;
  }, [registerNotifications]);

  return {
    requestPermission,
    isLoading,
    registerNotifications,
    error,
  };
}