import {TBDBapi} from "../clients/apiMovieTMDB";

import {fetchDetailsAndMemoize} from "./detailandmemoService";

export async function fetchByTitle(query, type = 'all') {
    try {
        const fetchOperations = [];
        if (type === 'all' || type === 'movie') {
            fetchOperations.push(TBDBapi.get('/search/movie', {params: {query, language: 'en-US'}}));
        }

        if (type === 'all' || type === 'tv') {
            fetchOperations.push(TBDBapi.get('/search/tv', {params: {query, language: 'en-US'}}));
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