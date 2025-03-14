import { useParams } from "react-router";
import { useEffect, useState } from "react";
import CharacterCard from "~/components/charactercard";
import Loader from "~/components/loader";

export default function VoiceActorPage() {
  const { charid } = useParams();
  const [voiceActors, setVoiceActors] = useState([]);
  const [characterName, setCharacterName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVoiceActors = async () => {
      try {
        // First, fetch the character info to get the name
        const characterResponse = await fetch(
          `https://api.jikan.moe/v4/characters/${charid}`
        );
        const characterData = await characterResponse.json();
        setCharacterName(characterData.data.name);

        // Then fetch the voice actors
        const response = await fetch(
          `https://api.jikan.moe/v4/characters/${charid}/voices`
        );
        const data = await response.json();
        setVoiceActors(data.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchVoiceActors();
  }, [charid]);

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <title>{`AnimaDom | Voice Actors of ${characterName}`}</title>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">
          Voice Actors for {characterName}
        </h1>
        <div className="flex flex-wrap gap-6">
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
