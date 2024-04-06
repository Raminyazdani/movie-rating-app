import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useSelector} from 'react-redux';
import {
    useMediaQuery,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
    Box, Typography, Tooltip, CardMedia, CardContent, Card
} from '@mui/material';
import FavoriteComponent from './Favorite';
import RatingComponent from './Rating';
import SectionHeading from "./SectionHeading";
import {KeyboardArrowUp as SortAscending, KeyboardArrowDown as SortDescending} from '@mui/icons-material';
import Review from "./Review";


import {fetchDetailsAndMemoize} from "../api/services/detailandmemoService";

function HistoryTable() {
    const {ratings} = useSelector(state => state.ratings);
    const {items: favorites} = useSelector(state => state.favorites);
    const {reviews} = useSelector(state => state.reviews);
    const [moviesDetails, setMoviesDetails] = useState([]);
    const [movies, setMoviesList] = useState([]);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const noDataImageUrl = 'https://static.thenounproject.com/png/1496955-200.png';


    const getMovieDetails = useCallback(async (imdbID, type, comp) => {
        const response = await fetchDetailsAndMemoize(imdbID, type, comp);
        return response;
    }, []);

    const truncateText = (text) => {
        const words = text.split(' ');
        const truncated = words.slice(0, 5).join(' ');
        return words.length > 10 ? `${truncated}...` : truncated;
    };
    const fetchMovieDetails = useCallback(async () => {
        const moviesData = [];
        await Promise.all(movies.map(async (movie_item) => {
            const movieDetails = await getMovieDetails(movie_item.id, movie_item.type || movie_item.Type, "history");
            if (movieDetails) {
                moviesData.push({
                    [movie_item.id]: movieDetails
                });
            }
        }));
        setMoviesDetails(moviesData);
    }, [movies, getMovieDetails]); // Add `movies` and `getMovieDetails` as dependencies


    const getMovies = useCallback(async () => {
        const favoriteIds = favorites.map(fav => `${fav.movie_id}:${fav.type}`);
        const ratingIds = ratings.map(ratingObject => {
            const [id, details] = Object.entries(ratingObject)[0];
            return `${id}:${details.type}`;
        });
        const reviewIds = reviews.map(reviewObject => {
            const [id, details] = Object.entries(reviewObject)[0];
            return `${id}:${details.type}`;
        });
        const movies_list = Array.from(new Set([...favoriteIds, ...ratingIds, ...reviewIds]));

        const movies_list_json = movies_list.map(movie => {
                const [id, type] = movie.split(":");

                return {id, type};

            }
        );
        setMoviesList(movies_list_json);
    }, [favorites, ratings, reviews]);

    useEffect(() => {
        getMovies();
    }, [getMovies]);

    useEffect(() => {
        fetchMovieDetails();
    }, [fetchMovieDetails]); // `fetchMovieDetails` is now a dependency




    const isXsScreen = useMediaQuery((theme) => theme.breakpoints.down('md'));

    const handleSort = (column) => {
        if (column === sortColumn) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const sortedMovies = useMemo(() => {
        if (!sortColumn) {
            return moviesDetails;
        }


        const comparator = (movieObjA, movieObjB) => {
            const tempmovieDetailsA = Object.entries(movieObjA)[0][1];
            const tempmovieDetailsB = Object.entries(movieObjB)[0][1];


            const valueA = tempmovieDetailsA[sortColumn] || '';
            const valueB = tempmovieDetailsB[sortColumn] || '';

            if (valueA < valueB) {
                return sortDirection === 'asc' ? -1 : 1;
            }
            if (valueA > valueB) {
                return sortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        };

        return [...moviesDetails].sort(comparator);
    }, [moviesDetails, sortColumn, sortDirection]);


    return (
        <div style={{width: '100%'}}>
            <SectionHeading title="History Table"/>
            {sortedMovies.length === 0 ? (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="370px"

                    flexDirection="column"
                    sx={{p: 4, width: "100%"}}
                >
                    <Card
                        sx={{
                            maxWidth: "100%",
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            p: 2,
                            boxShadow: 3,
                        }}
                    >
                        <CardMedia
                            component="img"
                            image={noDataImageUrl}
                            alt="No data available"
                            sx={{
                                width: "auto",
                                height: "40%"
                            }}
                        />
                        <CardContent sx={{width: "50%"}}>
                            <Typography gutterBottom variant="h5" component="div" textAlign="center">
                                No Data Available
                            </Typography>
                            <Typography variant="body2" color="text.secondary" textAlign="center">
                                We couldn't find anything matching your search. Try adjusting your filters or search
                                again with different keywords.
                            </Typography>
                        </CardContent>

                    </Card>
                </Box>

            ) : (
                <TableContainer component={Paper}
                                sx={{mt: 2, maxHeight: '50vh', minHeight: "50vh", overflowY: 'scroll'}}>
                    <Table aria-label="history table" sx={{tableLayout: 'auto'}}>
                        <TableHead>
                            <TableRow>
                                <TableCell onClick={() => handleSort('Title')}>
                                    Name
                                    {sortColumn === 'Title' && (
                                        sortDirection === 'asc' ?
                                            <SortAscending/> : <SortDescending/>
                                    )}
                                </TableCell>
                                <TableCell onClick={() => handleSort('Type')} sx={{whiteSpace: "nowrap", minWidth: 0}}>
                                    Type
                                    {sortColumn === 'Type' && (
                                        sortDirection === 'asc' ?
                                            <SortAscending/> : <SortDescending/>
                                    )}
                                </TableCell>
                                <TableCell onClick={() => handleSort('Genre')} sx={{whiteSpace: "nowrap", minWidth: 0}}>
                                    Genre
                                    {sortColumn === 'Genre' && (
                                        sortDirection === 'asc' ?
                                            <SortAscending/> : <SortDescending/>
                                    )}
                                </TableCell>
                                {isXsScreen && (
                                    <>
                                        <TableCell onClick={() => handleSort('Year')}
                                                   sx={{whiteSpace: "nowrap", minWidth: 0}}>
                                            Year
                                            {sortColumn === 'Year' && (
                                                sortDirection === 'asc' ?
                                                    <SortAscending/> : <SortDescending/>
                                            )}
                                        </TableCell>
                                        <TableCell onClick={() => handleSort('Plot')}>
                                            Plot
                                            {sortColumn === 'Plot' && (
                                                sortDirection === 'asc' ?
                                                    <SortAscending/> : <SortDescending/>
                                            )}
                                        </TableCell>
                                    </>
                                )}
                                <TableCell>Favorite and Rating Score</TableCell>
                                <TableCell>
                                    <Box sx={{display: 'flex', width: '100%'}}>
                                        <Typography variant="body2" sx={{flexGrow: 1}}>
                                            Review
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedMovies.map((movieObj) => {
                                    const [movieId, tempmovieDetails] = Object.entries(movieObj)[0];
                                    return (
                                        <TableRow key={movieId}>


                                            <TableCell sx={{
                                                whiteSpace: 'normal',
                                                overflow: 'hidden',
                                                width: "10%",
                                                textOverflow: 'ellipsis',
                                                wordWrap: 'break-word'
                                            }}>
                                                <Tooltip title={tempmovieDetails?.Title || 'Unknown'} placement="top"
                                                         arrow>
                                                    <div>
                                                        {truncateText(tempmovieDetails?.Title || 'Unknown')}
                                                    </div>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell
                                                style={{
                                                    whiteSpace: 'normal',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}>
                                                {tempmovieDetails?.Type || 'Unknown'}
                                            </TableCell>
                                            <TableCell
                                                style={{
                                                    whiteSpace: 'normal',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}>
                                                {tempmovieDetails?.Genre || 'Unknown'}
                                            </TableCell>

                                            {isXsScreen && (
                                                <>
                                                    <TableCell style={{
                                                        whiteSpace: 'normal',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    }}>
                                                        {tempmovieDetails?.Year || 'Unknown'}
                                                    </TableCell>
                                                    <TableCell sx={{
                                                        whiteSpace: 'normal',
                                                        overflow: 'hidden',
                                                        width: "10%",
                                                        textOverflow: 'ellipsis',
                                                        wordWrap: 'break-word'
                                                    }}>
                                                        <Tooltip title={tempmovieDetails?.Plot || 'Unknown'}
                                                                 placement="top" arrow>
                                                            <div>
                                                                {truncateText(tempmovieDetails?.Plot || 'Unknown')}
                                                            </div>
                                                        </Tooltip>
                                                    </TableCell>

                                                </>
                                            )}
                                            <TableCell>
                                                <div style={{display: 'flex', paddingRight: "10px", width: "auto"}}>
                                                    {/*{console.log("history table",movieId,tempmovieDetails.Type)}*/}
                                                    <FavoriteComponent movieId={movieId} type={tempmovieDetails.Type}
                                                                       size="small"/>
                                                    {/*{console.log("history table", movieId, tempmovieDetails.Type)}*/}

                                                    <RatingComponent movieId={movieId} type={tempmovieDetails.Type}
                                                                     size="small"/>
                                                </div>
                                            </TableCell>
                                            <TableCell sx={{minWidth: "25vw"}}>
                                                <Box sx={{width: '100%'}}>
                                                    <Review movieId={movieId} type={tempmovieDetails.Type}/>
                                                </Box>
                                            </TableCell>
                                        </TableRow>

                                    );
                                }
                            )}

                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
}

export default HistoryTable;
