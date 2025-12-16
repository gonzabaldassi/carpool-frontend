
import { R2_PUBLIC_PREFIX } from "@/constants/imagesR2";
import HomeButtons from "@/modules/home/components/HomeButtons";
import Image from "next/image";

export default function Page() {
  return (
    <div className="min-h-screen flex">
      {/* Panel lateral (solo desktop) */}
      <div className="hidden md:flex fixed inset-y-0 left-0 w-2/5 bg-gradient-to-b from-dark-4 via-dark-3 to-dark-2 px-[156px] py-12 items-center justify-center z-10">
        <div className="flex flex-col items-center text-center w-[200px]">
          <Image
            src={`${R2_PUBLIC_PREFIX}/carpool-wslogan.png`}
            alt="Imagen de login"
            width={200}
            height={200}
            className="object-contain"
            priority
          />
          <h1 className="font-outfit font-regular mt-4 text-lg text-white">
            Un viaje compartido, un destino en común.
          </h1>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="w-full md:ml-[40%] md:w-3/5 flex flex-col justify-around md:justify-center items-center min-h-screen md:px-[156px] md:py-12 gap-10">

        {/* Logo mobile */}
        <div className="flex justify-center md:hidden">
          <Image
            src={`${R2_PUBLIC_PREFIX}/logo-carpool.png`}
            alt="Logo mobile"
            width={200}
            height={200}
            priority
            className="h-auto"
          />
        </div>

        {/* Imagen grande */}
        <div className="hidden md:flex mb-6 justify-center w-full">
          <div className="w-full max-w-[600px] flex justify-center">
            <Image
              src={`${R2_PUBLIC_PREFIX}/home.svg`}
              alt="Logo"
              width={600}
              height={400}
              priority
              className="h-auto max-w-full"
            />
          </div>
        </div>

        <div className="flex justify-center md:hidden w-full">
          <Image
            src={`${R2_PUBLIC_PREFIX}/home.svg`}
            alt="Logo"
            width={600}
            height={400}
            priority
            className="h-auto max-w-full"
          />
        </div>

        {/* Botones Desktop */}
        <div className="hidden md:flex w-full justify-center">
          <div className="flex flex-row items-center gap-6 w-full max-w-[600px] mt-18">
            <HomeButtons mode="desktop" />
          </div>
        </div>

        {/* Botones Mobile */}
        <div className="flex md:hidden flex-col gap-6 w-full">
          <div className="w-full max-w-md mx-auto mt-6">
            <div className="flex flex-col gap-6">
              <HomeButtons mode="mobile" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
