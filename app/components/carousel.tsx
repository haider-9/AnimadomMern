import { useState, useEffect } from "react";
import { Link } from "react-router";
import { topAnime } from "~/constants";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "./ui/button";

export default function Carousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      skipSnaps: false,
      dragFree: true,
      containScroll: "trimSnaps",
      align: "center",
    },
    [Autoplay({ delay: 5000, stopOnInteraction: true, playOnInit: true })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const handleMouseEnter = () => emblaApi?.plugins().autoplay.stop();
  const handleMouseLeave = () => emblaApi?.plugins().autoplay.play();
  const scrollTo = (index: number) => emblaApi?.scrollTo(index);
  const onPrevClick = () => emblaApi?.scrollPrev();
  const onNextClick = () => emblaApi?.scrollNext();

  return (
    <div className="relative w-full rounded-lg overflow-hidden shadow-2xl group">
      <div
        className="overflow-hidden"
        ref={emblaRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex">
          {topAnime.map((anime) => (
            <div
              key={anime.id}
              className="flex-[0_0_100%] min-w-0 relative transition-transform duration-500 h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[650px]"
            >
              <img
                src={anime.imageUrl}
                alt={anime.name}
                className="w-full h-full object-cover filter brightness-90"
                loading="eager"
              />
              <div className="absolute bottom-0 left-0 px-3 py-5 md:px-6 md:py-9 xl:px-9 xl:py-14 bg-gradient-to-t from-black/95 via-black/70 to-transparent w-full transform transition-transform duration-500">
                <div className="space-y-1 ">
                  <img
                    src={anime.titleImage}
                    alt={`${anime.name} title`}
                    className="h-10 md:h-16 xl:h-20 object-contain drop-shadow-lg "
                    loading="eager"
                  />
                  <div className="flex items-center gap-2 md:text-lg xl:text-xl">
                    <span className="text-yellow-400 xl:text-lg animate-pulse">
                      ⭐
                    </span>
                    <span className="font-bold text-yellow-400">
                      {anime.rating}
                    </span>
                  </div>
                </div>
                <p className="max-w-2xl mt-3 max-md:hidden text-gray-200 text-sm md:text-base lg:text-lg drop-shadow-lg leading-relaxed opacity-90 hover:opacity-100 transition-opacity duration-300">
                  {anime.description}
                </p>
                <Link to={`/anime/${anime.id}`}>
                  <Button
                    variant="destructive"
                    className="bg-red-600 text-white font-semibold hover:bg-red-700 transition-all duration-300 transform hover:scale-105 mt-4"
                  >
                    Watch Now
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 right-8 flex gap-2 z-40 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 opacity-100">
        <button
          onClick={onPrevClick}
          className="flex items-center justify-center size-8 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 hover:scale-110 cursor-pointer"
          aria-label="Previous slide"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18L9 12L15 6"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          onClick={onNextClick}
          className="flex items-center justify-center size-8 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 hover:scale-110 cursor-pointer"
          aria-label="Next slide"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 6L15 12L9 18"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 max-sm:hidden">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 hover:scale-125 ${
              index === selectedIndex
                ? "bg-white w-5"
                : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
