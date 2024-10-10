import axios from "axios";
import { apiServer } from "../config/api";

export const getAuthAxios = () => {
    const authAxios = axios.create({
        baseURL: apiServer,
        withCredentials: true // 쿠키를 자동으로 전송하도록 설정
    });

    authAxios.interceptors.request.use((config) => {
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    authAxios.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            // 401 오류가 발생하고, 리프레시 토큰 재시도가 아닌 경우
            if (error.response && error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true; // 재시도 방지 플래그

                try {
                    // 리프레시 토큰을 사용해 새로운 accessToken 요청
                    const refreshResponse = await axios.get('/reissue-token', {
                        withCredentials: true,
                    });

                    if (refreshResponse.status === 200) {
                        const newAccessToken = refreshResponse.data.token;

                        // 새로운 accessToken을 로컬스토리지에 저장
                        localStorage.setItem('accessToken', newAccessToken);

                        // 요청 헤더에 새로운 토큰 설정
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                        // 실패했던 요청을 재시도
                        return axios(originalRequest);
                    }
                } catch (refreshError) {
                    // 리프레시 토큰도 유효하지 않은 경우 로그아웃 처리
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('HospitalDoctorLoggedIn');
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }
            return Promise.reject(error);
        }
    );
    return authAxios;
};

export default getAuthAxios;
