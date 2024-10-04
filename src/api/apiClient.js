import axios from 'axios'
import { apiServer } from '../config/api'

const apiClient = axios.create({
    baseURL: apiServer,
    withCredentials:true
})

export default apiClient;