'use client'
import MailForm from "@/modules/mail/components/MailForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  queryEmail: string | null
}

export default function EmailVerifyPage({ queryEmail }: Props) {
  const [email, setEmail] = useState<string>(queryEmail || "");
  const [cooldown, setCooldown] = useState<number>(0);
  const router = useRouter()
  const searchParams = useSearchParams()

  const resendActivation = async (emailToSend: string): Promise<void> => {
    if (!emailToSend) return;
    
    try {

      const res = await fetch(`/api/users/resend-activation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToSend }),
      });

      await res.json();

      
    } catch (error: unknown) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (queryEmail) {
      setEmail(queryEmail);
      // limpia el parámetro de la URL (solo la vista, no recarga)
      const params = new URLSearchParams(searchParams.toString())
      params.delete("email") // suponiendo que tu param es ?email=...
      const newUrl = `${window.location.pathname}${params.toString() ? `?${params}` : ""}`
      router.replace(newUrl)
    }
  }, [queryEmail, router, searchParams]);

  useEffect(() => {
    if (cooldown === 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown, router]);
  

  return (
      <MailForm
        queryEmail={queryEmail ? true:false}
        title="Verificá tu correo"
        subtitle="Ingresá tu correo electrónico para reenviar el enlace de verificación."
        buttonText="Reenviar"
        tokenExpiration="48 horas"
        paramMail={queryEmail? email:undefined}
        onResend={async (email) => {
          resendActivation(email)
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }}
      />
  );
}