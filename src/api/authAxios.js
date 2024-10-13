import axios from "axios";
import { apiServer } from "../config/api";

export const getAuthAxios = () => {
    const authAxios = axios.create({
        baseURL: apiServer,
    });

    authAxios.interceptors.request.use((config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    }, (error) => Promise.reject(error));

    authAxios.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            if (error.response && error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    const refreshToken = localStorage.getItem('refreshToken'); // 리프레시 토큰 가져오기
                    const refreshResponse = await authAxios.get(`/reissue-token`, {
                        headers: { Authorization: `Bearer ${refreshToken}` }, // 헤더에 리프레시 토큰 포함
                    });

                    if (refreshResponse.status === 200) {
                        const newAccessToken = refreshResponse.data.token;
                        localStorage.setItem('accessToken', newAccessToken);

                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        return authAxios(originalRequest);
                    }
                } catch (refreshError) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken'); // 리프레시 토큰도 삭제
                    //window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }
            return Promise.reject(error);
        }
    );
    return authAxios;
};

export default getAuthAxios;
