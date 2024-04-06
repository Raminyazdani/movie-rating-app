import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';
export const apiClient = axios.create({
    baseURL: BASE_URL,
});