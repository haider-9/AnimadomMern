import {
  LuHeart,
  LuClock,
  LuCheck,
  LuLibrary,
  LuEye,
  LuBookmark,
} from "react-icons/lu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { topAnime } from "~/constants";

const USER_NAME = "Sharoon";

const watchingAnime = topAnime.filter((anime) =>
  [16498, 21, 44511, 1735].includes(anime.id)
);
const toWatchAnime = topAnime.filter((anime) =>
  [37521, 52347, 918].includes(anime.id)
);
const watchedAnime = topAnime.filter((anime) =>
  [1535, 5114, 269].includes(anime.id)
);

const collections = [
  { id: 1, name: "Shounen", animeCount: 12 },
  { id: 2, name: "Mystery", animeCount: 5 },
  { id: 3, name: "Romance", animeCount: 6 },
];

export default function Profile() {
  return (
    <main className="py-18 space-y-20">
      <title>{` Animadom | ${USER_NAME}`}</title>

      <div className="mb-8 relative">
        <img
          src="/banner404.jpg"
          alt=""
          className="rounded-md max-h-52 w-full object-top object-cover -z-20"
        />
        <div className="pl-6 flex items-end gap-2 absolute inset-0 bottom-5 z-50">
          <img
            src="https://i.redd.it/i-dont-know-if-anyone-knows-this-but-todays-mens-v0-82szkaftpu1e1.jpg?width=724&format=pjpg&auto=webp&s=90965c373d9a97a836ee0e3004219872d03b0313"
            alt={`${USER_NAME}'s profile picture`}
            className="size-20 rounded-full border-4 border-purple-500"
          />
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold">{USER_NAME}</h1>
            <p className="text-neutral-300 text-sm">Joined 12 March, 2024</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="watching" className="w-full">
        <TabsList className="mb-4 border-b bg-transparent rounded-none flex *:cursor-pointer border-none">
          <TabsTrigger
            value="watching"
            className="flex items-center gap-2 relative px-4 py-2 data-[state=active]:text-purple-600 data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:w-full data-[state=active]:after:h-0.5 data-[state=active]:after:bg-purple-600"
          >
            <LuEye /> Watching{" "}
            <span className="text-xs">({watchingAnime.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="towatch"
            className="flex items-center gap-2 relative px-4 py-2 data-[state=active]:text-purple-600 data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:w-full data-[state=active]:after:h-0.5 data-[state=active]:after:bg-purple-600"
          >
            <LuBookmark /> To Watch{" "}
            <span className="text-xs">({toWatchAnime.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="watched"
            className="flex items-center gap-2 relative px-4 py-2 data-[state=active]:text-purple-600 data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:w-full data-[state=active]:after:h-0.5 data-[state=active]:after:bg-purple-600"
          >
            <LuCheck /> Watched{" "}
            <span className="text-xs">({watchedAnime.length})</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="watching">
          <section className="rounded-lg shadow">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {watchingAnime.map((anime) => (
                <div
                  key={anime.id}
                  className="group relative overflow-hidden aspect-[2/3]"
                >
                  <img
                    src={anime.imageUrl}
                    alt={`${anime.name}`}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white font-medium">{anime.name}</p>
                    <p className="text-white/80 text-sm">⭐ {anime.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </TabsContent>
        <TabsContent value="towatch">
          <section className="rounded-lg shadow">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {toWatchAnime.map((anime) => (
                <div
                  key={anime.id}
                  className="group relative overflow-hidden aspect-[2/3]"
                >
                  <img
                    src={anime.imageUrl}
                    alt={`${anime.name}`}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white font-medium">{anime.name}</p>
                    <p className="text-white/80 text-sm">⭐ {anime.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </TabsContent>
        <TabsContent value="watched">
          <section className="rounded-lg shadow">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {watchedAnime.map((anime) => (
                <div
                  key={anime.id}
                  className="group relative overflow-hidden aspect-[2/3]"
                >
                  <img
                    src={anime.imageUrl}
                    alt={`${anime.name}`}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white font-medium">{anime.name}</p>
                    <p className="text-white/80 text-sm">⭐ {anime.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </main>
  );
}
