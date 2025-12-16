'use client'

import MailForm from "@/modules/mail/components/MailForm"
import { updateEmail } from "@/services/user/userService";
import { useSearchParams } from "next/navigation"

export default function EmailChangePage() {

    const params = useSearchParams()
    const email = params.get("email");

    const resendEmailChange = async (email:string) => {
        try {
            await updateEmail({email: email || "" });
        } catch (error: unknown) {
            let message = "Error desconocido";
            if (error instanceof Error) message = error.message;
            console.error("Error al reenviar correo:", message);        
        }
    };


    
    if (!email) {
        return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <p className="text-gray-500">No se encontró ningún correo electrónico para verificar.</p>
        </div>
        );
    }
    return(
        <MailForm
        queryEmail={true}
        title="Cambio de correo electrónico"
        subtitle="Ingresá tu correo electrónico para reenviar el enlace."
        buttonText="Reenviar"
        tokenExpiration="48 horas"
        paramMail={email? email:undefined}
        onResend={async (email) => {
            resendEmailChange(email)
            await new Promise((resolve) => setTimeout(resolve, 1000))
        }}
        />
    )
}