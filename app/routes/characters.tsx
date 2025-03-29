import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import CharacterCard from "~/components/charactercard";
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

export default function Characters() {
  interface Character {
    id: number;
    name: {
      full: string;
    };
    image: {
      large: string;
    };
    favourites: number;
    media: {
      nodes: {
        id: number;
        title: {
          romaji: string;
        };
      }[];
    };
  }

  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);

  // Sort options
  type SortOption =
    | "FAVOURITES_DESC"
    | "FAVOURITES"
    | "ID"
    | "RELEVANCE"
    | "ROLE";
  const [sortBy, setSortBy] = useState<SortOption>("FAVOURITES_DESC");

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    // Reset to page 1 when sort changes
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      fetchCharacters(1);
    }
  }, [sortBy]);

  useEffect(() => {
    fetchCharacters(currentPage);
  }, [currentPage]);

  const fetchCharacters = async (page: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const query = `
        query ($page: Int, $sort: [CharacterSort]) {
          Page(page: $page, perPage: 24) {
            pageInfo {
              hasNextPage
              total
              currentPage
              lastPage
            }
            characters(sort: $sort) {
              id
              name {
                full
              }
              image {
                large
              }
              favourites
              media(perPage: 1) {
                nodes {
                  id
                  title {
                    romaji
                  }
                }
              }
            }
          }
        }
      `;

      const response = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query,
          variables: {
            page,
            sort: [sortBy],
          },
        }),
      });

      const data = await response.json();

      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      setCharacters(data.data.Page.characters);
      setTotalPages(data.data.Page.pageInfo.lastPage);
      setHasNextPage(data.data.Page.pageInfo.hasNextPage);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load characters. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const getSortLabel = (sort: SortOption): string => {
    switch (sort) {
      case "FAVOURITES_DESC":
        return "Most Popular";
      case "FAVOURITES":
        return "Least Popular";
      case "ID":
        return "ID";
      case "RELEVANCE":
        return "Relevance";
      case "ROLE":
        return "Role";
      default:
        return "Most Popular";
    }
  };

  const handleSortChange = (value: SortOption) => {
    setSortBy(value);
  };

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <title>Animadom | Top Characters</title>
      <meta
        name="description"
        content="Discover the top characters in Animadom"
      />

      <section className="py-8">
        <div className="flex justify-between items-center mb-6 px-4">
          <h2 className="text-2xl font-bold">Top Characters</h2>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
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
                  <DropdownMenuRadioItem value="FAVOURITES_DESC">
                    Most Popular
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="FAVOURITES">
                    Least Popular
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="ID">ID</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="RELEVANCE">
                    Relevance
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="ROLE">
                    Role
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Character Cards Grid */}
        <div className="flex flex-wrap justify-center gap-4 px-4">
          {characters.map((character: Character) => (
            <CharacterCard
              key={character.id}
              name={character.name.full}
              imageUrl={character.image.large}
              role="Character"
              animeAppearances={character.media.nodes.length}
              hreflink={`/character/${character.id}`}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2 overflow-x-auto px-4 py-2 max-w-[90vw]">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            {[...Array(Math.min(totalPages, 50))].map((_, index) => {
              const page = index + 1;

              // Show first page, last page, and pages around the current page
              if (
                page === 1 ||
                page === Math.min(totalPages, 50) ||
                (page >= currentPage - 2 && page <= currentPage + 2)
              ) {
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                );
              }

              // Show ellipsis for skipped pages
              if (page === currentPage - 3 || page === currentPage + 3) {
                return (
                  <span key={page} className="text-white">
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
    </div>
  );
}
