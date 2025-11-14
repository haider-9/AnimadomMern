import { Button } from "~/components/ui/button";
import { Link } from "react-router";

interface CharacterCardProps {
  imageUrl: string;
  name: string;
  role: string;
  animeAppearances?: number;
  hreflink: string;
}

export default function CharacterCard({
  imageUrl,
  name,
  role,
  animeAppearances = 0,
  hreflink,
}: CharacterCardProps) {
  return (
    <div className="w-40 sm:w-56 md:w-64 h-80 sm:h-96 rounded-2xl overflow-hidden shadow-xl group bg-gradient-to-br from-zinc-900/80 to-zinc-800/60 relative flex flex-col">
      {/* Character Image */}
      <img
        src={imageUrl || "https://dummyimage.com/400x400"}
        alt={name}
        className="w-full h-full object-cover object-center scale-100 group-hover:scale-[1.02] group-hover:blur-[2px] transition-all duration-700 absolute inset-0 z-0"
        loading="lazy"
      />

      {/* Glassmorphic Overlay - Hidden by default, visible on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-black/0 to-transparent group-hover:from-black/70 group-hover:via-black/30 transition-all duration-500 z-10" />

      {/* Floating Badges - Hidden by default, visible on hover */}
      <div className="absolute top-3 left-3 flex flex-col gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs text-primary font-bold shadow border border-white/30 tracking-wide">{role}</span>
        <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs text-zinc-700 font-semibold shadow border border-white/30 tracking-wide">📺 {animeAppearances}</span>
      </div>

      {/* Name at Bottom with Glass Effect - Hidden by default, visible on hover */}
      <div className="absolute bottom-0 left-0 w-full px-5 py-4 bg-black/40 backdrop-blur-lg flex flex-col items-start z-20 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
        <h3 className="text-white font-bold text-base sm:text-lg drop-shadow-lg line-clamp-2 w-full leading-tight">
          {name}
        </h3>
      </div>

      {/* Action Bar - Hidden by default, visible on hover */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Link to={hreflink} className="">
          <Button
            variant="default"
            size="icon"
            className="bg-purple-600/90 hover:bg-purple-700 text-white rounded-full p-2 shadow-lg flex items-center justify-center"
            title="View Details"
          >
            <span className="sr-only">View Details</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3A2.25 2.25 0 008.25 5.25V9m7.5 0v10.5A2.25 2.25 0 0113.5 21h-3A2.25 2.25 0 018.25 19.5V9m7.5 0H8.25m7.5 0H19.5a.75.75 0 01.75.75v8.25a2.25 2.25 0 01-2.25 2.25h-11A2.25 2.25 0 014.5 18V9.75a.75.75 0 01.75-.75h2.25" />
            </svg>
          </Button>
        </Link>
        <div className="relative group/add">
          <Button variant="secondary" size="icon" className="rounded-full p-2 aspect-square text-pink-600 bg-white/80 hover:bg-white shadow-lg flex items-center justify-center">
            <span className="sr-only">Add to List</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </Button>
          <div className="absolute right-0 mt-2 z-40 min-w-[10rem] bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-zinc-200 opacity-0 group-hover/add:opacity-100 pointer-events-none group-hover/add:pointer-events-auto transition-opacity duration-200 flex flex-col overflow-hidden">
            <button className="px-4 py-2 text-left hover:bg-zinc-100 text-zinc-800 text-sm">Add to Watchlist</button>
            <button className="px-4 py-2 text-left hover:bg-zinc-100 text-zinc-800 text-sm">Add to Favorites</button>
            <button className="px-4 py-2 text-left hover:bg-zinc-100 text-zinc-800 text-sm">Add to Custom List</button>
          </div>
        </div>
      </div>
    </div>
  );
}
