import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useParams } from "react-router";
import { FaHeart, FaMicrophone, FaStar, FaUser, FaBirthdayCake } from "react-icons/fa";

interface StaffData {
  id: number;
  name: {
    full: string;
    native: string;
  };
  description: string;
  image: {
    large: string;
  };
  favourites: number;
  primaryOccupations: string[];
  dateOfBirth: {
    year: number | null;
    month: number | null;
    day: number | null;
  };
  characters: {
    nodes: Array<{
      id: number;
      name: {
        full: string;
      };
      image: {
        large: string;
      };
      media: {
        nodes: Array<{
          id: number;
          title: {
            english: string;
            romaji: string;
          };
          coverImage: {
            large: string;
          };
        }>;
      };
    }>;
  };
  staffMedia: {
    nodes: Array<{
      id: number;
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

export default function StaffDetails() {
  const params = useParams();
  const [staffData, setStaffData] = useState<StaffData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'characters' | 'media'>('characters');
  const [bannerImage, setBannerImage] = useState<string>("");

  useEffect(() => {
    const fetchStaffData = async () => {
      const query = `
        query ($id: Int) {
          Staff(id: $id) {
            id
            name {
              full
              native
            }
            description(asHtml: true)
            image {
              large
            }
            primaryOccupations
            favourites
            dateOfBirth {
              year
              month
              day
            }
            characters(sort: FAVOURITES_DESC, perPage: 12) {
              nodes {
                id
                name {
                  full
                }
                image {
                  large
                }
                media(perPage: 1) {
                  nodes {
                    id
                    title {
                      english
                      romaji
                    }
                    coverImage {
                      large
                    }
                  }
                }
              }
            }
            staffMedia(sort: POPULARITY_DESC, perPage: 12) {
              nodes {
                id
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
        }
      `;

      try {
        const response = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query,
            variables: { id: parseInt(params.id) },
          }),
        });

        const { data } = await response.json();
        setStaffData(data.Staff);
        
        // Set random banner image from media
        if (data.Staff?.staffMedia?.nodes) {
          const mediaWithBanners = data.Staff.staffMedia.nodes.filter(
            (media) => media.bannerImage || media.coverImage.large
          );
          if (mediaWithBanners.length > 0) {
            const randomMedia = mediaWithBanners[Math.floor(Math.random() * mediaWithBanners.length)];
            setBannerImage(randomMedia.bannerImage || randomMedia.coverImage.large);
          }
        }
      } catch (error) {
        console.error("Error fetching staff data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchStaffData();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!staffData) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="relative h-[40vh] overflow-hidden">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            src={bannerImage || staffData.image.large}
            alt={staffData.name.full}
            className="absolute w-full h-full object-cover object-center"
            style={{ filter: "brightness(0.6) blur(8px)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900" />
        </div>

        <div className="container mx-auto px-4 -mt-32 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-zinc-800/40 backdrop-blur-xl rounded-2xl p-6 border border-zinc-700/50"
              >
                <img
                  src={staffData.image.large}
                  alt={staffData.name.full}
                  className="w-full rounded-xl shadow-xl mb-6"
                />

                <div className="space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold">{staffData.name.full}</h1>
                    <p className="text-zinc-400">{staffData.name.native}</p>
                  </div>

                  <div className="flex items-center gap-2 bg-pink-500/20 p-4 rounded-xl">
                    <FaHeart className="text-pink-500" />
                    <span className="text-pink-200 font-medium">
                      {staffData.favourites.toLocaleString()} Favorites
                    </span>
                  </div>

                  {staffData.primaryOccupations?.length > 0 && (
                    <div className="bg-purple-500/20 p-4 rounded-xl">
                      <FaUser className="text-purple-500 mb-2" />
                      <div className="flex flex-wrap gap-2">
                        {staffData.primaryOccupations.map((occupation, index) => (
                          <span key={index} className="text-purple-200 text-sm bg-purple-500/20 px-3 py-1 rounded-full">
                            {occupation}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {staffData.dateOfBirth.month && (
                    <div className="flex items-center gap-2 bg-zinc-700/30 p-4 rounded-xl">
                      <FaBirthdayCake className="text-zinc-400" />
                      <span className="text-zinc-300">
                        {`${staffData.dateOfBirth.month}/${staffData.dateOfBirth.day}`}
                        {staffData.dateOfBirth.year && `/${staffData.dateOfBirth.year}`}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            <div className="md:col-span-2 space-y-8">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-zinc-800/40 backdrop-blur-xl rounded-2xl p-8 border border-zinc-700/50"
              >
                <h2 className="text-2xl font-semibold mb-4">About</h2>
                <div
                  className="text-zinc-300 leading-relaxed prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: staffData.description || "No description available.",
                  }}
                />
              </motion.div>

              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab('characters')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === 'characters'
                      ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                      : 'bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700/80'
                  }`}
                >
                  Voice Acting Roles
                </button>
                <button
                  onClick={() => setActiveTab('media')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === 'media'
                      ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                      : 'bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700/80'
                  }`}
                >
                  Media
                </button>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'characters' && (
                  <motion.div
                    key="characters"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {staffData.characters.nodes.map((character) => (
                      <Link
                        to={`/character/${character.id}`}
                        key={character.id}
                        className="group bg-zinc-800/40 rounded-xl overflow-hidden hover:bg-zinc-700/40 transition-all duration-300"
                      >
                        <div className="flex items-center gap-4 p-4">
                          <img
                            src={character.image.large}
                            alt={character.name.full}
                            className="w-20 h-28 object-cover rounded-lg transition-transform group-hover:scale-105"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-lg text-white group-hover:text-purple-300 transition-colors">
                              {character.name.full}
                            </h3>
                            <p className="text-sm text-zinc-400 mt-1">
                              {character.media.nodes[0]?.title.english || 
                               character.media.nodes[0]?.title.romaji}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'media' && (
                  <motion.div
                    key="media"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {staffData.staffMedia.nodes.map((media) => (
                      <Link
                        to={`/anime/${media.id}`}
                        key={media.id}
                        className="group bg-zinc-800/40 rounded-xl overflow-hidden hover:bg-zinc-700/40 transition-all duration-300"
                      >
                        <div className="flex items-center gap-4 p-4">
                          <img
                            src={media.coverImage.large}
                            alt={media.title.english || media.title.romaji}
                            className="w-20 h-28 object-cover rounded-lg transition-transform group-hover:scale-105"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-lg text-white group-hover:text-purple-300 transition-colors">
                              {media.title.english || media.title.romaji}
                            </h3>
                            <div className="flex items-center gap-2 mt-2">
                              <FaStar className="text-yellow-500" />
                              <span className="text-yellow-200">
                                {(media.averageScore / 10).toFixed(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
