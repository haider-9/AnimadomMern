import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import Header from "./components/header";
import Footer from "./components/footer";
import { Toaster } from "react-hot-toast";
import NotFound from "./routes/NotFound";
import { AuthProvider } from "./context/AuthContext";
import BG from "./components/bg";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { TooltipProvider } from "./components/ui/tooltip";
import { Button } from "./components/ui/button";
import ReactErrorBoundary from "./components/ErrorBoundary";

export function meta(): Route.MetaDescriptors {
  return [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "theme-color", content: "#000000" },
    { name: "color-scheme", content: "dark light" },
    { name: "format-detection", content: "telephone=no" },
  ];
}

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  // DNS prefetch for external APIs
  { rel: "dns-prefetch", href: "https://api.jikan.moe" },
  { rel: "dns-prefetch", href: "https://graphql.anilist.co" },
  { rel: "dns-prefetch", href: "https://kitsu.io" },
  // Favicon and app icons
  { rel: "icon", href: "/favicon.png" },
  { rel: "apple-touch-icon", href: "/logo.png" },
  // Preload critical resources
  { rel: "preload", href: "/logo.png", as: "image" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  // Filter out DevTools noise in development
  if (import.meta.env.DEV) {
    const originalError = console.error;
    console.error = (...args) => {
      const message = args.join(' ');
      // Filter out Chrome DevTools and well-known path errors
      if (
        message.includes('.well-known') ||
        message.includes('devtools') ||
        message.includes('chrome-extension') ||
        message.includes('No route matches URL "/.well-known')
      ) {
        return; // Silently ignore these errors
      }
      originalError.apply(console, args);
    };
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/favicon.png" type="image/x-icon" />
        <Meta />
        <Links />
      </head>
      <body>
        <BG />

        <div className="container">
          <Header />
          <div className="mt-10">{children}</div>
        </div>
        <ScrollRestoration />
        <Scripts />
        <Footer />
      </body>
    </html>
  );
}
export default function App() {
  return (
    <ReactErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <>
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'hsl(var(--card))',
                    color: 'hsl(var(--foreground))',
                    border: '1px solid hsl(var(--border))',
                  },
                  success: {
                    iconTheme: {
                      primary: 'hsl(var(--primary))',
                      secondary: 'hsl(var(--primary-foreground))',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: 'hsl(var(--destructive))',
                      secondary: 'hsl(var(--destructive-foreground))',
                    },
                  },
                }}
              />
              <Outlet />
            </>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ReactErrorBoundary>
  );
}
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error)) {
    return <NotFound />;
  }

  // Categorize different types of errors
  const getErrorInfo = (error: any) => {
    const errorMessage = error?.message || "An unexpected error occurred";
    
    // Handle Chrome DevTools and system requests
    if (errorMessage.includes(".well-known") || errorMessage.includes("devtools") || errorMessage.includes("chrome-extension")) {
      // Don't show error UI for system requests, just log and ignore
      console.log("System request ignored:", errorMessage);
      return null;
    }
    
    if (errorMessage.includes("Failed to fetch") || errorMessage.includes("NetworkError")) {
      return {
        title: "Connection Problem",
        message: "Unable to connect to our servers. This might be due to network issues or API limitations.",
        icon: "🌐",
        suggestions: [
          "Check your internet connection",
          "Try refreshing the page",
          "The API might be temporarily unavailable"
        ],
        canRetry: true
      };
    }
    
    if (errorMessage.includes("404") || errorMessage.includes("Not Found")) {
      return {
        title: "Content Not Found",
        message: "The content you're looking for doesn't exist or has been moved.",
        icon: "🔍",
        suggestions: [
          "Check the URL for typos",
          "Go back to the homepage",
          "Use the search function"
        ],
        canRetry: false
      };
    }
    
    if (errorMessage.includes("500") || errorMessage.includes("Internal Server Error")) {
      return {
        title: "Server Error",
        message: "Something went wrong on our end. Our team has been notified.",
        icon: "⚠️",
        suggestions: [
          "Try again in a few minutes",
          "Contact support if the problem persists"
        ],
        canRetry: true
      };
    }
    
    if (errorMessage.includes("Rate limit") || errorMessage.includes("Too Many Requests")) {
      return {
        title: "Too Many Requests",
        message: "You're making requests too quickly. Please slow down a bit.",
        icon: "⏱️",
        suggestions: [
          "Wait a moment before trying again",
          "Avoid rapid clicking or refreshing"
        ],
        canRetry: true
      };
    }
    
    // Default error
    return {
      title: "Something Went Wrong",
      message: import.meta.env.DEV ? errorMessage : "An unexpected error occurred. Please try again.",
      icon: "💥",
      suggestions: [
        "Try refreshing the page",
        "Go back to the homepage",
        "Contact support if the problem continues"
      ],
      canRetry: true
    };
  };

  const errorInfo = getErrorInfo(error);
  
  // Don't render error UI for system requests
  if (!errorInfo) {
    return null;
  }
  
  const handleRetry = () => {
    window.location.reload();
  };
  
  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-card/40 backdrop-blur-xl rounded-2xl p-8 border border-border text-center">
          {/* Error Icon */}
          <div className="text-6xl mb-4">{errorInfo.icon}</div>
          
          {/* Error Title */}
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {errorInfo.title}
          </h1>
          
          {/* Error Message */}
          <p className="text-muted-foreground mb-6 leading-relaxed">
            {errorInfo.message}
          </p>
          
          {/* Suggestions */}
          <div className="bg-muted/20 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-foreground mb-2 text-sm">What you can try:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              {errorInfo.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {errorInfo.canRetry && (
              <Button 
                onClick={handleRetry}
                className="flex-1"
                variant="default"
              >
                Try Again
              </Button>
            )}
            <Button 
              onClick={handleGoHome}
              className="flex-1"
              variant="outline"
            >
              Go Home
            </Button>
          </div>
          
          {/* Development Error Details */}
          {import.meta.env.DEV && error instanceof Error && (
            <details className="mt-6 text-left">
              <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                Developer Details
              </summary>
              <div className="mt-2 p-3 bg-muted/10 rounded border text-xs">
                <div className="font-mono text-destructive mb-2">
                  {error.name}: {error.message}
                </div>
                {error.stack && (
                  <pre className="text-muted-foreground overflow-x-auto whitespace-pre-wrap">
                    {error.stack}
                  </pre>
                )}
              </div>
            </details>
          )}
        </div>
        
        {/* Additional Help */}
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            Need help? Visit our{" "}
            <a 
              href="/about" 
              className="text-primary hover:underline"
            >
              support page
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
