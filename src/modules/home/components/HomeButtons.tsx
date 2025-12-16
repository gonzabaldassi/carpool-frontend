'use client'
import { Button } from "@/components/ux/Button";
import { useRouter } from "next/navigation";

export default function HomeButtons({ mode = "desktop" }) {
  const router = useRouter();

  const baseBtn = "text-lg w-full";
  const desktopBtn = "flex-1";
  const mobileBtn = "max-w-md mx-auto";

  const registerOrder = mode === "mobile" ? "order-2" : "order-1";
  const loginOrder = mode === "mobile" ? "order-1" : "order-2";

  return (
    <>
      <Button
        variant="outline"
        className={`${baseBtn} ${mode === "desktop" ? desktopBtn : mobileBtn} ${registerOrder}`}
        onClick={() => router.push("/register")}
      >
        Crear cuenta
      </Button>

      <Button
        variant="secondary"
        className={`${baseBtn} ${mode === "desktop" ? desktopBtn : mobileBtn} ${loginOrder}`}
        onClick={() => router.push("/login")}
      >
        Iniciar sesión
      </Button>
    </>
  );
}
