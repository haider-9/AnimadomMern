"use client";

import { useEffect, useState } from "react";
import CollectionCard from "../components/collectioncard";

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
  const [loading, setLoading] = useState(false);
  const collectionsPerPage = 20;

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

        const categories = categoriesData.data.map((c: any) => ({
          id: c.id,
          title: c.attributes.title,
          slug: c.attributes.slug
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
      <title>Collections | Animadom</title>

      {loading && (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && <div className="text-red-500 text-center p-4">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {collections.map((collection, index) => {
           console.log(collection)
          return(
          
          <CollectionCard
            key={`${collection.title}-${index}`}
            title={`${collection.title} Anime`}
            backgroundImage={collection.images[0]}
            thumbnailImages={collection.images.slice(1)}
            hreflink={`/genre/${collection.slug}`}
          />
         
        )
      
        })}
      </div>
    
    
      <div className="flex justify-center items-center mt-8 gap-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1 || loading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="mx-4">Page {currentPage}</span>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
