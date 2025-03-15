import { useState, useEffect } from "react";
import { useParams } from "react-router";
import AnimeCard from "~/components/animecard";
import Loader from "~/components/loader";
import { Button } from "~/components/ui/button";

interface AnimeData {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      large_image_url: string;
    };
  };
  year: number;
  genres?: string[];
  averageScore?: number;
  popularity?: number;
}

export default function GenrePage() {
  const { genrename } = useParams();
  const [animeList, setAnimeList] = useState<AnimeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const ANILIST_GRAPHQL_ENDPOINT = "https://graphql.anilist.co";

    const fetchAnime = async () => {
      setLoading(true);
      setError(null);

      const query = `
        query ($term: String) {
          byGenre: Page(page: ${currentPage}, perPage: ${itemsPerPage}) {
            pageInfo {
              total
              perPage
              currentPage
              lastPage
              hasNextPage
            }
            media(genre: $term, type: ANIME, sort: POPULARITY_DESC) {
              idMal
              title {
                romaji
                english
                native
              }
              coverImage {
                large
              }
              startDate {
                year
              }
              genres
              averageScore
              popularity
            }
          }
          byTag: Page(page: ${currentPage}, perPage: ${itemsPerPage}) {
            pageInfo {
              total
              perPage
              currentPage
              lastPage
              hasNextPage
            }
            media(tag: $term, type: ANIME, sort: POPULARITY_DESC) {
              idMal
              title {
                romaji
                english
                native
              }
              coverImage {
                large
              }
              startDate {
                year
              }
              genres
              averageScore
              popularity
            }
          }
        }
      `;

      try {
        const response = await fetch(ANILIST_GRAPHQL_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            query,
            variables: {
              term: genrename,
            },
          }),
        });

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }

        const { data, errors } = await response.json();

        if (errors) {
          throw new Error(errors[0]?.message || "Error fetching anime data");
        }

        if (!data) {
          throw new Error("Invalid data structure received");
        }

        // Process both genre and tag results
        const genreResults = data.byGenre?.media || [];
        const tagResults = data.byTag?.media || [];

        // Combine and deduplicate results (using idMal as unique identifier)
        const combinedResults = [...genreResults];

        // Add tag results that aren't already in genre results
        tagResults.forEach((tagAnime) => {
          if (
            !combinedResults.some(
              (genreAnime) => genreAnime.idMal === tagAnime.idMal
            )
          ) {
            combinedResults.push(tagAnime);
          }
        });

        // Format the combined results
        const formattedAnime = combinedResults.map((anime: any) => ({
          mal_id: anime.idMal,
          title:
            anime.title.english || anime.title.romaji || anime.title.native,
          images: { jpg: { large_image_url: anime.coverImage.large } },
          year: anime.startDate?.year,
          genres: anime.genres,
          averageScore: anime.averageScore,
          popularity: anime.popularity,
        }));

        setAnimeList(formattedAnime);

        // Use the larger of the two lastPage values for pagination
        const genreLastPage = data.byGenre?.pageInfo?.lastPage || 1;
        const tagLastPage = data.byTag?.pageInfo?.lastPage || 1;
        setTotalPages(Math.max(genreLastPage, tagLastPage));
      } catch (error) {
        console.error("Error fetching anime:", error);
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [genrename, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  // Improved pagination rendering logic
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtonsToShow = 5;

    // Always show first page
    buttons.push(
      <Button
        key={1}
        variant={currentPage === 1 ? "default" : "outline"}
        onClick={() => handlePageChange(1)}
      >
        1
      </Button>
    );

    // Calculate range of pages to show
    let startPage = Math.max(2, currentPage - Math.floor(maxButtonsToShow / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxButtonsToShow - 3);

    if (endPage - startPage < maxButtonsToShow - 3) {
      startPage = Math.max(2, endPage - (maxButtonsToShow - 3) + 1);
    }

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      buttons.push(
        <span key="ellipsis1" className="text-white px-2">
          ...
        </span>
      );
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Button>
      );
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      buttons.push(
        <span key="ellipsis2" className="text-white px-2">
          ...
        </span>
      );
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      buttons.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? "default" : "outline"}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Button>
      );
    }

    return buttons;
  };

  if (loading) return <Loader />;

  return (
    <>
      <title>{genrename} Anime</title>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 capitalize">
          {genrename} Anime
        </h1>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded-md mb-6">
            Error: {error}
          </div>
        )}

        {animeList.length === 0 && !error ? (
          <div className="text-center py-10">
            <h2 className="text-xl font-semibold mb-2">No anime found</h2>
            <p className="text-gray-400">
              We couldn't find any anime for "{genrename}".
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-5">
            {animeList.map((anime) => (
              <AnimeCard
                key={anime.mal_id}
                imageUrl={anime.images.jpg.large_image_url}
                title={anime.title}
                hreflink={`/anime/${anime.mal_id}`}
              />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {animeList.length > 0 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2 overflow-x-auto py-2 max-w-[85vw]">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              {renderPaginationButtons()}

              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
