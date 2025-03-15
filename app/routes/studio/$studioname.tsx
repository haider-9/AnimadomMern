import { useEffect, useState } from "react";
import { useParams } from "react-router";
import AnimeCard from "~/components/animecard";
import { cn } from "~/lib/utils";
import Loading from "~/components/loader";
import { Button } from "~/components/ui/button";

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
            Accept: "application/json",
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
    return <Loading />;
  }

  return (
    <>
      <title>{`Animadom | ${studioname}`}</title>
      <div className="mx-auto px-4 py-8">
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
          <div className="text-center text-xl">
            No anime found for this studio.
          </div>
        )}

        {totalPages > 1 && (
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
                      variant={
                        currentPage === index + 1 ? "default" : "outline"
                      }
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
