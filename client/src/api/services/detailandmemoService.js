import {TBDBapi} from "../clients/apiMovieTMDB";
import {normalizeData} from "../helpers/normalizeData";
import {localStorageService} from "../helpers/localStorageHelpers";

export const fetchDetailsAndMemoize = async (id, type, item = null) => {
    console.log("fetchDetailsAndMemoize", id, type, item)
    const storageKey = `details-${type}-${id}`;
    const memoizedData = localStorageService.get(storageKey);
    if (memoizedData) {
        return JSON.parse(memoizedData);
    }

    try {
        const endpoint = type === 'movie' ? `/movie/${id}` : `/tv/${id}`;
        const response = await TBDBapi.get(endpoint, {
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
        localStorageService.set(storageKey, JSON.stringify(normalizedData));
        return normalizedData;
    } catch (error) {

        console.error(`Error fetching details for ${type} with ID ${id}: in component ${item}`, error);
        return null;
    }
};