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
  Wand2
} from "lucide-react";

const SparklingBackground = () => {
  // Anime-themed icons that will float in the background
  const animeIcons = [
    // Sword - represents action/fighting anime
    { 
      icon: <Sword className="h-5 w-5" />, 
      darkColor: "text-blue-400", 
      lightColor: "text-blue-300" 
    },
    // Flame - represents fire abilities/powers
    { 
      icon: <Flame className="h-5 w-5" />, 
      darkColor: "text-orange-500", 
      lightColor: "text-orange-300" 
    },
    // Zap - represents electric/lightning powers
    { 
      icon: <Zap className="h-5 w-5" />, 
      darkColor: "text-yellow-400", 
      lightColor: "text-yellow-200" 
    },
    // Heart - represents romance anime
    { 
      icon: <Heart className="h-5 w-5 fill-current" />, 
      darkColor: "text-pink-500", 
      lightColor: "text-pink-300" 
    },
    // Glasses - represents intellectual characters
    { 
      icon: <Glasses className="h-5 w-5" />, 
      darkColor: "text-indigo-400", 
      lightColor: "text-indigo-200" 
    },
    // Gamepad - represents gaming/isekai anime
    { 
      icon: <Gamepad2 className="h-5 w-5" />, 
      darkColor: "text-purple-500", 
      lightColor: "text-purple-300" 
    },
    // TV - represents anime itself
    { 
      icon: <Tv className="h-5 w-5" />, 
      darkColor: "text-emerald-500", 
      lightColor: "text-emerald-300" 
    },
    // Wand - represents magical anime
    { 
      icon: <Wand2 className="h-5 w-5" />, 
      darkColor: "text-amber-400", 
      lightColor: "text-amber-200" 
    },
    // Star - represents wishes/dreams
    { 
      icon: <Star className="h-4 w-4 fill-current" />, 
      darkColor: "text-yellow-500", 
      lightColor: "text-yellow-300" 
    },
    // Sparkles - represents magical effects
    { 
      icon: <Sparkles className="h-4 w-4" />, 
      darkColor: "text-cyan-400", 
      lightColor: "text-cyan-200" 
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
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none select-none">
      {/* Base background - use theme variables instead of hardcoded colors */}
      <div className="absolute inset-0 bg-background transition-colors duration-500" />
      
      {/* Gradient overlay - use theme variables with opacity */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 to-background/50 transition-colors duration-500" />

      {/* Dark mode elements - showing in light mode */}
      <div className="block dark:hidden absolute inset-0 overflow-hidden">
        {/* White stars - increased count and biased toward sides */}
        {[...Array(100)].map((_, i) => {
          const position = generatePosition(0.4);
          return (
            <div
              key={`sparkle-${i}`}
              className="absolute rounded-full bg-foreground/70 animate-float"
              style={{
                left: position.left,
                top: position.top,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 3 + 2}s`,
                opacity: Math.random() * 0.7 + 0.1,
              }}
            />
          );
        })}

        {/* Larger stars for more visibility on sides */}
        {[...Array(20)].map((_, i) => {
          const position = generatePosition(0.8); // Heavy bias toward sides
          return (
            <div
              key={`big-sparkle-${i}`}
              className="absolute rounded-full bg-foreground/60 animate-float"
              style={{
                left: position.left,
                top: position.top,
                width: `${Math.random() * 3 + 2}px`,
                height: `${Math.random() * 3 + 2}px`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 4 + 3}s`,
                opacity: Math.random() * 0.8 + 0.2,
              }}
            />
          );
        })}

        {/* Anime-themed icons - more of them and biased toward sides */}
        {[...Array(40)].map((_, i) => {
          const iconIndex = i % animeIcons.length;
          const position = generatePosition(0.6);
          return (
            <div
              key={`light-icon-${i}`}
              className={`absolute ${animeIcons[iconIndex].darkColor} animate-float`}
              style={{
                left: position.left,
                top: position.top,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 5}s`,
                opacity: Math.random() * 0.5 + 0.2,
                transform: `scale(${Math.random() * 0.5 + 0.5}) rotate(${Math.random() * 360}deg)`,
              }}
            >
              {animeIcons[iconIndex].icon}
            </div>
          );
        })}
      </div>

      {/* Light mode elements - showing in dark mode */}
      <div className="hidden dark:block absolute inset-0 overflow-hidden">
        {/* Small twinkling stars - increased count and biased toward sides */}
        {[...Array(80)].map((_, i) => {
          const position = generatePosition(0.4);
          return (
            <div
              key={`star-${i}`}
              className="absolute rounded-full bg-primary/30 animate-float"
              style={{
                left: position.left,
                top: position.top,
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 5 + 3}s`,
                opacity: Math.random() * 0.3 + 0.1,
              }}
            />
          );
        })}

        {/* Larger stars for more visibility on sides */}
        {[...Array(20)].map((_, i) => {
          const position = generatePosition(0.8); // Heavy bias toward sides
          return (
            <div
              key={`big-star-${i}`}
              className="absolute rounded-full bg-primary/40 animate-float"
              style={{
                left: position.left,
                top: position.top,
                width: `${Math.random() * 5 + 3}px`,
                height: `${Math.random() * 5 + 3}px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 5 + 3}s`,
                opacity: Math.random() * 0.4 + 0.2,
              }}
            />
          );
        })}

        {/* Colorful anime-themed icons - more of them and biased toward sides */}
        {[...Array(40)].map((_, i) => {
          const iconIndex = i % animeIcons.length;
          const position = generatePosition(0.6);
          return (
            <div
              key={`icon-${i}`}
              className={`absolute ${animeIcons[iconIndex].lightColor} animate-float`}
              style={{
                left: position.left,
                top: position.top,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 15 + 5}s`,
                opacity: Math.random() * 0.4 + 0.1,
                transform: `scale(${Math.random() * 0.7 + 0.3}) rotate(${Math.random() * 360}deg)`,
                filter: "blur(0.5px)",
              }}
            >
              {animeIcons[iconIndex].icon}
            </div>
          );
        })}
      </div>

      {/* Floating bubbles - increased count and biased toward sides */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(25)].map((_, i) => {
          const position = generatePosition(0.5);
          return (
            <div
              key={`bubble-${i}`}
              className="absolute rounded-full bg-primary/10 dark:bg-primary/5 animate-float-delayed transition-colors duration-500"
              style={{
                left: position.left,
                top: position.top,
                width: `${Math.random() * 60 + 20}px`,
                height: `${Math.random() * 60 + 20}px`,
                animationDuration: `${Math.random() * 20 + 10}s`,
                filter: "blur(12px)",
              }}
            />
          );
        })}
      </div>

      {/* Side accents - specifically for the sides */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Left side accent */}
        <div className="absolute left-0 top-0 h-full w-[10%] bg-gradient-to-r from-primary/5 to-transparent" />
        
        {/* Right side accent */}
        <div className="absolute right-0 top-0 h-full w-[10%] bg-gradient-to-l from-primary/5 to-transparent" />
      </div>

      {/* Bottom fade effect - use theme variables */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-background to-transparent transition-colors duration-500" />
    </div>
  );
};

export default SparklingBackground;
