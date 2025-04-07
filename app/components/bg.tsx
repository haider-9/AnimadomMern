import React from "react";
import {
  Sparkles,
  Star,
  Sword,
  Flame,
  Zap,
  Heart,
  Glasses,
  Gamepad2,
  Tv,
  Wand2,
  Cloud,
  Moon,
} from "lucide-react";

const SparklingBackground = () => {
  // Anime-themed icons that will float in the background - using more calming icons
  const animeIcons = [
    // Sword - represents action/fighting anime
    {
      icon: <Sword className="h-4 w-4" />,
      darkColor: "text-blue-400/40",
      lightColor: "text-blue-300/40",
    },
    // Heart - represents romance anime
    {
      icon: <Heart className="h-4 w-4 fill-current" />,
      darkColor: "text-pink-400/40",
      lightColor: "text-pink-300/40",
    },
    // Star - represents wishes/dreams
    {
      icon: <Star className="h-3 w-3 fill-current" />,
      darkColor: "text-yellow-400/40",
      lightColor: "text-yellow-300/40",
    },
    // Sparkles - represents magical effects
    {
      icon: <Sparkles className="h-3 w-3" />,
      darkColor: "text-cyan-400/40",
      lightColor: "text-cyan-200/40",
    },
    // Cloud - represents peaceful skies
    {
      icon: <Cloud className="h-4 w-4" />,
      darkColor: "text-slate-400/40",
      lightColor: "text-slate-300/40",
    },
    // Moon - represents night scenes
    {
      icon: <Moon className="h-4 w-4" />,
      darkColor: "text-indigo-400/40",
      lightColor: "text-indigo-300/40",
    },
  ];

  // Function to generate elements with bias toward the sides
  const generatePosition = (sideWeight = 0) => {
    // sideWeight: 0 = uniform distribution, 1 = completely biased to sides
    if (Math.random() < sideWeight) {
      // Place on sides (left or right)
      const side = Math.random() < 0.5;
      return {
        left: side ? `${Math.random() * 20}%` : `${80 + Math.random() * 20}%`,
        top: `${Math.random() * 100}%`,
      };
    } else {
      // Random position
      return {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      };
    }
  };

  return (
    <div
      className="fixed inset-0 -z-50 overflow-hidden "
      style={{
        height: "calc(var(--vh, 1vh) * 100)",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <div className="absolute inset-0 bg-background transition-colors duration-1000" />

      <div className="absolute inset-0 bg-gradient-to-br from-background/95 to-background/80 transition-colors duration-1000" />

      <div className="block dark:hidden absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => {
          const position = generatePosition(0.3);
          return (
            <div
              key={`sparkle-${i}`}
              className="absolute rounded-full bg-foreground/40 animate-float"
              style={{
                left: position.left,
                top: position.top,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${Math.random() * 5 + 10}s`, // Slower animation
                opacity: Math.random() * 0.4 + 0.1, // More subtle
              }}
            />
          );
        })}

        {/* Larger stars - fewer of them */}
        {[...Array(10)].map((_, i) => {
          const position = generatePosition(0.6);
          return (
            <div
              key={`big-sparkle-${i}`}
              className="absolute rounded-full bg-foreground/30 animate-float"
              style={{
                left: position.left,
                top: position.top,
                width: `${Math.random() * 3 + 2}px`,
                height: `${Math.random() * 3 + 2}px`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${Math.random() * 6 + 12}s`, // Slower animation
                opacity: Math.random() * 0.5 + 0.1, // More subtle
              }}
            />
          );
        })}

        {/* Anime-themed icons - fewer of them */}
        {[...Array(15)].map((_, i) => {
          const iconIndex = i % animeIcons.length;
          const position = generatePosition(0.4);
          return (
            <div
              key={`light-icon-${i}`}
              className={`absolute ${animeIcons[iconIndex].darkColor} animate-float`}
              style={{
                left: position.left,
                top: position.top,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${Math.random() * 10 + 15}s`, // Much slower animation
                opacity: Math.random() * 0.3 + 0.1, // More subtle
                transform: `scale(${Math.random() * 0.4 + 0.6}) rotate(${
                  Math.random() * 360
                }deg)`,
              }}
            >
              {animeIcons[iconIndex].icon}
            </div>
          );
        })}
      </div>

      {/* Light mode elements - showing in dark mode - reduced count */}
      <div className="hidden dark:block absolute inset-0 overflow-hidden">
        {/* Small twinkling stars - reduced count */}
        {[...Array(40)].map((_, i) => {
          const position = generatePosition(0.3);
          return (
            <div
              key={`star-${i}`}
              className="absolute rounded-full bg-primary/20 animate-float"
              style={{
                left: position.left,
                top: position.top,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 8 + 12}s`, // Slower animation
                opacity: Math.random() * 0.2 + 0.1, // More subtle
              }}
            />
          );
        })}

        {/* Larger stars - fewer of them */}
        {[...Array(10)].map((_, i) => {
          const position = generatePosition(0.6);
          return (
            <div
              key={`big-star-${i}`}
              className="absolute rounded-full bg-primary/25 animate-float"
              style={{
                left: position.left,
                top: position.top,
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 8 + 12}s`, // Slower animation
                opacity: Math.random() * 0.3 + 0.1, // More subtle
              }}
            />
          );
        })}

        {/* Colorful anime-themed icons - fewer of them */}
        {[...Array(15)].map((_, i) => {
          const iconIndex = i % animeIcons.length;
          const position = generatePosition(0.4);
          return (
            <div
              key={`icon-${i}`}
              className={`absolute ${animeIcons[iconIndex].lightColor} animate-float`}
              style={{
                left: position.left,
                top: position.top,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${Math.random() * 15 + 15}s`, // Much slower animation
                opacity: Math.random() * 0.3 + 0.1, // More subtle
                transform: `scale(${Math.random() * 0.5 + 0.5}) rotate(${
                  Math.random() * 360
                }deg)`,
                filter: "blur(0.5px)",
              }}
            >
              {animeIcons[iconIndex].icon}
            </div>
          );
        })}
      </div>

      {/* Floating bubbles - fewer and more subtle */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => {
          const position = generatePosition(0.4);
          return (
            <div
              key={`bubble-${i}`}
              className="absolute rounded-full bg-primary/5 dark:bg-primary/3 animate-float-delayed transition-colors duration-1000"
              style={{
                left: position.left,
                top: position.top,
                width: `${Math.random() * 50 + 20}px`,
                height: `${Math.random() * 50 + 20}px`,
                animationDuration: `${Math.random() * 25 + 20}s`, // Much slower animation
                filter: "blur(15px)", // More blur for softer effect
              }}
            />
          );
        })}
      </div>

      {/* Side accents - more subtle */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Left side accent */}
        <div className="absolute left-0 top-0 h-full w-[8%] bg-gradient-to-r from-primary/3 to-transparent" />

        {/* Right side accent */}
        <div className="absolute right-0 top-0 h-full w-[8%] bg-gradient-to-l from-primary/3 to-transparent" />
      </div>

      {/* Bottom fade effect - more gradual */}
      <div className="absolute bottom-0 left-0 w-full h-2/5 bg-gradient-to-t from-background to-transparent transition-colors duration-1000" />
    </div>
  );
};

export default SparklingBackground;
