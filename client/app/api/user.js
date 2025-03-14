const API_URL = "http://localhost:3000";

export const signup = async (data) => {
  try {
    const response = await fetch(`${API_URL}/api`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    // Log the response for debugging
    console.log("Signup API response:", result);

    // Check if the response has the expected structure
    if (result.statusCode === 201 && result.data) {
      // Extract token and user from the response
      return {
        token: result.data.token,
        user: result.data.user,
      };
    }

    // If there's an error in the response
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
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    // Log the response for debugging
    console.log("Login API response:", result);

    // Check if the response has the expected structure
    if (result.statusCode === 200 && result.data) {
      // Extract token and user from the response
      return {
        token: result.data.token,
        user: result.data.user,
      };
    }

    // If there's an error in the response
    return { error: result.message || "Login failed" };
  } catch (error) {
    console.error("Error:", error);
    return { error: "Network error occurred" };
  }
};
