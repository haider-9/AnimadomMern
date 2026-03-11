import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="bg-card/40 backdrop-blur-xl border-border">
          <CardContent className="p-8 text-center">
            {/* 404 Image */}
            <div className="mb-6">
              <img
                src="/404.png"
                alt="404 Not Found"
                className="w-48 h-48 mx-auto object-contain"
              />
            </div>
            
            {/* Error Info */}
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Page Not Found
            </h1>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              The page you're looking for doesn't exist or has been moved.
            </p>
            
            {/* Suggestions */}
            <div className="bg-muted/20 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-foreground mb-2 text-sm">What you can try:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Check the URL for typos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Go back to the homepage</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Use the search function</span>
                </li>
              </ul>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="flex-1">
                <Link to="/">
                  Go Home
                </Link>
              </Button>
              <Button 
                onClick={() => window.history.back()} 
                variant="outline"
                className="flex-1"
              >
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Additional Help */}
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            Need help? Visit our{" "}
            <Link 
              to="/about" 
              className="text-primary hover:underline"
            >
              support page
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}