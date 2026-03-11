const SparklingBackground = () => {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-gradient-to-br from-background/95 to-background/80" />
      
      {/* Minimal decorative elements */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        {[...Array(8)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute rounded-full bg-primary/20 animate-float-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Side gradients */}
      <div className="absolute left-0 top-0 h-full w-[5%] bg-gradient-to-r from-primary/5 to-transparent" />
      <div className="absolute right-0 top-0 h-full w-[5%] bg-gradient-to-l from-primary/5 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};

export default SparklingBackground;
