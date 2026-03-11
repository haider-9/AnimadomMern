import AnimeCard from "./animecard";
import { Button } from "./ui/button";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";
import { Alert, AlertDescription } from "./ui/alert";
import { API_ENDPOINTS } from "~/constants";

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
}

const fetchTrendingAnime = async (): Promise<Anime[]> => {
  const query = `
    query {
      Page(page: 1, perPage: 10) {
        media(type: ANIME, sort: TRENDING_DESC) {
          title {
            romaji
            english
          }
          coverImage {
            large
          }
          idMal
          averageScore
        }
      }
    }
  `;

  const response = await fetch(API_ENDPOINTS.ANILIST, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();
  return data.data.Page.media;
};

export default function TrendingAnime() {
  const { data: trendingAnime, isLoading, error } = useQuery({
    queryKey: ["trending-anime"],
    queryFn: fetchTrendingAnime,
  });

  if (error) {
    return (
      <Alert variant="destructive" className="mx-4">
        <AlertDescription>Failed to fetch trending anime</AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="flex justify-between items-center mb-4 px-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-20" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-80 w-full rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="flex justify-between items-center mb-4 px-4">
        <h2 className="text-2xl font-bold text-foreground">Trending Now</h2>
        <Button variant="default" size="sm" asChild>
          <Link to="/trending">See All</Link>
        </Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4">
        {trendingAnime?.map((anime) => (
          <AnimeCard
            key={anime.idMal}
            title={anime.title.english || anime.title.romaji}
            imageUrl={anime.coverImage.large}
            hreflink={`/anime/${anime.idMal}`}
            score={anime.averageScore / 10}
          />
        ))}
      </div>
    </section>
  );
}
