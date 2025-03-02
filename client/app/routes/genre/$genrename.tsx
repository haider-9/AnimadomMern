import { useParams } from "react-router";
import { useEffect, useState } from "react";
import AnimeCard from "~/components/animecard";
import Loader from "~/components/loader";

interface AnimeData {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      large_image_url: string;
    };
  };
  year: number;
}

const ANILIST_GRAPHQL_ENDPOINT = "https://graphql.anilist.co";

const ANIME_BY_GENRE_QUERY = `
  query ($term: String, $page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
      }
      media(genre: $term, type: ANIME, sort: POPULARITY_DESC) {
        idMal
        title {
          english
        }
        coverImage {
          large
        }
        startDate {
          year
        }
      }
    }
  }
`;

export default function GenrePage() {
  const { genrename } = useParams();
  const [animeList, setAnimeList] = useState<AnimeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const response = await fetch(ANILIST_GRAPHQL_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: ANIME_BY_GENRE_QUERY,
            variables: {
              term: genrename,
              page: currentPage,
              perPage: itemsPerPage,
            },
          }),
        });
        const { data } = await response.json();

        const formattedAnime = data.Page.media.map((anime) => ({
          mal_id: anime.idMal,
          title: anime.title.english,
          images: { jpg: { large_image_url: anime.coverImage.large } },
          year: anime.startDate.year,
        }));

        setAnimeList(formattedAnime);
        setTotalPages(data.Page.pageInfo.lastPage);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching anime:", error);
        setLoading(false);
      }
    };

    fetchAnime();
  }, [genrename, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  if (loading) return <Loader/>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 capitalize">{genrename} Anime</h1>
      <div className="flex flex-wrap gap-5">
        {animeList.map((anime) => (
          <AnimeCard
            key={anime.mal_id}
            imageUrl={anime.images.jpg.large_image_url}
            title={anime.title}
            hreflink={`/anime/${anime.mal_id}`}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}
