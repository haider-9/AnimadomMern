import { useEffect, useState } from "react";
import CollectionCard from "../components/collectioncard";
import Loading from "~/components/loader";
import { Button } from "~/components/ui/button";

const KITSU_CATEGORIES_API = "https://kitsu.io/api/edge/categories";
const KITSU_ANIME_API = "https://kitsu.io/api/edge/anime";

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
  const collectionsPerPage = 20;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const fetchAnimeCollections = async () => {
      setLoading(true);
      try {
        const categoriesResponse = await fetch(
          `${KITSU_CATEGORIES_API}?page[limit]=20&page[offset]=${
            (currentPage - 1) * collectionsPerPage
          }`
        );
        if (!categoriesResponse.ok)
          throw new Error("Failed to fetch categories");
        const categoriesData = await categoriesResponse.json();
        setTotalPages(Math.ceil(categoriesData.data.length / collectionsPerPage));

        const categories = categoriesData.data.map((c: any) => ({
          id: c.id,
          title: c.attributes.title,
          slug: c.attributes.slug,
        }));

        const collectionsData = await Promise.all(
          categories.slice(0, collectionsPerPage).map(async (category: any) => {
            const animeResponse = await fetch(
              `${KITSU_ANIME_API}?filter[categories]=${category.id}&page[limit]=20}&sort=-averageRating`
            );
            if (!animeResponse.ok) throw new Error("Failed to fetch anime");
            const animeData = await animeResponse.json();

            const validAnime = animeData.data
              .filter((anime: any) => anime.attributes.posterImage?.small)
              .sort(() => Math.random() - 0.5)
              .slice(0, 4);

            return {
              title: `${category.title}`,
              slug: `${category.slug}`,
              images: validAnime.map(
                (anime: any) => anime.attributes.posterImage.small
              ),
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
