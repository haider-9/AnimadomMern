import { useEffect, useState } from "react";
import CollectionCard from "../components/collectioncard";
import Loading from "~/components/loader";
import { Button } from "~/components/ui/button";

const ANILIST_API = "https://graphql.anilist.co";
const GENRES_PER_PAGE = 20; // Number of genres to show per page

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
        // First fetch the total count of genres to calculate pages
        const countQuery = `
          query {
            GenreCollection
          }
        `;

        const countResponse = await fetch(ANILIST_API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ query: countQuery }),
        });

        if (!countResponse.ok) throw new Error("Failed to fetch genre count");
        const countData = await countResponse.json();
        const totalGenres = countData.data.GenreCollection.length;
        setTotalPages(Math.ceil(totalGenres / GENRES_PER_PAGE));

        // Get the genres for the current page
        const startIdx = (currentPage - 1) * GENRES_PER_PAGE;
        const endIdx = startIdx + GENRES_PER_PAGE;
        const currentGenres = countData.data.GenreCollection.slice(startIdx, endIdx);

        // For each genre, fetch popular anime
        const collectionsData = await Promise.all(
          currentGenres.map(async (genre: string) => {
            const animeQuery = `
              query ($genre: String, $perPage: Int) {
                Page(perPage: $perPage) {
                  media(type: ANIME, genre: $genre, sort: POPULARITY_DESC) {
                    coverImage {
                      medium
                    }
                    title {
                      romaji
                    }
                  }
                }
              }
            `;

            const animeResponse = await fetch(ANILIST_API, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({
                query: animeQuery,
                variables: {
                  genre: genre,
                  perPage: 4, // Get 4 anime per genre for the collection card
                },
              }),
            });

            if (!animeResponse.ok) throw new Error("Failed to fetch anime");
            const animeData = await animeResponse.json();

            const validAnime = animeData.data.Page.media
              .filter((anime: any) => anime.coverImage?.medium)
              .slice(0, 4);

            return {
              title: genre,
              slug: genre.toLowerCase().replace(/\s+/g, "-"),
              images: validAnime.map((anime: any) => anime.coverImage.medium),
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
      <div className="flex flex-wrap justify-center gap-4">
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
            disabled={currentPage === totalPages || loading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}