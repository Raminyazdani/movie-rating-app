import {TBDBapi} from "../clients/apiMovieTMDB";


import {fetchDetailsAndMemoize} from "./detailandmemoService";

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

        const response = await TBDBapi.get(endpoint, {params: {language: 'en-US', page}});

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