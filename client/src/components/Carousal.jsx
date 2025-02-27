import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { topAnime } from "../../constants";

const Carousal = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === topAnime.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? topAnime.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-screen">
      {topAnime.map((anime, index) => (
        <div
          key={anime.id}
          className={`absolute w-full h-full transition-opacity duration-700 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={anime.imageUrl}
            alt={anime.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 p-12 bg-gradient-to-t from-black/95 via-black/70 to-transparent w-full shadow-2xl">
            <div className="w-[300px] h-[100px]">
              <img
                src={anime.titleImage}
                alt={`${anime.name} title`}
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </div>
            <div className="flex items-center gap-2 mt-4">
              <span className="text-3xl font-bold text-yellow-400">
                {anime.rating}
              </span>
              <span className="text-yellow-400 animate-pulse">★</span>
            </div>
            <p className="max-w-2xl mt-3 text-gray-200 text-lg drop-shadow-lg leading-relaxed">
              {anime.description}
            </p>
            <Link to={`/anime/${topAnime[currentSlide].id}`}>
              <button className="mt-6 px-8 py-3 bg-red-600 text-white font-semibold rounded tracking-wide shadow-lg cursor-pointer">
                Watch Now
              </button>
            </Link>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 -translate-y-1/2 w-16 h-16 bg-black/30 text-white rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:bg-black/50 hover:scale-110 cursor-pointer"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 -translate-y-1/2 w-16 h-16 bg-black/30 text-white rounded-full flex items-center justify-center shadow-xl cursor-pointer transition-all duration-300 hover:bg-black/50 hover:scale-110"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {topAnime.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white scale-125" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousal;
