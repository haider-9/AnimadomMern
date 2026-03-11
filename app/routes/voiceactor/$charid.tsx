import { useParams } from "react-router";
import CharacterCard from "~/components/charactercard";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "~/components/ui/skeleton";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { API_ENDPOINTS } from "~/constants";
import type { Route } from "./+types/$charid";
import { generateMeta } from "~/lib/seo";

export function meta({ params }: Route.MetaArgs) {
  return generateMeta({
    title: "Character Voice Actors",
    description: "Discover the voice actors behind your favorite anime characters. Explore the talented seiyuu who bring characters to life across different languages.",
    keywords: "voice actors, seiyuu, character voices, anime voice acting, voice cast",
    url: `/voiceactor/${params.charid}`,
    type: "profile",
    canonical: `https://animadom.vercel.app/voiceactor/${params.charid}`,
  });
}

// Fetch functions for TanStack Query
const fetchVoiceActors = async (charid: string) => {
  const [characterResponse, voicesResponse] = await Promise.all([
    fetch(`${API_ENDPOINTS.JIKAN}/characters/${charid}`),
    fetch(`${API_ENDPOINTS.JIKAN}/characters/${charid}/voices`)
  ]);

  if (!characterResponse.ok || !voicesResponse.ok) {
    throw new Error('Failed to fetch voice actor data');
  }

  const [characterData, voicesData] = await Promise.all([
    characterResponse.json(),
    voicesResponse.json()
  ]);

  return {
    characterName: characterData.data.name,
    voiceActors: voicesData.data
  };
};

export default function VoiceActorPage() {
  const { charid } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["voice-actors", charid],
    queryFn: () => fetchVoiceActors(charid!),
    enabled: !!charid,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const characterName = data?.characterName || "";
  const voiceActors = data?.voiceActors || [];

  if (isLoading) {
    return (
      <div className="min-h-screen p-4">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-80 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>Failed to load voice actor data. Please try again.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <title>{`AnimaDom | Voice Actors of ${characterName}`}</title>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">
          Voice Actors for {characterName}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
          {voiceActors.map((actor: any) => (
            <CharacterCard
              key={actor.person.mal_id}
              imageUrl={actor.person.images.jpg.image_url}
              name={actor.person.name}
              role={actor.language}
              animeAppearances={0}
              hreflink={`/people/${actor.person.mal_id}`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
