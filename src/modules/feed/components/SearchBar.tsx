"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/search"); 
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-between w-md md:w-lg bg-gray-10 p-2 rounded-2xl md:mt-4 text-start cursor-pointer"
    >
      <span className="ml-2">¿Dónde viajamos hoy?</span>
      <Search />
    </button>
  );
}
