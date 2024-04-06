import axios from "axios";

export const OMDBapi = axios.create({
    baseURL: 'http://www.omdbapi.com',
    params: {
        apikey: process.env.REACT_APP_OMDB_API_KEY,
    },
});