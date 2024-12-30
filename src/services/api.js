export const fetchUserData = async (page, limit) => {
    const response = await fetch(
        `https://json-server-vercel-inky.vercel.app/users?_page=${page}&_limit=${limit}`
    );
    if (!response.ok) {
        throw new Error("Failed to fetch data");
    }
    return await response.json();
};
