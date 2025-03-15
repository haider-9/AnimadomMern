import { useParams } from "react-router";
import { useEffect, useState } from "react";
import CharacterCard from "~/components/charactercard";
import { Button } from "~/components/ui/button";
import Loading from "~/components/loader";

interface Character {
  character: {
    mal_id: number;
    name: string;
    images: {
      jpg: {
        image_url: string;
      };
    };
  };
  role: string;
}

export default function AnimeCharacters() {
  const { animeid } = useParams();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const charactersPerPage = 20;

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://api.jikan.moe/v4/anime/${animeid}/characters`
        );
        const data = await response.json();
        setCharacters(data.data);
        setTotalPages(Math.ceil(data.data.length / charactersPerPage));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching characters:", error);
        setIsLoading(false);
      }
    };

    fetchCharacters();
  }, [animeid]);

  const paginatedCharacters = characters.slice(
    (currentPage - 1) * charactersPerPage,
    currentPage * charactersPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <title>{`All Character `}</title>
      <div className="min-h-screen">
        <h1 className="mb-8 text-3xl font-bold text-white">{`All Featured Characters`}</h1>
        <div className="flex flex-wrap justify-center gap-4">
          {paginatedCharacters.map((char) => (
            <CharacterCard
              key={char.character.mal_id}
              imageUrl={char.character.images.jpg.image_url}
              name={char.character.name}
              role={char.role}
              hreflink={`/character/${char.character.mal_id}`}
              animeAppearances={1}
            />
          ))}
        </div>
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
              if (
                index === 0 ||
                index === totalPages - 1 ||
                (index >= currentPage - 2 && index <= currentPage + 2)
              ) {
                return (
                  <Button
                    key={index + 1}
                    variant={currentPage === index + 1 ? "default" : "outline"}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </Button>
                );
              }
              // Show ellipsis for skipped pages
              if (index === currentPage - 3 || index === currentPage + 3) {
                return (
                  <span key={index} className="text-white">
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
      </div>
    </>
  );
}
