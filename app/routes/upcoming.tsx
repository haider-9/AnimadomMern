import AnimeCard from "../components/animecard";
import { useState, type Key } from "react";
import { Button } from "~/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "~/components/ui/skeleton";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { API_ENDPOINTS } from "~/constants";
import type { Route } from "./+types/upcoming";
import { generateMeta } from "~/lib/seo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "~/components/ui/dropdown-menu";
import { ChevronDownIcon, FilterIcon } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return generateMeta({
    title: "Upcoming Anime",
    description: "Stay updated with the latest upcoming anime releases. Discover new anime series that are coming soon and add them to your watchlist.",
    keywords: "upcoming anime, new anime releases, anime calendar, future anime, anime schedule",
    url: "/upcoming",
    canonical: "https://animadom.vercel.app/upcoming",
  });
}

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

// Fetch function for TanStack Query
const fetchUpcomingAnime = async (page: number, sortBy: SortOption, format: FormatOption) => {
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

  const response = await fetch(API_ENDPOINTS.ANILIST, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: {
        page,
        sort: [sortBy],
      },
    }),
  });

  if (!response.ok) throw new Error('Failed to fetch upcoming anime');
  const data = await response.json();
  return data.data.Page;
};

export default function TrendingAnime() {
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

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>("POPULARITY_DESC");
  const [format, setFormat] = useState<FormatOption>(null);

  // TanStack Query for data fetching
  const { data, isLoading, error } = useQuery({
    queryKey: ["upcoming-anime", currentPage, sortBy, format],
    queryFn: () => fetchUpcomingAnime(currentPage, sortBy, format),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const trendingAnime = data?.media || [];
  const hasNextPage = data?.pageInfo?.hasNextPage || false;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    scrollToTop();
  };

  const handleSortChange = (value: SortOption) => {
    setSortBy(value);
    setCurrentPage(1); // Reset to first page when changing sort
  };

  const handleFormatChange = (value: FormatOption) => {
    setFormat(value);
    setCurrentPage(1); // Reset to first page when changing format
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
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>Failed to load upcoming anime. Please try again.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="flex justify-between items-center mb-6 px-4">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-[95%] mx-auto">
          {[...Array(20)].map((_, i) => (
            <Skeleton key={i} className="h-80 w-full" />
          ))}
        </div>
      </div>
    );
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-[95%] mx-auto">
          {trendingAnime.map((anime: { idMal: Key | null | undefined; title: { english: any; romaji: any; }; coverImage: { large: string; }; averageScore: number | undefined; }) => (
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
