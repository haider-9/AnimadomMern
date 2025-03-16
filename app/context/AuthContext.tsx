import React, { createContext, useState, useEffect } from "react";

// Create a type for the context
type User = {
  name: string;
  email: string;
  // Add other user properties
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  // Check for existing token and user data on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    console.log("Auth initialization - Token exists:", !!token);
    console.log("Auth initialization - User exists:", !!savedUser);

    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
        console.log("User authenticated from localStorage");
      } catch (e) {
        console.error("Error parsing saved user data:", e);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const loginContext = (userData: User) => {
    console.log("Login context called with:", userData);
    setUser(userData);
    setIsAuthenticated(true);
    // Also save user data to localStorage
    localStorage.setItem("user", JSON.stringify(userData));
    console.log("Auth state updated - isAuthenticated:", true);
  };

  const logoutContext = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    console.log("User logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login: loginContext,
        logout: logoutContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
