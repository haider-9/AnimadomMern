import AnimeCard from "./animecard";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";
import { Alert, AlertDescription } from "./ui/alert";
import { API_ENDPOINTS } from "~/constants";

interface Anime {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      large_image_url: string;
    };
  };
  score: number;
}

const fetchTopRatedAnime = async (): Promise<Anime[]> => {
  const response = await fetch(`${API_ENDPOINTS.JIKAN}/top/anime?limit=20`);
  const data = await response.json();
  return data.data;
};

export default function TopRated() {
  const { data: topRatedAnime, isLoading, error } = useQuery({
    queryKey: ["top-rated-anime"],
    queryFn: fetchTopRatedAnime,
  });

  if (error) {
    return (
      <Alert variant="destructive" className="mx-4">
        <AlertDescription>Failed to fetch top rated anime</AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="flex items-center justify-between mb-6 px-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-20" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4">
          {[...Array(20)].map((_, i) => (
            <Skeleton key={i} className="h-80 w-full rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6 px-4">
        <h2 className="text-2xl font-bold text-foreground">Top Rated Anime</h2>
        <Button asChild>
          <Link to="/top-rated">See All</Link>
        </Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4">
        {topRatedAnime?.map((anime) => (
          <AnimeCard
            key={anime.mal_id}
            title={anime.title}
            imageUrl={anime.images.jpg.large_image_url}
            hreflink={`/anime/${anime.mal_id}`}
            score={anime.score}
          />
        ))}
      </div>
    </section>
  );
}
