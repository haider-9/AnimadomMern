import { useParams } from "react-router";
import { useState } from "react";
import CharacterCard from "~/components/charactercard";
import { Button } from "~/components/ui/button";
import Loading from "~/components/loader";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "~/components/ui/skeleton";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { API_ENDPOINTS } from "~/constants";
import type { Route } from "./+types/$animeid";
import { generateMeta } from "~/lib/seo";

export function meta({ params }: Route.MetaArgs) {
  return generateMeta({
    title: "Anime Characters",
    description: "Explore all characters from this anime series. Discover main characters, supporting cast, and their roles in the story.",
    keywords: "anime characters, character list, anime cast, character profiles",
    url: `/morecharacters/${params.animeid}`,
    canonical: `https://animadom.vercel.app/morecharacters/${params.animeid}`,
  });
}

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

const fetchAnimeCharacters = async (animeid: string) => {
  const response = await fetch(`${API_ENDPOINTS.JIKAN}/anime/${animeid}/characters`);
  if (!response.ok) throw new Error('Failed to fetch characters');
  const data = await response.json();
  return data.data;
};

export default function AnimeCharacters() {
  const { animeid } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const charactersPerPage = 20;

  const { data: characters = [], isLoading, error } = useQuery({
    queryKey: ["anime-characters", animeid],
    queryFn: () => fetchAnimeCharacters(animeid!),
    enabled: !!animeid,
  });

  const totalPages = Math.ceil(characters.length / charactersPerPage);

  const paginatedCharacters = characters.slice(
    (currentPage - 1) * charactersPerPage,
    currentPage * charactersPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="mb-8">
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[...Array(20)].map((_, i) => (
            <Skeleton key={i} className="h-80 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Alert variant="destructive">
          <AlertDescription>Failed to load characters</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <title>{`All Character `}</title>
      <div className="min-h-screen">
        <h1 className="mb-8 text-3xl font-bold ">{`All Featured Characters`}</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {paginatedCharacters.map((char: Character) => (
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
                  <span key={index} className="text-muted-foreground">
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
