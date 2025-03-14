
import { useEffect, useState } from "react";
import AnimeCard from "../components/animecard";
import { Button } from "~/components/ui/button";
import Loading from "~/components/loader";

interface Anime {
  id: number;
  title: {
    romaji: string;
  };
  coverImage: {
    large: string;
  };
  averageScore: number;
}

export default function TopRated() {
  const [topAnime, setTopAnime] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const fetchTopAnime = async () => {
      try {
        const query = `
          query ($page: Int) {
            Page(page: $page, perPage: 25) {
              pageInfo {
                total
                perPage
                currentPage
                lastPage
              }
              media(sort: SCORE_DESC, type: ANIME, isAdult: true) {
                id
                title {
                  romaji
                }
                coverImage {
                  large
                }
                averageScore
              }
            }
          }
        `;

        const response = await fetch('https://graphql.anilist.co', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            query,
            variables: { page: currentPage }
          })
        });

        const { data } = await response.json();
        setTopAnime(data.Page.media);
        setTotalPages(data.Page.pageInfo.lastPage);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching top anime:", error);
        setIsLoading(false);
      }
    };

    fetchTopAnime();
  }, [currentPage]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <title>Top Rated Anime</title>
      <div className="min-h-screen p-4 sm:p-8">
        <h1 className="mb-8 text-3xl font-bold">Top Rated Anime</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {topAnime.map((anime) => (
            <AnimeCard
              key={anime.id}
              imageUrl={anime.coverImage.large}
              title={anime.title.romaji}
              hreflink={`/anime/${anime.id}`}
              score={anime.averageScore / 10}
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
