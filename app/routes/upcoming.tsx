import AnimeCard from "../components/animecard";
import { useEffect, useState } from "react";
import Loading from "~/components/loader";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "~/components/ui/dropdown-menu";
import { ChevronDownIcon, FilterIcon } from "lucide-react";

export default function TrendingAnime() {
  interface Anime {
    id: number;
    title: {
      romaji: string;
      english: string;
    };
    coverImage: {
      large: string;
    };
    idMal?: number;
    averageScore: number;
    format: string;
  }

  // Sort and filter options
  type SortOption =
    | "POPULARITY_DESC"
    | "SCORE_DESC"
    | "START_DATE_DESC"
    | "TITLE_ROMAJI";
  type FormatOption =
    | "TV"
    | "MOVIE"
    | "OVA"
    | "ONA"
    | "SPECIAL"
    | "MUSIC"
    | null;

  const [trendingAnime, setTrendingAnime] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  // Filter states
  const [sortBy, setSortBy] = useState<SortOption>("POPULARITY_DESC");
  const [format, setFormat] = useState<FormatOption>(null);

  useEffect(() => {
    handlePageChange(1);
  }, [sortBy, format]);

  useEffect(() => {
    handlePageChange(currentPage);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageChange = async (newPage: number) => {
    setIsLoading(true);
    setCurrentPage(newPage);
    scrollToTop();

    try {
      // Build format filter condition
      const formatFilter = format ? `, format: ${format}` : "";

      const query = `
          query ($page: Int, $sort: [MediaSort]) {
            Page(page: $page, perPage: 20) {
              pageInfo {
                hasNextPage
                total
                currentPage
                lastPage
              }
              media(type: ANIME, status: NOT_YET_RELEASED, sort: $sort${formatFilter}) {
                title {
                  romaji
                  english
                }
                coverImage {
                  large
                }
                idMal
                averageScore
                format
              }
            }
          }
        `;

      const response = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          variables: {
            page: newPage,
            sort: [sortBy],
          },
        }),
      });

      const data = await response.json();
      setTrendingAnime(data.data.Page.media);
      setHasNextPage(data.data.Page.pageInfo.hasNextPage);
    } catch (err) {
      setError("Failed to fetch anime");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortChange = (value: SortOption) => {
    setSortBy(value);
  };

  const handleFormatChange = (value: FormatOption) => {
    setFormat(value);
  };

  const getSortLabel = (sort: SortOption) => {
    switch (sort) {
      case "POPULARITY_DESC":
        return "Popularity";
      case "SCORE_DESC":
        return "Score";
      case "START_DATE_DESC":
        return "Release Date";
      case "TITLE_ROMAJI":
        return "Title";
      default:
        return "Popularity";
    }
  };

  const getFormatLabel = (format: FormatOption) => {
    if (!format) return "All Formats";
    return format;
  };

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }
  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <title>Animadom | Upcoming Anime</title>
      <section className="py-8">
        <div className="flex justify-between items-center mb-6 px-4">
          <h2 className="md:text-2xl text-xl font-bold">Upcoming Anime</h2>
          <div className="flex gap-2 flex-col md:flex-row">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center md:text-sm text-xs gap-1"
                >
                  <FilterIcon className="h-4 w-4" />
                  Sort: {getSortLabel(sortBy)}
                  <ChevronDownIcon className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={sortBy}
                  onValueChange={(value) =>
                    handleSortChange(value as SortOption)
                  }
                >
                  <DropdownMenuRadioItem value="POPULARITY_DESC">
                    Popularity
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="SCORE_DESC">
                    Score
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="START_DATE_DESC">
                    Release Date
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="TITLE_ROMAJI">
                    Title
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center md:text-sm text-xs gap-1"
                >
                  Format: {getFormatLabel(format)}
                  <ChevronDownIcon className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Format</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={format || ""}
                  onValueChange={(value) =>
                    handleFormatChange(
                      value === "" ? null : (value as FormatOption)
                    )
                  }
                >
                  <DropdownMenuRadioItem value="">
                    All Formats
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="TV">TV</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="MOVIE">
                    Movie
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="OVA">OVA</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="ONA">ONA</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="SPECIAL">
                    Special
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="MUSIC">
                    Music
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex flex-wrap justify-center w-[95%] gap-4 mx-auto">
          {trendingAnime.map((anime) => (
            <AnimeCard
              key={anime.idMal}
              title={anime.title.english || anime.title.romaji}
              imageUrl={anime.coverImage.large}
              hreflink={`/anime/${anime.idMal}`}
              score={anime.averageScore}
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

            {[...Array(50)].map((_, index) => {
              if (
                index === 0 ||
                index === 49 ||
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
              disabled={!hasNextPage}
            >
              Next
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
