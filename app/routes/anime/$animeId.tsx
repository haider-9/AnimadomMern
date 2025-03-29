import { motion, AnimatePresence } from "framer-motion";
import { FaRegStar, FaPlay, FaFilm } from "react-icons/fa";
import { Link } from "react-router";
import AnimeCard from "~/components/animecard";
import type { Route } from "./+types/$animeId";
import CharacterCard from "~/components/charactercard";
import { useState } from "react";
import Loading from "~/components/loader";
import { Button } from "~/components/ui/button";

export async function clientLoader({
  params: { animeId },
}: Route.ClientLoaderArgs) {
  const fetchJikanData = async () => {
    const responses = await Promise.all([
      fetch(`https://api.jikan.moe/v4/anime/${animeId}`),
      fetch(`https://api.jikan.moe/v4/anime/${animeId}/characters`),
      fetch(`https://api.jikan.moe/v4/anime/${animeId}/recommendations`),
    ]);

    const [animeResponse, charsResponse, recsResponse] = await Promise.all(
      responses.map((res) => res.json())
    );

    return {
      animeData: animeResponse.data,
      characters: charsResponse.data,
      recommendations: recsResponse.data,
    };
  };
  const fetchKitsuData = async (title: string) => {
    const encodedTitle = encodeURIComponent(title);
    const response = await fetch(
      `https://kitsu.io/api/edge/anime?filter[text]=${encodedTitle}`
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
          }
        }
      `;

    const response = await fetch("https://graphql.anilist.co", {
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

export const HydrateFallback = () => <Loading />;

export default function AnimeDescription({
  loaderData,
  params: { animeId },
}: Route.ComponentProps) {
  const { animeData, characters, recommendations, animeDetails, kitsuData } =
    loaderData;
  const [isGalleryExpanded, setIsGalleryExpanded] = useState(false);

  const { episodes, genres, score, synopsis, title, title_english, type } =
    animeData;
  const { endDate, nextEpisode, startDate, studios } = animeDetails;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <head>
          <title>{`Animadom | ${title_english}`}</title>
          <meta
            name="keywords"
            content={genres?.map((genre) => genre.name).join(", ")}
          />
          <meta name="author" content="AnimaDom" />
          <meta property="og:title" content={title_english || title} />
          <meta
            property="og:description"
            content={synopsis || "No description available"}
          />
          <meta
            property="og:image"
            content={animeDetails.posterImage || "/poster404.jpg"}
          />
          <meta
            property="og:url"
            content={`https://animadom.vercel.app/anime/${animeId}`}
          />
          <meta property="og:type" content="website" />
        </head>

        <div className="relative h-[50vh] md:h-[70vh] overflow-hidden">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            src={animeDetails.coverImage || "/banner404.jpg"}
            alt={title_english || title}
            className="absolute w-full h-full object-cover"
            style={{ filter: "brightness(0.6)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background" />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
            <div className="container mx-auto flex flex-row gap-4 md:gap-8">
              <motion.img
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                src={animeDetails.posterImage || "/poster404.jpg"}
                alt={title_english || title}
                className="w-32 h-48 md:w-48 md:h-72 rounded-xl shadow-2xl object-cover"
              />
              <div className="flex flex-col justify-end">
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 text-foreground"
                >
                  {title_english || title}
                </motion.h1>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap gap-2 mb-4 md:mb-6"
                >
                  {genres.map((genre: any) => (
                    <Link key={genre.mal_id} to={`/genre/${genre.name}`}>
                      <span className="px-2 md:px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs md:text-sm hover:bg-primary/80 transition-colors duration-300">
                        {genre.name}
                      </span>
                    </Link>
                  ))}
                </motion.div>
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
                <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-6 hover:bg-card/80 transition-all duration-300 border border-border">
                  <div className="flex flex-col items-center gap-3">
                    <FaRegStar className="text-chart-3 text-2xl" />
                    <div className="text-center">
                      <span className="text-2xl font-bold text-foreground">
                        {score}
                      </span>
                      <span className="text-muted-foreground text-sm">/10</span>
                    </div>
                  </div>
                </div>

                <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-6 hover:bg-card/80 transition-all duration-300 border border-border">
                  <div className="flex flex-col items-center gap-3">
                    <FaFilm className="text-chart-1 text-2xl" />
                    <div className="text-center">
                      <span className="text-xl font-medium text-foreground">
                        {type}
                      </span>
                      <span className="text-muted-foreground text-sm block">
                        Type
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Studios
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {studios?.map(
                        (
                          studio: { name: string; isAnimationStudio: boolean },
                          index: number
                        ) => (
                          <Link
                            to={`/studio/${studio.name}`}
                            key={index}
                            className={`text-sm px-4 py-2 rounded-xl transition-all duration-300 ${
                              studio.isAnimationStudio
                                ? "bg-primary/30 text-primary-foreground border border-primary/40 hover:bg-primary/40"
                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            }`}
                          >
                            {studio.name}
                          </Link>
                        )
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Broadcast
                    </h3>
                    <div className="space-y-4">
                      {/* Start Date */}
                      <div className="flex items-center gap-3 bg-secondary p-4 rounded-xl">
                        <span className="text-muted-foreground">Started:</span>
                        <span className="font-medium text-foreground">
                          {startDate?.year
                            ? `${startDate.year}/${startDate.month}/${startDate.day}`
                            : "Unknown"}
                        </span>
                      </div>

                      {/* Next Episode */}
                      {nextEpisode && (
                        <div className="flex items-center gap-3 bg-accent/20 p-4 rounded-xl">
                          <span className="text-accent-foreground">
                            Next Episode {nextEpisode.episode}:
                          </span>
                          <span className="text-accent-foreground font-medium">
                            {Math.floor(nextEpisode.timeUntilAiring / 86400)}{" "}
                            days
                          </span>
                        </div>
                      )}

                      {/* End Date */}
                      <div className="flex items-center gap-3 bg-secondary p-4 rounded-xl">
                        <span className="text-muted-foreground">Ended:</span>
                        <span className="font-medium text-foreground">
                          {endDate?.year
                            ? `${endDate.year}/${endDate.month}/${endDate.day}`
                            : "Ongoing"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card backdrop-blur-xl rounded-3xl p-8 border border-border"
              >
                <h2 className="text-2xl font-semibold mb-4 text-foreground">
                  Synopsis
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {synopsis}
                </p>
              </motion.section>

              <section className="mb-12">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-foreground">
                    Main Characters
                  </h2>
                  <Link to={`/morecharacters/${animeId}`}>
                    <Button variant="outline" className="text-foreground">
                      View All Characters
                    </Button>
                  </Link>
                </div>
                <div className="flex flex-wrap justify-center items-center gap-4">
                  {characters
                    ?.filter((char) => char.role === "Main")
                    ?.map((char: any) => (
                      <CharacterCard
                        hreflink={`/character/${char.character.mal_id}`}
                        name={char.character.name}
                        imageUrl={char.character.images.jpg.image_url}
                        role={char.role}
                        animeAppearances={char.voice_actors.length}
                      />
                    ))}
                </div>
              </section>

              <section className="mb-12">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-foreground">
                    Similar Anime
                  </h2>
                </div>
                <div className="flex flex-wrap w-full justify-center gap-4 mx-auto">
                  {recommendations?.slice(0, 15)?.map(({ entry }) => (
                    <AnimeCard
                      key={entry.mal_id}
                      imageUrl={entry.images?.webp?.image_url}
                      title={entry.title}
                      hreflink={`/anime/${entry.mal_id}`}
                    />
                  ))}
                </div>
              </section>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-4 sticky mt-8">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-card backdrop-blur-xl rounded-2xl p-6 border border-border shadow-xl"
                >
                  <h2 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
                    <span>Tags</span>
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {animeDetails?.tags
                      ?.slice(0, 12)
                      .map((tag: { name: string }, index: number) => (
                        <Link to={`/genre/${tag.name}`} key={index}>
                          <motion.span
                            whileHover={{
                              backgroundColor: "var(--color-primary/0.2)",
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-block px-4 py-2 text-sm bg-secondary text-secondary-foreground 
                              rounded-xl border border-border hover:border-primary/30 
                              transition-colors duration-300 cursor-pointer shadow-lg"
                          >
                            {tag.name}
                          </motion.span>
                        </Link>
                      ))}
                  </div>
                </motion.div>

                {/* Reviews Preview */}
                {animeDetails?.reviews?.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-card backdrop-blur-xl rounded-2xl p-6 border border-border shadow-xl"
                  >
                    <h2 className="text-xl font-semibold mb-4 text-foreground">
                      Latest Reviews
                    </h2>
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
                                      : "text-muted"
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
                  </motion.div>
                )}

                {/* Gallery Section */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-card backdrop-blur-xl rounded-2xl p-6 border border-border shadow-xl mt-4"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-foreground">
                      Gallery
                    </h2>
                    <button
                      onClick={() => setIsGalleryExpanded(!isGalleryExpanded)}
                      className="text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      {isGalleryExpanded ? "Show Less" : "Show More"}
                    </button>
                  </div>
                  <div
                    className={`grid gap-2 ${
                      isGalleryExpanded ? "grid-cols-3" : "grid-cols-2"
                    }`}
                  >
                    {kitsuData?.attributes?.posterImage &&
                      [
                        kitsuData.attributes.posterImage.original,
                        kitsuData.attributes.posterImage.large,
                        kitsuData.attributes.posterImage.medium,
                        kitsuData.attributes.coverImage?.original,
                        kitsuData.attributes.coverImage?.large,
                        kitsuData.attributes.coverImage?.small,
                      ]
                        .filter(Boolean)
                        .slice(0, isGalleryExpanded ? 15 : 4)
                        .map((imageUrl, index) => (
                          <motion.img
                            key={index}
                            src={imageUrl}
                            alt={`Gallery ${index + 1}`}
                            className={`rounded-lg w-full ${
                              isGalleryExpanded ? "h-32" : "h-24"
                            } object-cover hover:opacity-80 transition-opacity cursor-pointer`}
                            layoutId={`gallery-image-${index}`}
                            whileHover={{ scale: 1.02 }}
                          />
                        ))}
                  </div>
                </motion.div>

                {/* Additional Info */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-card backdrop-blur-xl rounded-2xl p-6 border border-border shadow-xl mt-4"
                >
                  <h2 className="text-xl font-semibold mb-4 text-foreground">
                    Additional Info
                  </h2>
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
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
