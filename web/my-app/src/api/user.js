import axios from "./axios";

export async function getUserById(userId) {
    const response = await axios.get(`/user/users/${userId}`);
    if (!response) {
        return { message: 'getUserById no response' };
    }
    return response.data;
}

export async function logoutUser() {
    const accessToken = localStorage.getItem("accessToken");
    await axios.post('/user/logout', {}, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
}
