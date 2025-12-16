'use client'

import { PUBLIC_PATHS } from '@/constants/publicPaths';
import { User } from '@/models/user';
import { LoginData } from '@/modules/auth/schemas/loginSchema';
import { loginUser, authWithGoogle, logoutUser } from '@/services/auth/authService';
import { getUserFile } from '@/services/media/mediaService';

import { useRouter, usePathname } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginData & { recaptchaToken?: string }) => Promise<void>;
  logout: () => void;
  authGoogle: (idToken: string) => Promise<void>;
  fetchUser: () => Promise<boolean>;
  prevImage: string | null;
  setPrevImage: (value: string | null) => void;
  profileViewRole: 'pasajero' | 'conductor';
  setProfileViewRole: (role: 'pasajero' | 'conductor') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [prevImage, setPrevImage] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [profileViewRole, setProfileViewRole] = useState<'pasajero' | 'conductor'>('pasajero');

  const hasRun = useRef(false);

  // Rutas públicas donde no necesitamos autenticación
  const publicRoutes = [...PUBLIC_PATHS.pages];
  const isPublicRoute = publicRoutes.some(route =>
    route === '/' ? pathname === '/' : pathname.startsWith(route)
  );

  // Función para obtener el usuario actual
  const fetchUser = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/me', {
        method: 'GET',
        credentials: 'include',
      });

      if (res.ok) {
        const response = await res.json();
        if (response.data) {
          setUser({ 
            username: response.data.username,
            roles: response.data.roles,
            id: null,
            name: null,
            lastname: null,
            email: null,
            dni: null,
            phone: null,
            gender: null,
            status: null,
            birthDate: null,
           });
          return true;
        }
      }
      setUser(null);
      return false;
    } catch (err) {
      console.error('Error cargando usuario:', err);
      setUser(null);
      return false;
    }
  }, []);

  
  // Función para obtener los demas datos del usuario
  const fetchFullUser = useCallback(async () => {
    try {
      const res = await fetch("/api/users", {
        method: "GET",
        credentials: "include",
      });

      const response = await res.json();

      if (response.state !== "OK") return;

      setUser(prev => {
        if (!prev) return response.data; // si no había usuario básico, lo reemplazás
        return {
          ...prev,        // username + roles
          ...response.data, // id + email + etc desde backend
        };
      });

    } catch (err) {
      console.error("Error cargando datos completos:", err);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    if (user.id) return;

    fetchFullUser();
  }, [user, fetchFullUser]);

  // Función para obtener la imagen del usuario
  useEffect(() => {
    if (!user?.id) return;

    const loadImage = async () => {
      try {
        const imgUrl = await getUserFile(user.id ?? 0);
        if (imgUrl?.data) {
          setUser(prev => prev ? { ...prev, profileImage: imgUrl.data } : prev);
        }
      } catch (err) {
        console.warn("No se pudo cargar la imagen:", err);
      }
    };

    loadImage();
  }, [user?.id]);

  // Inicializar autenticación
  useEffect(() => {
    const initializeAuth = async () => {
      if (hasRun.current) return;
      hasRun.current = true;

      const hasUser = await fetchUser();
      setLoading(false);
      if (!hasUser && !isPublicRoute) {
        router.replace('/login');
      }
    };

    initializeAuth();
  }, []);
  
  const login = async (data: LoginData & { recaptchaToken?: string }) => {
    setLoading(true);
    try {
      const result = await loginUser(data);

      // Estado del usuario
      const code = result.messages?.[0]; 

      if (code === 'PENDING_VERIFICATION') {
        router.push('/email-verify');
        return;
      }

      if (code === 'PENDING_PROFILE') {
        setUser(null);
        throw new Error(result.messages?.[1]|| 'Error al iniciar sesión');
      }
      if (result.state === "OK") {
        await fetchUser();
        router.push('/home');
      } else {
        setUser(null);
        throw new Error(result.messages?.[0]|| 'Error al iniciar sesión');
      }
    } catch (error: unknown) {
      let message = "Error desconocido";
      if (error instanceof Error) message = error.message;
      setUser(null);
      throw new Error(message); 
    } finally {
      setLoading(false);
    }
  };

  const authGoogle = async (idToken: string) => {
    setLoading(true);
    try {
      const result = await authWithGoogle(idToken);
      if (result.state === "OK" && result.data) {
        await fetchUser();
        // Redirigir según el estado del usuario
        if (result.data.status === 'PENDING_PROFILE') {
          router.push(`/complete-profile?email=${encodeURIComponent(result.data.email)}`);
        } else if (result.data.status === 'ACTIVE') {
          router.push('/home');
        }
      } else {
        setUser(null);
        throw new Error(result.messages?.[0] || 'Error al iniciar sesión con Google');
      }
    } catch (error) {
      console.error('Google login error:', error);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const res = await logoutUser(); 
      if (res.state === "OK") { 
        setUser(null);
        router.push('/login'); 
      } else {
        console.error('Logout failed', res.messages?.[0]);
        setUser(null);
        router.push('/login');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      // opcional: mostrar mensaje al usuario
    
    } finally {
      // Siempre limpiar estado y redirigir
      setUser(null);
      router.push('/login');
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    authGoogle,
    fetchUser,
    prevImage,
    setPrevImage,
    profileViewRole,
    setProfileViewRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}