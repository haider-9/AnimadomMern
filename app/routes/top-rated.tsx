import { useEffect, useState } from "react";
import AnimeCard from "../components/animecard";
import { Button } from "~/components/ui/button";
import Loading from "~/components/loader";
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

interface Anime {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      large_image_url: string;
    };
  };
  score: number;
  type: string;
}

type FormatType =
  | "tv"
  | "movie"
  | "ova"
  | "special"
  | "ona"
  | "music"
  | "cm"
  | "pv"
  | "tv_special"
  | "";

export default function TopRated() {
  const [topAnime, setTopAnime] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [format, setFormat] = useState<FormatType>("");

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleFormatChange = (value: FormatType) => {
    setFormat(value);
    setCurrentPage(1); // Reset to page 1 when format changes
  };

  const getFormatLabel = (format: FormatType): string => {
    if (format === "") return "All Formats";

    const formatLabels: Record<string, string> = {
      tv: "TV",
      movie: "Movie",
      ova: "OVA",
      special: "Special",
      ona: "ONA",
      music: "Music",
      cm: "Commercial",
      pv: "Promotional Video",
      tv_special: "TV Special",
    };

    return formatLabels[format] || format.toUpperCase();
  };

  useEffect(() => {
    const fetchTopAnime = async () => {
      setIsLoading(true);
      try {
        // Build the URL with format filter if selected
        let url = `https://api.jikan.moe/v4/top/anime?page=${currentPage}`;
        if (format) {
          url += `&type=${format}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        setTopAnime(data.data);
        setTotalPages(
          Math.ceil(
            data.pagination.items.total / data.pagination.items.per_page
          )
        );
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching top anime:", error);
        setIsLoading(false);
      }
    };

    fetchTopAnime();
  }, [currentPage, format]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <title>Top Rated Anime</title>
      <div className="min-h-screen py-8">
        <div className="flex justify-between items-center mb-8 px-4">
          <h1 className="text-3xl font-bold">Top Rated Anime</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center md:text-sm text-xs gap-1"
              >
                <FilterIcon className="h-4 w-4" />
                Format: {getFormatLabel(format)}
                <ChevronDownIcon className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by Format</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={format}
                onValueChange={(value) =>
                  handleFormatChange(value as FormatType)
                }
              >
                <DropdownMenuRadioItem value="">
                  All Formats
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="tv">TV</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="movie">
                  Movie
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="ova">OVA</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="special">
                  Special
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="ona">ONA</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="music">
                  Music
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="cm">
                  Commercial
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="pv">
                  Promotional Video
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="tv_special">
                  TV Special
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {topAnime.map((anime) => (
            <AnimeCard
              key={anime.mal_id}
              imageUrl={anime.images.jpg.large_image_url}
              title={anime.title}
              hreflink={`/anime/${anime.mal_id}`}
              score={anime.score}
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
