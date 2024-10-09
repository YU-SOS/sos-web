import axios from "axios";
import { apiServer } from "../config/api";

export const getAuthAxios = () => {

    const accessToken = localStorage.getItem('accessToken');
  
    const authAxios = axios.create({
        baseURL: apiServer,
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        withCredentials: true
    })

    return authAxios;
}

export default getAuthAxios;