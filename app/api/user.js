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

    console.log("Signup API response:", result);

    if (result.statusCode === 201 && result.data) {
      return {
        token: result.data.token,
        user: result.data.user,
      };
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
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    console.log("Login API response:", result);

    if (result.statusCode === 200 && result.data) {
      return {
        token: result.data.token,
        user: result.data.user,
      };
    }

    return { error: result.message || "Login failed" };
  } catch (error) {
    console.error("Error:", error);
    return { error: "Network error occurred" };
  }
};

// Add Anime to a List
export const addAnimeToList = async ({
  userId,
  listType,
  animeId,
  name,
  imageUrl,
}) => {
  try {
    const response = await fetch(`${API_URL}/api/user/list/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, listType, animeId, name, imageUrl }),
    });

    const result = await response.json();

    console.log("Add Anime Response:", result);

    if (result.message === "Anime added successfully") {
      return { success: true, user: result.user };
    }

    return { error: result.message || "Failed to add anime" };
  } catch (error) {
    console.error("Error:", error);
    return { error: "Network error occurred" };
  }
};

// Remove Anime from a List
export const removeAnimeFromList = async ({ userId, listType, animeId }) => {
  try {
    const response = await fetch(`${API_URL}/api/user/list/remove`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, listType, animeId }),
    });

    const result = await response.json();

    console.log("Remove Anime Response:", result);

    if (result.message === "Anime removed successfully") {
      return { success: true, user: result.user };
    }

    return { error: result.message || "Failed to remove anime" };
  } catch (error) {
    console.error("Error:", error);
    return { error: "Network error occurred" };
  }
};

// Get Anime List
export const getAnimeList = async (userId, listType) => {
  try {
    const response = await fetch(
      `${API_URL}/api/user/list/${userId}/${listType}`
    );

    const result = await response.json();

    console.log(`Get ${listType} List Response:`, result);

    if (result.list) {
      return { success: true, list: result.list };
    }

    return { error: result.message || "Failed to fetch anime list" };
  } catch (error) {
    console.error("Error:", error);
    return { error: "Network error occurred" };
  }
};
