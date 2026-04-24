'use client';

import { useEffect, useState, useCallback } from 'react';
import { getFCMToken, getMessagingInstance, onMessageListener } from '../lib/firebase/firebase';
import { deleteToken } from 'firebase/messaging';

interface UseNotificationsReturn {
  isLoading: boolean;
  registerNotifications: () => Promise<void>;
  disableNotifications: () => Promise<void>;
  hasActiveTokens: () => Promise<boolean>;
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

      navigator.serviceWorker.getRegistration().then((reg) => {
        if (!reg) return;

        reg.showNotification(title, {
          body: body ?? '',
          icon: '/icons/icon-192.png',
          badge: '/icons/icon-192.png',
          data: payload.data,
        });
      });
    });
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

  const disableNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await fetch('/api/notification/delete', {
        method: 'DELETE',
        credentials: 'include',
      });

      const messaging = await getMessagingInstance();

      if (messaging) {
        await deleteToken(messaging);
      }

    } catch (error: unknown) {
      let errorMessage = 'Error desconocido';

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setError(`Error técnico: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const hasActiveTokens = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/notification/status', {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) {
        return false;
      }

      const data = await res.json();

      return data?.data === true;
    } catch (error) {
      console.error('Error al consultar estado de notificaciones:', error);
      return false;
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
    disableNotifications,
    hasActiveTokens,
    error,
  };
}