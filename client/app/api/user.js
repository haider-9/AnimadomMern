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
        return result;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};

export const login = async (data) => {
    try {
        const response = await fetch(`${API_URL}/api/${data.email}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        const result = await response.json();
        console.log(data.email)
        console.log(result);
        return result;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};
