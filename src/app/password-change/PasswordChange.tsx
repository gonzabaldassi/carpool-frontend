'use client'


import PasswordForm from "@/modules/password/components/PasswordForm";
import { ResetPasswordData } from "@/modules/password/schemas/resetPasswordSchema";
import { resetPassword } from "@/services/user/userService";

export default function PasswordChangePage() {
  const handleResetPassword = async (data: ResetPasswordData) => {
    return await resetPassword(data);
  };

  return (
    <PasswordForm
      title="Cambiá tu contraseña"
      successTitle="¡Contraseña actualizada!"
      successMessage="Se actualizó tu contraseña, puedes volver a intentar iniciar sesión"
      onSubmit={handleResetPassword}
    />
  );
}