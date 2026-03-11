import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  FaHeart,
  FaMicrophone,
  FaStar,
  FaUser,
  FaClock,
  FaCaretUp,
  FaCaretDown,
  FaCakeCandles,
} from "react-icons/fa6";
import type { Route } from "./+types/$charid";
import { Skeleton } from "~/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS, APP_CONFIG } from "~/constants";
import { generateMeta, generateStructuredData, createCharacterSchema, createBreadcrumbSchema } from "~/lib/seo";

interface CharacterData {
  id: number;
  name: {
    full: string;
    native: string;
  };
  description: string;
  image: {
    large: string;
  };
  gender: string;
  dateOfBirth: {
    year: number | null;
    month: number | null;
    day: number | null;
  };
  age: string;
  favourites: number;
  media: {
    nodes: Array<{
      idMal: number;
      title: {
        english: string;
        romaji: string;
      };
      coverImage: {
        large: string;
      };
      bannerImage: string;
      averageScore: number;
      type: string;
    }>;
  };
}
interface GalleryImage {
  jpg: {
    image_url: string;
  };
}

// Fetch functions for TanStack Query
const fetchMalCharacter = async (charid: string) => {
  const response = await fetch(`${API_ENDPOINTS.JIKAN}/characters/${charid}`);
  if (!response.ok) throw new Error('Failed to fetch MAL character');
  const data = await response.json();
  return data.data;
};

const fetchAnilistCharacter = async (anilistId: number) => {
  const query = `
    query ($id: Int) {
      Character(id: $id) {
        id
        name {
          full
          native
        }
        description(asHtml: true)
        image {
          large
        }
        gender
        dateOfBirth {
          year
          month
          day
        }
        age
        favourites
        media(sort: POPULARITY_DESC, perPage: 30) {
          nodes {
            idMal
            title {
              english
              romaji
            }
            coverImage {
              large
            }
            bannerImage
            averageScore
            type
          }
        }
      }
    }`;

  const response = await fetch(API_ENDPOINTS.ANILIST, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      variables: { id: anilistId },
    }),
  });

  if (!response.ok) throw new Error('Failed to fetch Anilist character');
  const { data } = await response.json();
  return data?.Character;
};

const fetchCharacterGallery = async (charid: string) => {
  const response = await fetch(`${API_ENDPOINTS.JIKAN}/characters/${charid}/pictures`);
  if (!response.ok) throw new Error('Failed to fetch character gallery');
  const data = await response.json();
  return data.data;
};

export function meta({ params }: Route.MetaArgs) {
  // Since this is a client-side route, we'll provide basic meta tags
  // The actual character data will be loaded client-side
  return generateMeta({
    title: "Character Details",
    description: "Discover detailed information about your favorite anime character, including appearances, voice actors, and more.",
    keywords: "anime character, character details, anime, voice actor, seiyuu",
    url: `/character/${params.charid}`,
    type: "profile",
    canonical: `${APP_CONFIG.URL}/character/${params.charid}`,
  });
}

export default function CharacterDetails({ params }: Route.ComponentProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGalleryExpanded, setIsGalleryExpanded] = useState(false);
  const [anilistId, setAnilistId] = useState<number | null>(null);
  const [bannerImage, setBannerImage] = useState("");

  // Query for MAL character data
  const { data: malCharacter } = useQuery({
    queryKey: ["mal-character", params.charid],
    queryFn: () => fetchMalCharacter(params.charid),
    enabled: !!params.charid,
  });

  // Query for Anilist character data
  const { data: characterData, isLoading, error } = useQuery({
    queryKey: ["anilist-character", anilistId],
    queryFn: () => fetchAnilistCharacter(anilistId!),
    enabled: !!anilistId,
  });

  // Query for character gallery
  const { data: galleryImages = [] } = useQuery({
    queryKey: ["character-gallery", params.charid],
    queryFn: () => fetchCharacterGallery(params.charid),
    enabled: !!params.charid,
  });

  // Set anilistId when MAL character is loaded
  useEffect(() => {
    if (malCharacter) {
      // For now, use MAL ID as fallback for Anilist ID
      // In a real app, you'd have a proper mapping
      setAnilistId(parseInt(params.charid));
    }
  }, [malCharacter, params.charid]);

  // Set banner image when character data is loaded
  useEffect(() => {
    if (characterData?.media?.nodes) {
      const mediaWithImages = characterData.media.nodes.filter(
        (media: any) => media.bannerImage || media.coverImage.large
      );
      if (mediaWithImages.length > 0) {
        const randomIndex = Math.floor(Math.random() * mediaWithImages.length);
        setBannerImage(
          mediaWithImages[randomIndex].bannerImage ||
            mediaWithImages[randomIndex].coverImage.large
        );
      }
    }
  }, [characterData]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="relative h-[40vmin] overflow-hidden rounded-lg mb-8">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="md:col-span-2 space-y-8">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !characterData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>
            {error ? "Failed to load character data" : "Character not found"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <div className="theme-transition">
        {/* Hero Section */}
        <div className="relative h-[40vmin] overflow-hidden">
          <img
            src={bannerImage || characterData.image.large}
            alt={characterData.name.full}
            className="absolute w-full h-full object-cover object-center brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background" />
        </div>

        <div className="container mx-auto px-4 -mt-10 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - Character Profile */}
            <div className="md:col-span-1">
              <Card className="bg-card/40 backdrop-blur-xl p-6 h-full">
                <div className="flex flex-col md:flex-col gap-6">
                  <img
                    src={characterData.image.large}
                    alt={characterData.name.full}
                    className="rounded-xl shadow-xl w-full md:w-full max-w-[300px] object-cover object-center mx-auto"
                  />

                  <div className="space-y-4 flex-1">
                    <div>
                      <h1 className="text-2xl font-bold">
                        {characterData.name.full}
                      </h1>
                      <p className="text-muted-foreground">
                        {characterData.name.native}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
                      <Card className="bg-primary/20 p-4">
                        <CardContent className="flex items-center gap-2 p-0">
                          <FaHeart className="text-primary text-xl" />
                          <span className="text-primary-foreground font-medium">
                            {characterData.favourites.toLocaleString()}{" "}
                            Favorites
                          </span>
                        </CardContent>
                      </Card>

                      <Link to={`/voiceactor/${characterData.id}`}>
                        <Card className="bg-secondary/20 p-4 cursor-pointer hover:bg-secondary/30 transition-all duration-300">
                          <CardContent className="flex items-center gap-2 p-0">
                            <FaMicrophone className="text-secondary-foreground text-xl" />
                            <span className="text-secondary-foreground font-medium">
                              Voice Actors
                            </span>
                          </CardContent>
                        </Card>
                      </Link>

                      {characterData.gender && (
                        <Card className="bg-muted/30 p-4">
                          <CardContent className="flex items-center gap-2 p-0">
                            <FaUser className="text-muted-foreground text-xl" />
                            <span className="font-medium">
                              {characterData.gender}
                            </span>
                          </CardContent>
                        </Card>
                      )}

                      {characterData.age && (
                        <Card className="bg-muted/30 p-4">
                          <CardContent className="flex items-center gap-2 p-0">
                            <FaClock className="text-muted-foreground text-xl" />
                            <span className="font-medium">
                              {characterData.age}
                            </span>
                          </CardContent>
                        </Card>
                      )}

                      {characterData.dateOfBirth.month && (
                        <Card className="bg-muted/30 p-4">
                          <CardContent className="flex items-center gap-2 p-0">
                            <FaCakeCandles className="text-muted-foreground text-xl" />
                            <span className="font-medium">
                              {new Intl.DateTimeFormat("en-US", {
                                day: "2-digit",
                                month: "short",
                              }).format(
                                new Date(
                                  0,
                                  characterData.dateOfBirth.month - 1,
                                  characterData.dateOfBirth?.day ?? 0
                                )
                              )}
                            </span>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column - Additional Info */}
            <div className="md:col-span-2 space-y-8">
              <Card className="bg-card/40 backdrop-blur-xl p-8">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-2xl">About</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative">
                    <div
                      className={`text-muted-foreground leading-relaxed prose prose-invert max-w-none rounded-b-xl ${
                        !isExpanded &&
                        "max-h-[400px] overflow-hidden relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-24 after:bg-gradient-to-t after:from-card after:to-transparent"
                      }`}
                      dangerouslySetInnerHTML={{
                        __html:
                          characterData.description ||
                          "No description available.",
                      }}
                    />
                    {characterData.description &&
                      characterData.description.length > 200 && (
                        <div
                          className={`absolute left-1/2 -translate-x-1/2 ${
                            !isExpanded && "-translate-y-1/2"
                          }`}
                        >
                          <Button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="mt-2 inline-flex gap-1 items-center"
                          >
                            {isExpanded ? "Read Less" : "Read More"}
                            {isExpanded ? <FaCaretUp /> : <FaCaretDown />}
                          </Button>
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-8 bg-card/40 backdrop-blur-xl p-8">
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="text-2xl">Gallery</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative">
                    <div
                      className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${
                        !isGalleryExpanded &&
                        "max-h-[600px] overflow-hidden relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-24 after:bg-gradient-to-t after:from-card after:to-transparent"
                      }`}
                    >
                      {galleryImages.map((image: GalleryImage, index: number) => (
                        <img
                          key={index}
                          src={image.jpg.image_url}
                          alt={`${characterData?.name.full} gallery image ${
                            index + 1
                          }`}
                          className="w-full h-64 object-cover rounded-xl hover:scale-105 transition-transform duration-300"
                        />
                      ))}
                    </div>
                    {galleryImages.length > 8 && (
                      <div
                        className={`absolute left-1/2 -translate-x-1/2 ${
                          !isGalleryExpanded && "-translate-y-1/2"
                        }`}
                      >
                        <Button
                          onClick={() =>
                            setIsGalleryExpanded(!isGalleryExpanded)
                          }
                          className="mt-2 inline-flex gap-1 items-center"
                        >
                          {isGalleryExpanded ? "Show Less" : "Show More"}
                          {isGalleryExpanded ? <FaCaretUp /> : <FaCaretDown />}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Full Width Appearances Section */}
          <Card className="mt-8 bg-card/40 backdrop-blur-xl p-8">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-2xl">Appearances</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {characterData.media.nodes.map((media: any) => (
                  <Link
                    to={`/anime/${media.idMal}`}
                    key={media.idMal}
                    className="block"
                  >
                    <Card className="bg-secondary/30 hover:bg-secondary/50 transition-all duration-300">
                      <CardContent className="flex items-center gap-4 p-4">
                        <img
                          src={media.coverImage.large}
                          alt={media.title.english || media.title.romaji}
                          className="w-20 h-28 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-lg line-clamp-2">
                            {media.title.english || media.title.romaji}
                          </h3>
                          <div className="flex items-center gap-2 mt-2">
                            <FaStar className="text-chart-3" />
                            <span className="text-chart-3">
                              {media.averageScore / 10}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
