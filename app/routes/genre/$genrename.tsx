import { ChevronDown, FilterIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import AnimeCard from "~/components/animecard";
import Loader from "~/components/loader";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

interface AnimeData {
  id: number;
  title: {
    romaji: string;
    english: string | null;
    native: string;
  };
  coverImage: {
    large: string;
    color: string | null;
  };
  seasonYear: number | null;
  genres: string[];
  averageScore: number | null;
  popularity: number | null;
  format: "TV" | "TV_SHORT" | "MOVIE" | "SPECIAL" | "OVA" | "ONA" | "MUSIC";
}

type SortOption =
  | "POPULARITY_DESC"
  | "POPULARITY"
  | "SCORE_DESC"
  | "SCORE"
  | "TRENDING_DESC"
  | "TRENDING"
  | "UPDATED_AT_DESC"
  | "UPDATED_AT"
  | "START_DATE_DESC"
  | "START_DATE"
  | "END_DATE_DESC"
  | "END_DATE"
  | "FAVOURITES_DESC"
  | "FAVOURITES"
  | "TITLE_ROMAJI_DESC"
  | "TITLE_ROMAJI"
  | "TITLE_ENGLISH_DESC"
  | "TITLE_ENGLISH"
  | "TITLE_NATIVE_DESC"
  | "TITLE_NATIVE"
  | "EPISODES_DESC"
  | "EPISODES"
  | "ID"
  | "ID_DESC";

type FormatOption =
  | "TV"
  | "TV_SHORT"
  | "MOVIE"
  | "SPECIAL"
  | "OVA"
  | "ONA"
  | "MUSIC"
  | null;

export default function GenrePage() {
  const { genrename } = useParams();
  const [animeList, setAnimeList] = useState<AnimeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>("POPULARITY_DESC");
  const [formatFilter, setFormatFilter] = useState<FormatOption>(null);

  useEffect(() => {
    const fetchAnime = async () => {
      setLoading(true);
      setError(null);

      try {
        const query = `
          query ($genre: String, $page: Int, $perPage: Int, $sort: [MediaSort], $format: MediaFormat) {
            Page(page: $page, perPage: $perPage) {
              pageInfo {
                total
                perPage
                currentPage
                lastPage
                hasNextPage
              }
              media(genre: $genre, sort: $sort, type: ANIME, format: $format) {
                id
                title {
                  romaji
                  english
                  native
                }
                coverImage {
                  large
                  color
                }
                seasonYear
                genres
                averageScore
                popularity
                format
              }
            }
          }
        `;

        const variables = {
          genre: genrename,
          page: currentPage,
          perPage: 24,
          sort: [sortBy],
          format: formatFilter,
        };

        const response = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            query,
            variables,
          }),
        });

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }

        const { data } = await response.json();

        if (!data || !data.Page) {
          throw new Error("Invalid data structure received");
        }

        setAnimeList(data.Page.media);
        setTotalPages(data.Page.pageInfo.lastPage);
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
  }, [genrename, currentPage, sortBy, formatFilter]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtonsToShow = 5;

    buttons.push(
      <Button
        key={1}
        variant={currentPage === 1 ? "default" : "outline"}
        onClick={() => handlePageChange(1)}
      >
        1
      </Button>
    );

    let startPage = Math.max(2, currentPage - Math.floor(maxButtonsToShow / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxButtonsToShow - 3);

    if (endPage - startPage < maxButtonsToShow - 3) {
      startPage = Math.max(2, endPage - (maxButtonsToShow - 3) + 1);
    }

    if (startPage > 2) {
      buttons.push(
        <span key="ellipsis1" className="text-white px-2">
          ...
        </span>
      );
    }

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

    if (endPage < totalPages - 1) {
      buttons.push(
        <span key="ellipsis2" className="text-white px-2">
          ...
        </span>
      );
    }

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

  const getDisplayTitle = (anime: AnimeData) => {
    return anime.title.english || anime.title.romaji || anime.title.native;
  };

  if (loading) return <Loader />;

  return (
    <>
      <title>{`Animadom | ${(genrename)?.charAt(0).toUpperCase()}${(genrename)?.slice(1)} Anime`}</title>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold capitalize">{genrename} Anime</h1>

          <div className="flex gap-2 md:flex-row flex-col">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center md:text-sm text-xs gap-1">
              <FilterIcon className="h-4 w-4" />
                  Sort By
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortBy("POPULARITY_DESC")}>
                  Popularity (High to Low)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("POPULARITY")}>
                  Popularity (Low to High)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("SCORE_DESC")}>
                  Score (High to Low)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("SCORE")}>
                  Score (Low to High)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("TRENDING_DESC")}>
                  Trending (High to Low)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("TITLE_ROMAJI")}>
                  Title (A-Z)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortBy("TITLE_ROMAJI_DESC")}
                >
                  Title (Z-A)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center md:text-sm text-xs gap-1">
              Format
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Format</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFormatFilter(null)}>
                  All Formats
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFormatFilter("TV")}>
                  TV Series
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFormatFilter("MOVIE")}>
                  Movies
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFormatFilter("OVA")}>
                  OVA
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFormatFilter("ONA")}>
                  ONA
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFormatFilter("SPECIAL")}>
                  Specials
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFormatFilter("TV_SHORT")}>
                  TV Shorts
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

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
                key={anime.id}
                imageUrl={anime.coverImage.large}
                title={getDisplayTitle(anime)}
                hreflink={`/anime/${anime.id}`}
              />
            ))}
          </div>
        )}

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
