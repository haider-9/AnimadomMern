import { Button } from "./ui/button";
import { Link } from "react-router";

interface AnimeCardProps {
  imageUrl: string;
  title: string;
  hreflink: string;
  score?: number; // Added score as optional prop
}

export default function AnimeCard({
  imageUrl,
  title,
  hreflink,
  score = 0, // Default value if not provided
}: AnimeCardProps) {
  return (
    <div className="group relative w-[280px] h-[400px] rounded-2xl overflow-hidden shadow-lg md:w-[250px] md:h-[360px] sm:w-[220px] sm:h-[320px] cursor-pointer">
      <img
        src={imageUrl || "https://dummyimage.com/500x500"}
        alt={title}
        className="w-full h-full object-cover object-center transition-all duration-500 ease-in-out group-hover:blur-[2px] group-hover:scale-105"
      />

      {/* Added score tag */}
      <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-md">
        <span className="text-yellow-400 font-bold">★ {score.toFixed(1)}</span>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent flex flex-col justify-end p-6 translate-y-6 transition-all duration-500 ease-in-out group-hover:translate-y-0 group-hover:bg-black/60">
        <h3 className="text-white font-bold mb-4 text-center text-sm sm:text-base md:text-lg lg:text-xl opacity-0 transform -translate-y-4 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:translate-y-0">
          {title}
        </h3>

        <div className="flex flex-row justify-center gap-4 p-4 sm:hidden lg:flex opacity-0 transform translate-y-4 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:translate-y-0">
          <Link to={hreflink}>
            <Button variant="default" size="sm" className="transition-transform duration-300 hover:scale-110 hover:shadow-lg">
              ▶ Watch
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="transition-transform duration-300 hover:scale-110 hover:shadow-lg">
            +
          </Button>
          <Button variant="secondary" size="sm" className="transition-transform duration-300 hover:scale-110 hover:shadow-lg">
            ⭐
          </Button>
        </div>
      </div>
    </div>
  );
}
