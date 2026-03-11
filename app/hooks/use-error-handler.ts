import { useCallback } from "react";
import { toast } from "react-hot-toast";

interface ErrorHandlerOptions {
  showToast?: boolean;
  toastMessage?: string;
  logError?: boolean;
  onError?: (error: Error) => void;
}

export function useErrorHandler(options: ErrorHandlerOptions = {}) {
  const {
    showToast = true,
    toastMessage,
    logError = true,
    onError,
  } = options;

  const handleError = useCallback((error: unknown) => {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    
    if (logError) {
      console.error("Error handled:", errorObj);
    }

    // Categorize and show appropriate toast messages
    if (showToast) {
      let message = toastMessage;
      
      if (!message) {
        const errorMessage = errorObj.message.toLowerCase();
        
        if (errorMessage.includes("failed to fetch") || errorMessage.includes("network")) {
          message = "Network error. Please check your connection.";
        } else if (errorMessage.includes("404") || errorMessage.includes("not found")) {
          message = "Content not found.";
        } else if (errorMessage.includes("500") || errorMessage.includes("server")) {
          message = "Server error. Please try again later.";
        } else if (errorMessage.includes("rate limit") || errorMessage.includes("too many")) {
          message = "Too many requests. Please wait a moment.";
        } else {
          message = "Something went wrong. Please try again.";
        }
      }
      
      toast.error(message);
    }

    // Call custom error handler if provided
    if (onError) {
      onError(errorObj);
    }
  }, [showToast, toastMessage, logError, onError]);

  return handleError;
}

// Utility function for wrapping async operations
export function withErrorHandler<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  errorHandler: (error: unknown) => void
) {
  return async (...args: T): Promise<R | undefined> => {
    try {
      return await fn(...args);
    } catch (error) {
      errorHandler(error);
      return undefined;
    }
  };
}