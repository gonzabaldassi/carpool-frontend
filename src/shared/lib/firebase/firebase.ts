// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported, MessagePayload } from 'firebase/messaging';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Inicializar Firebase solo una vez
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Función para obtener el token FCM
export const getFCMToken = async (): Promise<string | null> => {
  try {
    // Verificar si el navegador soporta notificaciones
    const messagingSupported = await isSupported();
    if (!messagingSupported) return null;

    const messaging = getMessaging(app);
    
    // Solicitar permiso al usuario
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      // Obtener el token (VAPID key desde Firebase Console)
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });
      
      return token;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error al obtener el token FCM:', error);
    return null;
  }
};

// Escuchar mensajes cuando la app está en primer plano
export const onMessageListener = (): Promise<MessagePayload> =>
  new Promise((resolve) => {
    isSupported().then((supported) => {
      if (supported) {
        const messaging = getMessaging(app);
        onMessage(messaging, (payload) => {
          resolve(payload);
        });
      }
    });
  });