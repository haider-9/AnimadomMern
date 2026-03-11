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
    <div className="relative w-full rounded-lg overflow-hidden shadow-lg group">
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
              className="flex-[0_0_100%] min-w-0 relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]"
            >
              <img
                src={anime.imageUrl}
                alt={anime.name}
                className="w-full h-full object-cover brightness-90"
                loading="eager"
              />
              <div className="absolute bottom-0 left-0 px-4 py-6 md:px-8 md:py-10 bg-gradient-to-t from-background/95 via-background/70 to-transparent w-full">
                <div className="space-y-2">
                  <img
                    src={anime.titleImage}
                    alt={`${anime.name} title`}
                    className="h-10 md:h-16 object-contain"
                    loading="eager"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-chart-3">⭐</span>
                    <span className="font-bold text-chart-3">
                      {anime.rating}
                    </span>
                  </div>
                </div>
                <p className="max-w-2xl mt-3 max-md:hidden text-muted-foreground text-sm md:text-base leading-relaxed">
                  {anime.description}
                </p>
                <Button asChild variant="destructive" className="mt-4">
                  <Link to={`/anime/${anime.id}`}>Watch Now</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 right-8 flex gap-2 z-40 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          onClick={onPrevClick}
          size="icon"
          variant="secondary"
          className="rounded-full h-8 w-8 bg-card/80 backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
        <Button
          onClick={onNextClick}
          size="icon"
          variant="secondary"
          className="rounded-full h-8 w-8 bg-card/80 backdrop-blur-sm"
          aria-label="Next slide"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 6L15 12L9 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 max-sm:hidden">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`h-2 rounded-full transition-all ${
              index === selectedIndex
                ? "bg-primary w-8"
                : "bg-muted w-2 hover:bg-muted-foreground"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
