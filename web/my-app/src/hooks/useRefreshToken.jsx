import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post('/user/refresh', { refreshToken });
        const newAccessToken = response.data.accessToken;
        setAuth(prev => ({ ...prev, accessToken: newAccessToken }));
        localStorage.setItem("accessToken", newAccessToken);
        return newAccessToken;
    };
    return refresh;
};

export default useRefreshToken;
