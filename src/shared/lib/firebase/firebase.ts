import { initializeApp, getApps } from 'firebase/app';
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
  MessagePayload,
  deleteToken,
} from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const SW_VERSION = 'v3'; 

export const getFCMToken = async (): Promise<string | null> => {
  try {
    const messagingSupported = await isSupported();
    if (!messagingSupported) {
      console.warn('FCM no soportado en este navegador.');
      return null;
    }

    if (typeof window === 'undefined') return null;

    const messaging = getMessaging(app);

    const storedVersion = localStorage.getItem('sw-version');

    if (storedVersion !== SW_VERSION) {
      try {
        await deleteToken(messaging);
      } catch {
        
      }

      localStorage.setItem('sw-version', SW_VERSION);
    }

    let registration: ServiceWorkerRegistration | undefined;

    if ('serviceWorker' in navigator) {
      registration = await navigator.serviceWorker.ready;
    }

    if (!registration) {
      throw new Error('No se encontró ningún Service Worker activo.');
    }

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    return token;
  } catch (error) {
    console.error('Error CRÍTICO al obtener token:', error);
    return null;
  }
};

export const onMessageListener = (
  callback: (payload: MessagePayload) => void
) => {
  isSupported().then((supported) => {
    if (supported) {
      const messaging = getMessaging(app);

      return onMessage(messaging, (payload) => {
        callback(payload);
      });
    }
  });
};
