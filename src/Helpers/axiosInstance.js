import axios from "axios";

const BASE_URL = "https://skillhub-backend-mauve.vercel.app/api/v1"

const axiosInstance = axios.create()
axiosInstance.defaults.baseURL = BASE_URL;
axiosInstance.defaults.withCredentials = true

export default axiosInstance;