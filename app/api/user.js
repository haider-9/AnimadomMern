const API_URL = "http://localhost:3000";

export const signup = async (data) => {
  try {
    const response = await fetch(`${API_URL}/api`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Ensure cookies are sent
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("Signup API response:", result);

    if (response.ok && result.data) {
      return { user: result.data.user };
    }

    return { error: result.message || "Signup failed" };
  } catch (error) {
    console.error("Error:", error);
    return { error: "Network error occurred" };
  }
};

export const login = async (data) => {
  try {
    const { email, password } = data;
    const response = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    console.log("Login API response:", result);

    if (response.ok && result.data) {
      // If the server returns a token directly, store it
      if (result.data.token) {
        localStorage.setItem("token", result.data.token);
      }
      return { user: result.data.user };
    }

    return { error: result.message || "Login failed" };
  } catch (error) {
    console.error("Error:", error);
    return { error: "Network error occurred" };
  }
};

export const logout = async () => {
  try {
    const response = await fetch(`${API_URL}/api/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      return { error: "Logout failed" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error:", error);
    return { error: "Network error occurred" };
  }
};

// Helper function to get token
export const getToken = () => localStorage.getItem("token");

export const checkSession = async () => {
  try {
    const response = await fetch(`${API_URL}/api/check-session`, {
      method: "GET",
      credentials: "include",
    });

    if (response.status === 401) {
      console.warn("Session expired or unauthorized.");
      return { isAuthenticated: false, user: null };
    }

    const result = await response.json();

    // Make sure we always return the expected structure
    return {
      isAuthenticated: result.data?.user ? true : false,
      user: result.data?.user || null,
    };
  } catch (error) {
    console.error("Error checking session:", error);
    // Always return the expected structure even in error cases
    return { isAuthenticated: false, user: null };
  }
};

