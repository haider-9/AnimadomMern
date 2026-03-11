
import { FaRegStar, FaFilm } from "react-icons/fa";
import { LuDownload, LuExternalLink, LuImage, LuX, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { Link } from "react-router";
import AnimeCard from "~/components/animecard";
import type { Route } from "./+types/$animeId";
import CharacterCard from "~/components/charactercard";
import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { API_ENDPOINTS, APP_CONFIG } from "~/constants";
import { generateMeta, generateStructuredData, createAnimeSchema, createBreadcrumbSchema } from "~/lib/seo";

export async function clientLoader({
  params: { animeId },
}: Route.ClientLoaderArgs) {
  const fetchJikanData = async () => {
    const responses = await Promise.all([
      fetch(`${API_ENDPOINTS.JIKAN}/anime/${animeId}`),
      fetch(`${API_ENDPOINTS.JIKAN}/anime/${animeId}/characters`),
      fetch(`${API_ENDPOINTS.JIKAN}/anime/${animeId}/recommendations`),
      fetch(`${API_ENDPOINTS.JIKAN}/anime/${animeId}/pictures`), // Fetch anime pictures
    ]);

    const [animeResponse, charsResponse, recsResponse, picturesResponse] = await Promise.all(
      responses.map((res) => res.json())
    );

    return {
      animeData: animeResponse.data,
      characters: charsResponse.data,
      recommendations: recsResponse.data,
      pictures: picturesResponse.data || [], // Jikan pictures endpoint
    };
  };
  const fetchKitsuData = async (title: string) => {
    const encodedTitle = encodeURIComponent(title);
    const response = await fetch(
      `${API_ENDPOINTS.KITSU}/anime?filter[text]=${encodedTitle}`
    );
    const data = await response.json();
    return data.data[0];
  };

  const fetchAniListData = async (malId: string) => {
    const query = `
        query ($idMal: Int) {
          Media(idMal: $idMal, type: ANIME) {
            coverImage {
              extraLarge
              large
              medium
            }
            bannerImage
            startDate {
              year
              month
              day
            }
            endDate {
              year
              month
              day
            }
            nextAiringEpisode {
              airingAt
              timeUntilAiring
              episode
            }
            reviews {
              nodes {
                summary
                score
                rating
              }
            }
            trailer {
              id
              site
              thumbnail
            }
            tags {
              name
              rank
            }
            studios {
              nodes {
                name
                isAnimationStudio
              }
            }
            characters {
              nodes {
                image {
                  large
                  medium
                }
              }
            }
          }
        }
      `;

    const response = await fetch(API_ENDPOINTS.ANILIST, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        variables: { idMal: parseInt(malId) },
      }),
    });

    const { data } = await response.json();
    const media = data?.Media;

    return {
      coverImage: media?.bannerImage || "",
      posterImage:
        media?.coverImage?.extraLarge || media?.coverImage?.large || "",
      startDate: media?.startDate || { year: null, month: null, day: null },
      endDate: media?.endDate || { year: null, month: null, day: null },
      nextEpisode: media?.nextAiringEpisode
        ? {
            episode: media.nextAiringEpisode.episode,
            timeUntilAiring: media.nextAiringEpisode.timeUntilAiring,
          }
        : null,
      reviews: media?.reviews?.nodes || [],
      trailer: media?.trailer || null,
      tags: media?.tags || [],
      studios: media?.studios?.nodes || [],
      characterImages: media?.characters?.nodes?.map((char: any) => char.image?.large || char.image?.medium).filter(Boolean) || [],
      additionalCoverImages: [
        media?.coverImage?.extraLarge,
        media?.coverImage?.large,
        media?.coverImage?.medium,
      ].filter(Boolean),
    };
  };

  const jikanData = await fetchJikanData();
  const anilistData = await fetchAniListData(animeId);
  const kitsuData = await fetchKitsuData(
    jikanData.animeData.title_english || jikanData.animeData.title
  );
  return {
    animeId,
    ...jikanData,
    animeDetails: anilistData,
    kitsuData,
  };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data?.animeData) {
    return generateMeta({
      title: "Anime Not Found",
      description: "The requested anime could not be found.",
      noIndex: true,
    });
  }

  const { animeData, animeDetails } = data;
  const title = animeData.title_english || animeData.title;
  const description = animeData.synopsis || "No description available";
  const image = animeDetails?.posterImage || animeData.images?.jpg?.large_image_url;
  const genres = animeData.genres?.map((g: any) => g.name).join(", ");

  const seoMeta = generateMeta({
    title,
    description,
    keywords: `${title}, anime, ${genres}, ${animeData.type}, ${animeData.status}`,
    image,
    url: `/anime/${data.animeId}`,
    type: "article",
    canonical: `${APP_CONFIG.URL}/anime/${data.animeId}`,
  });

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Anime", url: "/collections" },
    { name: title, url: `/anime/${data.animeId}` },
  ]);

  const animeSchema = createAnimeSchema(animeData);

  return [
    ...seoMeta,
    generateStructuredData(breadcrumbSchema),
    generateStructuredData(animeSchema),
  ];
}

export const HydrateFallback = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="relative h-[50vh] md:h-[70vh] overflow-hidden rounded-lg mb-8">
      <Skeleton className="w-full h-full" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <Skeleton className="h-48 w-full" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
      <div className="lg:col-span-1">
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  </div>
);

export default function AnimeDescription({
  loaderData,
  params: { animeId },
}: Route.ComponentProps) {
  const { animeData, characters, recommendations, animeDetails, kitsuData, pictures } =
    loaderData;
  const [isGalleryExpanded, setIsGalleryExpanded] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { genres, score, synopsis, title, title_english, type } = animeData;
  const { endDate, nextEpisode, startDate, studios, characterImages, additionalCoverImages } = animeDetails;

  // Collect all available images from different sources
  const getAllImages = () => {
    const images: string[] = [];
    
    // Jikan pictures (from /anime/{id}/pictures endpoint)
    if (pictures && pictures.length > 0) {
      pictures.forEach((pic: any) => {
        if (pic.jpg?.large_image_url) images.push(pic.jpg.large_image_url);
        if (pic.jpg?.image_url) images.push(pic.jpg.image_url);
        if (pic.webp?.large_image_url) images.push(pic.webp.large_image_url);
        if (pic.webp?.image_url) images.push(pic.webp.image_url);
      });
    }

    // AniList additional cover images
    if (additionalCoverImages) {
      images.push(...additionalCoverImages);
    }

    // AniList character images
    if (characterImages) {
      images.push(...characterImages);
    }

    // Kitsu images
    if (kitsuData?.attributes?.posterImage) {
      const kitsuImages = [
        kitsuData.attributes.posterImage.original,
        kitsuData.attributes.posterImage.large,
        kitsuData.attributes.posterImage.medium,
        kitsuData.attributes.coverImage?.original,
        kitsuData.attributes.coverImage?.large,
        kitsuData.attributes.coverImage?.small,
      ].filter(Boolean);
      images.push(...kitsuImages);
    }

    // Remove duplicates and filter out invalid URLs
    return [...new Set(images)].filter(url => url && url.startsWith('http'));
  };

  const allImages = getAllImages();

  const openImageModal = (imageUrl: string, index: number) => {
    setSelectedImage(imageUrl);
    setCurrentImageIndex(index);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? (currentImageIndex - 1 + allImages.length) % allImages.length
      : (currentImageIndex + 1) % allImages.length;
    
    setCurrentImageIndex(newIndex);
    setSelectedImage(allImages[newIndex]);
  };

  const downloadImage = async (imageUrl: string) => {
    try {
      // For external images, we need to handle CORS differently
      const a = document.createElement('a');
      a.href = imageUrl;
      a.download = `${(title_english || title).replace(/[^a-z0-9]/gi, '_').toLowerCase()}-image-${Date.now()}.jpg`;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
      // Fallback: open in new tab
      window.open(imageUrl, '_blank');
    }
  };

  // Keyboard navigation for image modal
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!selectedImage) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          navigateImage('prev');
          break;
        case 'ArrowRight':
          event.preventDefault();
          navigateImage('next');
          break;
        case 'Escape':
          event.preventDefault();
          setSelectedImage(null);
          break;
      }
    };

    if (selectedImage) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [selectedImage, currentImageIndex, allImages.length]);
  return (
    <div>
        <div className="relative h-[50vh] md:h-[70vh] overflow-hidden">
          <img
            src={animeDetails.coverImage || "/banner404.jpg"}
            alt={title_english || title}
            className="absolute w-full h-full object-cover brightness-[0.6]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background" />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
            <div className="container mx-auto flex flex-row gap-4 md:gap-8">
              <img
                src={animeDetails.posterImage || "/poster404.jpg"}
                alt={title_english || title}
                className="w-32 h-48 md:w-48 md:h-72 rounded-xl shadow-2xl object-cover"
              />
              <div className="flex flex-col justify-end">
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 text-foreground">
                  {title_english || title}
                </h1>
                <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
                  {genres.map((genre: any) => (
                    <Badge key={genre.mal_id} variant="secondary" asChild>
                      <Link to={`/genre/${genre.name}`} className="hover:bg-primary/80 transition-colors">
                        {genre.name}
                      </Link>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Column */}
            <div className="lg:col-span-2 mt-8 space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Card className="hover:bg-card/80 p-0 transition-colors">
                  <CardContent className="flex flex-col items-center gap-3 p-6">
                    <FaRegStar className="text-chart-3 text-2xl" />
                    <div className="text-center">
                      <span className="text-2xl font-bold text-foreground">
                        {score}
                      </span>
                      <span className="text-muted-foreground text-sm">/10</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:bg-card/80 p-0 transition-colors">
                  <CardContent className="flex flex-col items-center gap-3 p-6">
                    <FaFilm className="text-chart-1 text-2xl" />
                    <div className="text-center">
                      <span className="text-xl font-medium text-foreground">
                        {type}
                      </span>
                      <span className="text-muted-foreground text-sm block">
                        Type
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="mb-8">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <CardTitle className="text-lg">Studios</CardTitle>
                      <div className="flex flex-wrap gap-3">
                        {studios?.map(
                          (
                            studio: { name: string; isAnimationStudio: boolean },
                            index: number
                          ) => (
                            <Badge
                              key={index}
                              variant={studio.isAnimationStudio ? "default" : "secondary"}
                              asChild
                            >
                              <Link to={`/studio/${studio.name}`}>
                                {studio.name}
                              </Link>
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <CardTitle className="text-lg">Broadcast</CardTitle>
                      <div className="space-y-4">
                        <Card className="p-0">
                          <CardContent className="flex items-center justify-between p-4">
                            <span className="text-muted-foreground">Started:</span>
                            <span className="font-medium">
                              {startDate?.year
                                ? `${startDate.year}/${startDate.month}/${startDate.day}`
                                : "Unknown"}
                            </span>
                          </CardContent>
                        </Card>

                        {nextEpisode && (
                          <Card className="p-0">
                            <CardContent className="flex items-center justify-between p-4">
                              <span className="text-muted-foreground">
                                Next Episode {nextEpisode.episode}:
                              </span>
                              <span className="font-medium">
                                {Math.floor(nextEpisode.timeUntilAiring / 86400)} days
                              </span>
                            </CardContent>
                          </Card>
                        )}

                        <Card className="p-0">
                          <CardContent className="flex items-center justify-between p-4">
                            <span className="text-muted-foreground">Ended:</span>
                            <span className="font-medium">
                              {endDate?.year
                                ? `${endDate.year}/${endDate.month}/${endDate.day}`
                                : "Ongoing"}
                            </span>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Synopsis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {synopsis}
                  </p>
                </CardContent>
              </Card>

              <section className="mb-12">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-foreground">
                    Main Characters
                  </h2>
                  <Link to={`/morecharacters/${animeId}`}>
                    <Button variant="outline">
                      View All Characters
                    </Button>
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {characters
                    ?.filter((char: { role: string; }) => char.role === "Main")
                    ?.map((char: any) => (
                      <CharacterCard
                        key={char.character.mal_id}
                        hreflink={`/character/${char.character.mal_id}`}
                        name={char.character.name}
                        imageUrl={char.character.images.jpg.image_url}
                        role={char.role}
                        animeAppearances={char.voice_actors.length}
                        popularity={char.character.mal_id}
                        favorites={char.character.favorites}
                      />
                    ))}
                </div>
              </section>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-4 sticky mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {animeDetails?.tags
                        ?.slice(0, 12)
                        .map((tag: { name: string }, index: number) => (
                          <Badge key={index} variant="outline" asChild>
                            <Link to={`/genre/${tag.name}`}>
                              {tag.name}
                            </Link>
                          </Badge>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                {animeDetails?.reviews?.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Latest Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {animeDetails.reviews
                        .slice(0, 2)
                        .map(
                          (
                            review: { score: number; summary: string },
                            index: number
                          ) => (
                            <div key={index} className="mb-4 last:mb-0">
                              <div className="flex items-center gap-2 mb-2">
                                {[...Array(5)].map((_, i) => (
                                  <FaRegStar
                                    key={i}
                                    className={
                                      i < review.score / 20
                                        ? "text-chart-3"
                                        : "text-muted-foreground"
                                    }
                                  />
                                ))}
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {review.summary}
                              </p>
                            </div>
                          )
                        )}
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-2">
                        <LuImage className="w-5 h-5" />
                        Gallery
                        <Badge variant="secondary" className="ml-2">
                          {allImages.length}
                        </Badge>
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsGalleryExpanded(!isGalleryExpanded)}
                      >
                        {isGalleryExpanded ? "Show Less" : "Show More"}
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {/* Images Grid */}
                    {allImages.length > 0 ? (
                      <div className={`grid gap-3 ${isGalleryExpanded ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-2 md:grid-cols-3"}`}>
                        {allImages
                          .slice(0, isGalleryExpanded ? 24 : 6)
                          .map((imageUrl, index) => (
                            <div
                              key={index}
                              className="relative group cursor-pointer overflow-hidden rounded-lg aspect-square"
                              onClick={() => openImageModal(imageUrl, index)}
                            >
                              <img
                                src={imageUrl}
                                alt={`${title_english || title} gallery ${index + 1}`}
                                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                                loading="lazy"
                                onError={(e) => {
                                  // Hide broken images
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                              {/* Desktop hover overlay */}
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center max-md:hidden">
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    className="backdrop-blur-sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      downloadImage(imageUrl);
                                    }}
                                  >
                                    <LuDownload className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    className="backdrop-blur-sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(imageUrl, '_blank');
                                    }}
                                  >
                                    <LuExternalLink className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              {/* Mobile tap indicator */}
                              <div className="absolute bottom-2 right-2 md:hidden bg-black/60 backdrop-blur-sm rounded-full p-1">
                                <LuImage className="w-3 h-3 text-white" />
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <LuImage className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No additional images available</p>
                        <p className="text-sm">Images from Jikan, AniList, and Kitsu APIs</p>
                      </div>
                    )}

                    {/* Show more images indicator */}
                    {allImages.length > (isGalleryExpanded ? 24 : 6) && (
                      <div className="text-center mt-4">
                        <Badge variant="outline">
                          +{allImages.length - (isGalleryExpanded ? 24 : 6)} more images
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Image Modal Dialog */}
                <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
                  <DialogContent className="max-w-6xl w-full h-[90vh] p-0 border-0 bg-gradient-to-br from-background/95 via-muted/90 to-background/95 backdrop-blur-xl">
                    <DialogHeader className="absolute top-4 left-4 z-20">
                      <DialogTitle className="text-foreground bg-background/70 backdrop-blur-md px-4 py-2 rounded-lg shadow-lg border border-border/50">
                        {title_english || title} - Image {currentImageIndex + 1} of {allImages.length}
                      </DialogTitle>
                    </DialogHeader>
                    
                    <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-background via-muted/50 to-background">
                      {selectedImage && (
                        <img
                          src={selectedImage}
                          alt={`${title_english || title} gallery image`}
                          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                          style={{ maxHeight: 'calc(90vh - 100px)' }}
                        />
                      )}
                      
                      {/* Navigation Buttons */}
                      {allImages.length > 1 && (
                        <>
                          <Button
                            variant="secondary"
                            size="icon"
                            className="absolute left-6 top-1/2 transform -translate-y-1/2 backdrop-blur-md bg-background/50 hover:bg-background/70 border-border/20 h-12 w-12 rounded-full shadow-xl"
                            onClick={() => navigateImage('prev')}
                          >
                            <LuChevronLeft className="w-6 h-6 text-foreground" />
                          </Button>
                          <Button
                            variant="secondary"
                            size="icon"
                            className="absolute right-6 top-1/2 transform -translate-y-1/2 backdrop-blur-md bg-background/50 hover:bg-background/70 border-border/20 h-12 w-12 rounded-full shadow-xl"
                            onClick={() => navigateImage('next')}
                          >
                            <LuChevronRight className="w-6 h-6 text-foreground" />
                          </Button>
                        </>
                      )}
                      
                      {/* Close Button */}
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-4 right-4 backdrop-blur-md bg-background/50 hover:bg-background/70 border-border/20 h-10 w-10 rounded-full shadow-xl z-20"
                        onClick={() => setSelectedImage(null)}
                      >
                        <LuX className="w-5 h-5 text-foreground" />
                      </Button>
                      
                      {/* Action Buttons */}
                      <div className="absolute bottom-6 right-6 flex gap-3 z-20">
                        <Button
                          variant="secondary"
                          className="backdrop-blur-md bg-background/50 hover:bg-background/70 border-border/20 text-foreground shadow-xl"
                          onClick={() => selectedImage && downloadImage(selectedImage)}
                        >
                          <LuDownload className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button
                          variant="secondary"
                          className="backdrop-blur-md bg-background/50 hover:bg-background/70 border-border/20 text-foreground shadow-xl"
                          onClick={() => selectedImage && window.open(selectedImage, '_blank')}
                        >
                          <LuExternalLink className="w-4 h-4 mr-2" />
                          Open
                        </Button>
                      </div>

                      {/* Image Counter Indicator */}
                      {allImages.length > 1 && (
                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
                          <div className="flex gap-1">
                            {allImages.slice(Math.max(0, currentImageIndex - 2), currentImageIndex + 3).map((_, index) => {
                              const actualIndex = Math.max(0, currentImageIndex - 2) + index;
                              return (
                                <div
                                  key={actualIndex}
                                  className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                                    actualIndex === currentImageIndex 
                                      ? 'bg-primary scale-125' 
                                      : 'bg-muted-foreground/40 hover:bg-muted-foreground/60'
                                  }`}
                                  onClick={() => {
                                    setCurrentImageIndex(actualIndex);
                                    setSelectedImage(allImages[actualIndex]);
                                  }}
                                />
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Keyboard Navigation Hint */}
                      <div className="absolute bottom-6 left-6 z-20">
                        <div className="text-muted-foreground text-sm backdrop-blur-md bg-background/30 px-3 py-1 rounded border border-border/30">
                          Use ← → keys to navigate
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Card>
                  <CardHeader>
                    <CardTitle>Additional Info</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Age Rating</span>
                        <span className="text-foreground">
                          {kitsuData?.attributes?.ageRating}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Popularity Rank
                        </span>
                        <span className="text-foreground">
                          #{kitsuData?.attributes?.popularityRank}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rating Rank</span>
                        <span className="text-foreground">
                          #{kitsuData?.attributes?.ratingRank}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Full Width Similar Anime Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <section className="mb-12">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-foreground">
                Similar Anime
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {recommendations?.slice(0, 30)?.map(({ entry }: { entry: any }) => (
                <AnimeCard
                  key={entry.mal_id}
                  imageUrl={entry.images?.webp?.image_url}
                  title={entry.title}
                  hreflink={`/anime/${entry.mal_id}`}
                  score={entry.score}
                  year={entry.year}
                  episodes={entry.episodes}
                  status={entry.status}
                  genres={entry.genres?.map((g: any) => g.name) || []}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
  );
}
