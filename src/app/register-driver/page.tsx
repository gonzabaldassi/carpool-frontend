import { DriverForm } from "@/modules/driver/components/DriverForm";

export default function RegisterDriverPage() {
  return (
    <main className="p-8 flex justify-center">
        <div className="flex flex-col items-start w-full max-w-lg space-y-6">
          <div className="flex flex-col items-start w-full space-y-2">
            <h1 className="text-lg font-semibold">Completa tu perfil de conductor</h1>
            <p className="text-sm text-muted-foreground">
              Estás a un paso de registrarte como conductor. Ingresá los siguientes datos personales para finalizar.
            </p>
          </div>
          <DriverForm/>
        </div>
    </main>

  );
}
