
'use client'

import { updateEmail } from "@/services/user/userService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ux/Button";
import { Input } from "@/components/ux/Input";
import { UpdateEmailData, updateEmailSchema } from "../../schemas/updateEmailSchema";
import { useState } from "react";
import Spinner from "@/components/ux/Spinner";


export default function UpdateEmailForm(){
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const emailForm = useForm<UpdateEmailData>({
        resolver: zodResolver(updateEmailSchema),
        mode: "onChange",
        defaultValues: { email:""},
    });

    const handleSubmit = async (data: UpdateEmailData) => {
        setLoading(true);
        try {
            await updateEmail(data);
            setLoading(false);
            router.push("/email-change?email="+data.email);
        } catch (error: unknown) {
            setLoading(false);
            let message = "Error desconocido";
            if (error instanceof Error) message = error.message;
            console.error(message)
        }
    };


    return (
        <div className="flex justify-center min-h-screen py-6 px-4 sm:px-8">
            <div className="w-full max-w-md rounded-xl shadow p-6 ">
            {/* Título siempre a la izquierda */}
            <h1 className="text-2xl font-semibold mb-6 text-left">
                Cambiar correo electrónico
            </h1>

            <form
                onSubmit={emailForm.handleSubmit(handleSubmit)}
                className="flex flex-col gap-4"
            >
                <div className="w-full">
                <Input
                    label="Correo Electrónico"
                    type="email"
                    {...emailForm.register("email")}
                    error={emailForm.formState.errors.email?.message}
                />
                </div>

                
                <Button
                    type="submit"
                    variant="primary"
                    className="w-full flex items-center justify-center"
                    disabled={!emailForm.formState.isValid || loading}
                >
                    {loading ? (
                        <div className="flex items-center justify-center gap-2">
                            <Spinner size={20} />
                            <span>Cargando...</span>
                        </div>
                    ) : (
                        'Confirmar'
                    )}
                </Button>
            </form>
            </div>
        </div>
);



}