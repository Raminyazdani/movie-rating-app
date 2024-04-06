import {TBDBapi} from "../clients/apiMovieTMDB";


import {fetchDetailsAndMemoize} from "./detailandmemoService";

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

        const response = await TBDBapi.get(`${endpoint}`, {params: {language: 'en-US', page: 1}});

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