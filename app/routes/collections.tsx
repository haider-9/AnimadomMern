import { useEffect, useState } from "react";
import CollectionCard from "../components/collectioncard";
import Loading from "~/components/loader";
import { Button } from "~/components/ui/button";
import { API_ENDPOINTS } from "~/constants";
import type { Route } from "./+types/collections";
import { generateMeta } from "~/lib/seo";

export function meta({}: Route.MetaArgs) {
  return generateMeta({
    title: "Anime Collections",
    description: "Explore curated anime collections organized by genres, themes, and popularity. Discover new anime series through our carefully crafted collections.",
    keywords: "anime collections, anime genres, anime categories, anime discovery, curated anime lists",
    url: "/collections",
    canonical: "https://animadom.vercel.app/collections",
  });
}

const GENRES_PER_PAGE = 20;

export default function Collections() {
  const [collections, setCollections] = useState<
    Array<{
      title: string;
      images: string[];
      slug: string;
    }>
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const fetchAnimeCollections = async () => {
      setLoading(true);
      try {
        // Fetch genres from Jikan
        const genresResponse = await fetch(`${API_ENDPOINTS.JIKAN}/genres/anime`);
        if (!genresResponse.ok) throw new Error("Failed to fetch genres");
        const genresData = await genresResponse.json();
        const allGenres = genresData.data.map((genre: any) => genre.name);
        
        setTotalPages(Math.ceil(allGenres.length / GENRES_PER_PAGE));

        // Get genres for current page
        const startIdx = (currentPage - 1) * GENRES_PER_PAGE;
        const endIdx = startIdx + GENRES_PER_PAGE;
        const currentGenres = allGenres.slice(startIdx, endIdx);

        // Fetch anime for each genre from Kitsu
        const collectionsData = await Promise.all(
          currentGenres.map(async (genre: string) => {
            const kitsuResponse = await fetch(
              `${API_ENDPOINTS.KITSU}/anime?filter[genres]=${genre}&page[limit]=4&sort=-averageRating`,
              {
                headers: {
                  Accept: "application/vnd.api+json",
                  "Content-Type": "application/vnd.api+json",
                },
              }
            );

            if (!kitsuResponse.ok) throw new Error("Failed to fetch anime");
            const kitsuData = await kitsuResponse.json();

            const validAnime = kitsuData.data
              .filter((anime: any) => anime.attributes.posterImage?.medium)
              .slice(0, 4);

            return {
              title: genre,
              slug: genre.toLowerCase().replace(/\s+/g, "-"),
              images: validAnime.map((anime: any) => anime.attributes.posterImage.medium),
            };
          })
        );

        setCollections(collectionsData);
        setError(null);
      } catch (error) {
        setError("Failed to load anime collections");
        console.error("Error fetching anime data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeCollections();
  }, [currentPage]);

  return (
    <div className="min-h-screen p-8">
      <title>Animadom | Collections </title>

      {loading && <Loading />}

      {error && <div className="text-red-500 text-center p-4">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
        {collections.map((collection, index) => (
          <CollectionCard
            key={`${collection.title}-${index}`}
            title={`${collection.title} Anime`}
            backgroundImage={collection.images[0]}
            thumbnailImages={collection.images.slice(1)}
            hreflink={`/genre/${collection.slug}`}
          />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <div className="flex items-center gap-2 overflow-x-auto px-4 py-2 max-w-[90vw]">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
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
            disabled={currentPage === totalPages || loading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}