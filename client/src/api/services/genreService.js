import {TBDBapi} from "../clients/apiMovieTMDB";

export async function fetchAllGenresAndMemoize() {


    try {
        const movieGenresResponse = await TBDBapi.get('/genre/movie/list', {params: {language: 'en-US'}});
        const tvGenresResponse = await TBDBapi.get('/genre/tv/list', {params: {language: 'en-US'}});

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