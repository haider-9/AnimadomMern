import { useParams } from "react-router";
import { useEffect, useState } from "react";
import AnimeCard from "~/components/animecard";

interface AnimeData {
  id: number;
  title: {
    romaji: string;
    english: string;
  };
  coverImage: {
    large: string;
  };
  averageScore: number;
  idMal: number;
}

const ANILIST_GRAPHQL_ENDPOINT = 'https://graphql.anilist.co';

const ANIME_BY_GENRE_QUERY = `
  query ($genre: String) {
    Page(page: 1, perPage: 20) {
      media(genre: $genre, type: ANIME, sort: POPULARITY_DESC) {
        id
        idMal
        title {
          romaji
          english
        }
        coverImage {
          large
        }
        averageScore
      }
    }
  }
`;

export default function GenrePage() {
  const { genrename } = useParams();
  const [animeList, setAnimeList] = useState<AnimeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimeByGenre = async () => {
      try {
        const response = await fetch(ANILIST_GRAPHQL_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            query: ANIME_BY_GENRE_QUERY,
            variables: { genre: genrename },
          }),
        });

        const { data } = await response.json();
        setAnimeList(data.Page.media);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching anime:", error);
        setLoading(false);
      }
    };

    fetchAnimeByGenre();
  }, [genrename]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 capitalize">{genrename} Anime</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
        {animeList.map((anime) => (
          <AnimeCard
            key={anime.id}
            imageUrl={anime.coverImage.large}
            title={anime.title.english || anime.title.romaji}
            hreflink={`/anime/${anime.idMal}`}
            score={anime.averageScore / 10}
          />
        ))}
      </div>
    </div>
  );
}
