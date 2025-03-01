import { useEffect, useState } from "react";
import { useParams } from "react-router";
import AnimeCard from "~/components/animecard";
import { cn } from "~/lib/utils";

interface AnimeData {
  idMal: number;
  title: {
    romaji: string;
    english: string;
  };
  coverImage: {
    large: string;
  };
  startDate: {
    year: number;
  };
  genres: string[];
}

interface PageInfo {
  total: number;
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
}

export default function StudioPage() {
  const { studioname } = useParams();
  const [animeList, setAnimeList] = useState<AnimeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchStudioAnime = async () => {
      const query = `
        query ($studioname: String, $page: Int) {
          Studio(search: $studioname) {
            name
            media(sort: POPULARITY_DESC, page: $page, perPage: 12) {
              nodes {
                idMal
                title {
                  romaji
                  english
                }
                coverImage {
                  large
                }
                startDate {
                  year
                }
                genres
              }
              pageInfo {
                total
                currentPage
                lastPage
                hasNextPage
              }
            }
          }
        }
      `;

      try {
        const response = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify({
            query: query,
            variables: {
              studioname: studioname,
              page: currentPage,
            },
          }),
        });

        const { data } = await response.json();
        if (data?.Studio?.media) {
          setAnimeList(data.Studio.media.nodes);
          setTotalPages(data.Studio.media.pageInfo.lastPage);
        } else {
          setAnimeList([]);
          setTotalPages(1);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching studio anime:", error);
        setAnimeList([]);
        setTotalPages(1);
        setIsLoading(false);
      }
    };

    fetchStudioAnime();
  }, [currentPage, studioname]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className=" mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 capitalize">
        Anime by {studioname}
      </h1>
      {animeList.length > 0 ? (
      <div className="flex flex-wrap justify-center w-[95%] gap-4 mx-auto">
          {animeList.map((anime) => (
            <AnimeCard
            key={anime.idMal}
            imageUrl={anime.coverImage.large}
            title={anime.title.english || anime.title.romaji}
            hreflink={`/anime/${anime.idMal}`}
          />
          ))}
        </div>
      ) : (
        <div className="text-center text-xl">No anime found for this studio.</div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={cn(
              "px-4 py-2 rounded-md",
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            )}
          >
            Previous
          </button>

          <span className="mx-4">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={cn(
              "px-4 py-2 rounded-md",
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            )}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
