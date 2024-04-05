import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

export const apiClient = axios.create({
    baseURL: BASE_URL,
});

export const apiMovieOMDB = axios.create({
    baseURL: 'http://www.omdbapi.com',
    params: {
        apikey: process.env.REACT_APP_OMDB_API_KEY,
    },
});


const TMDB_API_KEY_secure = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMWUzNmUzZGI4MDNiNzkwNTczMGQ4ZDZhMDRhY2EyOCIsInN1YiI6IjY2MGRmZjIzOTVjZTI0MDE3ZDZmOGUyZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wcYeOp6jjl6ptLJMfNgmTynk-PMGdr2tPwYBpTc7LM8';


const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
export const apiMovie = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    params: {
        api_key: TMDB_API_KEY,
    },
});

export async function fetchByTitle(query, type = 'all') {
    try {
        const fetchOperations = [];
        if (type === 'all' || type === 'movie') {
            fetchOperations.push(apiMovie.get('/search/movie', {params: {query, language: 'en-US'}}));
        }

        if (type === 'all' || type === 'tv') {
            fetchOperations.push(apiMovie.get('/search/tv', {params: {query, language: 'en-US'}}));
        }


        const responses = await Promise.all(fetchOperations);
        const combinedResults = responses.reduce((acc, response) => {
                if (response.data.results) {

                    if (response.request.responseURL.includes('movie')) {
                        response.data.results.map(item => item.type = 'movie')
                    }
                    if (response.request.responseURL.includes('tv')) {
                        response.data.results.map(item => item.type = 'tv')
                    }

                    return [...acc, ...response.data.results];
                }

                return acc;
            }
            , []);

        const detailedResults = await Promise.all(
            combinedResults.map(item => fetchDetailsAndMemoize(item.id, item.type))
        );

        return detailedResults.filter(item => item !== null);

    } catch (error) {
        console.error('Error fetching by title:', error);
        return [];
    }
}


export async function fetchAllGenresAndMemoize() {


    try {
        const movieGenresResponse = await apiMovie.get('/genre/movie/list', {params: {language: 'en-US'}});
        const tvGenresResponse = await apiMovie.get('/genre/tv/list', {params: {language: 'en-US'}});

        const movieGenres = movieGenresResponse.data.genres;
        const tvGenres = tvGenresResponse.data.genres;

        localStorage.setItem('tmdbMovieGenres', JSON.stringify(movieGenres));
        localStorage.setItem('tmdbTVGenres', JSON.stringify(tvGenres));

        return {movieGenres, tvGenres};
    } catch (error) {
        console.error('Error fetching genres:', error);
        return {movieGenres: [], tvGenres: []};
    }
}

export const fetchDetailsAndMemoize = async (id, type, item = null) => {
    console.log("fetchDetailsAndMemoize", id, type, item)
    const storageKey = `details-${type}-${id}`;
    const memoizedData = localStorage.getItem(storageKey);
    if (memoizedData) {
        return JSON.parse(memoizedData);
    }

    try {
        const endpoint = type === 'movie' ? `/movie/${id}` : `/tv/${id}`;
        const response = await apiMovie.get(endpoint, {
            params: {
                append_to_response: 'credits'
            }
        });
        if (response.request.responseURL.includes('movie')) {
            response.data.type = 'movie'
        }
        if (response.request.responseURL.includes('tv')) {
            response.data.type = 'tv'
        }


        const normalizedData = normalizeData(response.data, type);
        localStorage.setItem(storageKey, JSON.stringify(normalizedData));
        return normalizedData;
    } catch (error) {

        console.error(`Error fetching details for ${type} with ID ${id}: in component ${item}`, error);
        return null;
    }
};
export const normalizeData = (item, type) => {
    const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
    const defaultImageUrl = "https://example.com/default_poster.jpg"; // Your default poster URL

    const defaultValues = {
        Poster: item.poster_path ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}` : defaultImageUrl,
        Title: type === 'movie' ? item.title : item.name,
        Year: type === 'movie' ? item.release_date?.substring(0, 4) : item.first_air_date?.substring(0, 4),
        imdbID: item.id.toString(),
        Type: type,
        Genre: item.genres.map(genre => genre.name).join(", "),
        imdbRating: item.vote_average.toString(),
        Plot: item.overview,
    };


    return defaultValues;
};

export async function getMovieCarousel(type) {
    try {
        let endpoint = '';
        switch (type) {
            case 'now_playing':
                endpoint = '/movie/now_playing';
                break;
            case 'popular':
                endpoint = '/movie/popular';
                break;
            case 'top_rated':
                endpoint = '/movie/top_rated';
                break;
            case 'upcoming':
                endpoint = '/movie/upcoming';
                break;
            default:
                throw new Error('Invalid type for movie carousel');
        }

        const response = await apiMovie.get(`${endpoint}`, {params: {language: 'en-US', page: 1}});

        const moviesWithType = response.data.results.map(item => ({...item, type: 'movie'}));

        const detailedResults = await Promise.all(
            moviesWithType.map(item => fetchDetailsAndMemoize(item.id, item.type))
        );
        return detailedResults.filter(item => item !== null);

    } catch (error) {
        console.error(`Error fetching movies for ${type}:`, error);
        return [];
    }
}

export async function getMovieGrid(filterOption, contentOption, page, idForSimilarContent = null) {
    try {
        let endpoint = '';

        switch (contentOption) {
            case 'day':
            case 'week':
                endpoint = `/trending/${filterOption === 'all' ? 'all' : filterOption}/${contentOption}?language=en-US`;
                break;
            case 'similar':
                if (!idForSimilarContent) {
                    throw new Error('ID for similar content is required');
                }
                endpoint = `/${filterOption}/${idForSimilarContent}/similar?language=en-US&page=${page}`;
                break;
            default:
                throw new Error('Invalid content option');
        }

        const response = await apiMovie.get(endpoint, {params: {language: 'en-US', page}});

        const processedData = response.data.results.map(item => ({
            ...item,
            type: item.media_type ? item.media_type : filterOption
        }));

        const detailedData = await Promise.all(
            processedData.map(item => fetchDetailsAndMemoize(item.id, item.type))
        );

        return detailedData.filter(item => item.details !== null);
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}