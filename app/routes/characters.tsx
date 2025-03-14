import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import CharacterCard from "~/components/charactercard";
import Loading from "~/components/loader";

export default function Characters() {
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  interface Character {
    mal_id: number;
    name: string;
    images: {
      jpg: {
        image_url: string;
      };
    };
    role?: string;
    anime?: {
      id: number;
      title: string;
    }[];
  }

  useEffect(() => {
    const fetchCharacters = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.jikan.moe/v4/top/characters?page=${currentPage}&limit=24`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setCharacters(data.data);
        setTotalPages(Math.ceil(data.pagination.items.total / 24));
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load characters. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacters();
  }, [currentPage]);

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <title>Animadom | Top Characters</title>
      <meta
        name="description"
        content="Discover the top characters in Animadom"
      />

      <section className="py-8">
        <h2 className="text-2xl font-bold mb-6 px-4 ">
          Top Characters
        </h2>

        {/* Character Cards Grid */}
        <div className="flex flex-wrap justify-center gap-4 px-4">
          {characters.map((character: Character) => (
            <CharacterCard
              key={character.mal_id}
              name={character.name}
              imageUrl={character.images.jpg.image_url}
              role={character.role || "Main"}
              animeAppearances={character.anime?.length || 0}
              hreflink={`/character/${character.mal_id}`}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2 overflow-x-auto px-4 py-2 max-w-[90vw]">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;

              // Show first page, last page, and pages around the current page
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 2 && page <= currentPage + 2)
              ) {
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                );
              }

              // Show ellipsis for skipped pages
              if (page === currentPage - 3 || page === currentPage + 3) {
                return (
                  <span key={page} className="text-white">
                    ...
                  </span>
                );
              }

              return null;
            })}

            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
