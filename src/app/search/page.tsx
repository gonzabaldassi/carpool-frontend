import SearchBar from "@/modules/search/components/SearchBar";

export default function SearchPage() {
  return (
    <main className="max-w-lg mx-auto">
      <h1 className="text-xl md:mt-8">Planificá tu recorrido</h1>
      <div className="w-full flex items-center justify-center gap-4">
        <SearchBar/>
      </div>
    </main>

  );
}
