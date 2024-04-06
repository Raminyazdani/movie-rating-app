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