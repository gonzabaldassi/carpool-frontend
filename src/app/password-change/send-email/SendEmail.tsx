'use client'

import MailForm from "@/modules/mail/components/MailForm";
import { sendChangePasswordEmail } from "@/services/email/emailService";

export default function SendChangePasswordEmailPage() {

  const resendActivation = async (emailToSend: string) => {
    if (!emailToSend) return;
    try {

      await sendChangePasswordEmail(emailToSend);

    } catch (error: unknown) {
      let message = "Error desconocido";
      if (error instanceof Error) message = error.message;
      console.error(message)
    }
  };

  return (
    <MailForm
      queryEmail={false}
      title="Cambia tu contraseña"
      subtitle="Ingresá tu correo electrónico para cambiar tu contraseña."
      buttonText="Enviar"
      tokenExpiration="30 minutos"
      onResend={async (email) => {
        resendActivation(email)
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }}
    />
  );
}