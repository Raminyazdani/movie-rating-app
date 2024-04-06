import {useSelector} from "react-redux";
import {useEffect, useRef, useState} from "react";
import SectionHeading from "./SectionHeading";
import {Box, Card, CardContent, CardMedia, Grid, ToggleButton, ToggleButtonGroup, Typography} from "@mui/material";
import RatingComponent from "./Rating";
import Review from "./Review";
import FavoriteComponent from "./Favorite";
import {getMovieGrid} from "../api/services/gridService";


import {fetchDetailsAndMemoize} from "../api/services/detailandmemoService";

const MovieGrid = () => {
    const [filterOption, setFilterOption] = useState('all');
    const [contentOption, setContentOption] = useState('day');
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false); // Initially not loading
    const [page, setPage] = useState(1);
    const defaultImageUrl = 'YOUR_DEFAULT_IMAGE_URL_HERE';
    const {recommendations} = useSelector((state) => state.recommendations);
    const observer = useRef();
    const loadingRef = useRef(loading); // Use a ref for loading state to use in the observer callback
    const noDataImageUrl = 'https://static.thenounproject.com/png/1496955-200.png';

    useEffect(() => {
        loadingRef.current = loading; // Update loading ref during loading state changes
    }, [loading]);



    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            if (contentOption === null || filterOption === null) {
                setMovies([]); // Reset movies if options are not set
                setLoading(true);
                return
            }

            try {
                if (contentOption === "recommended") {
                    let data = recommendations; // Use 'let' to declare 'data' so it's mutable and accessible throughout

                    if (filterOption === "movie") {
                        data = recommendations.filter(recommendation => recommendation.type === "movie");
                    } else if (filterOption === "tv") {
                        data = recommendations.filter(recommendation => recommendation.type === "tv");
                    }
                    // No need for 'all' and 'else' case if 'data' is initially set to 'recommendations'

                    const detailsPromises =await Promise.all(data.map(item => fetchDetailsAndMemoize(item.movie_id, item.type,"recom")));


                    console.log("recom : ",detailsPromises)
                    setMovies(detailsPromises);
                    setLoading(false);
                    return;
                }



                const data = await getMovieGrid(filterOption, contentOption, page);

                setMovies(prev => page === 1 ? data : [...prev, ...data]); // Append new movies or replace based on page
                console.log(contentOption,":",movies)
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch movies:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [filterOption, contentOption, page]);

    useEffect(() => {
        if (contentOption=== 'recommended') return; // Skip observer for recommendations


        if (observer.current) observer.current.disconnect(); // Reset observer on dependency change

        const callback = entries => {
            if (entries[0].isIntersecting && !loadingRef.current) {
                setPage(prev => prev + 1); // Increment page to fetch more data
            }
        };

        observer.current = new IntersectionObserver(callback, {
            root: null,
            rootMargin: '20px',
            threshold: 0.1,
        });

        // Attach observer to the last movie card
        const lastMovieCard = document.querySelector('.movie-card:last-of-type');
        if (lastMovieCard) observer.current.observe(lastMovieCard);

        return () => observer.current.disconnect();
    }, [movies, loading]); // Re-attach observer when movies or loading state changes

    // Handler functions remain the same
    const handleFilterChange = (event, newOption) => {
        setPage(1); // Reset page
        setFilterOption(newOption);
    };

    const handleContentChange = (event, newOption) => {
        setPage(1); // Reset page
        setContentOption(newOption);
    };


    return (
        <>
            <SectionHeading title="Discover Movies"/>
            <Box sx={{display: 'flex', justifyContent: 'center', mt: 2}}>
                <ToggleButtonGroup
                    color="primary"
                    value={filterOption}
                    exclusive
                    onChange={handleFilterChange}
                    sx={{mr: 4}}
                >
                    <ToggleButton value="all">All</ToggleButton>
                    <ToggleButton value="movie">Movies</ToggleButton>
                    <ToggleButton value="tv">Tv</ToggleButton>
                </ToggleButtonGroup>
                <ToggleButtonGroup
                    color="secondary"
                    value={contentOption}
                    exclusive
                    onChange={handleContentChange}
                >
                    <ToggleButton value="day">Trending Today</ToggleButton>
                    <ToggleButton value="week">Trending Past Week</ToggleButton>
                    <ToggleButton value="recommended">What You Might Like</ToggleButton>
                    {/*<ToggleButton value="Similar">Similar to favorites</ToggleButton>*/}
                    {/* Add new toggle buttons */}
                </ToggleButtonGroup>
            </Box>

            <Box sx={{flexGrow: 1, padding: 2, overflowY: 'scroll', maxHeight: "90vh", width: "100%"}}>
                {movies.length > 0 ? (
                    <Grid container spacing={2} width={"100%"}>
                        {(contentOption === 'recommended' ? movies : movies).map((movie, index) => (
                            <Grid item xs={6} sm={4} md={3} lg={2} key={index} className="movie-card">
                                <Card sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    boxShadow: 3,
                                    width: '100%',
                                    height: '100%'
                                }}>
                                    <Box sx={{
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        width: '100%',
                                        height: 200,
                                    }}>
                                        <img
                                            src={movie.Poster !== 'N/A' ? movie.Poster : defaultImageUrl}
                                            alt={movie.Title}
                                            style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                        />
                                    </Box>
                                    <CardContent sx={{width: '100%'}}>
                                        <Typography variant="body2" noWrap
                                                    sx={{fontSize: '1rem', fontWeight: 'bold', textAlign: "center"}}>
                                            {movie.Title}
                                        </Typography>
                                        <Box sx={{
                                            borderRadius: '4px',
                                            padding: '2px 6px',
                                            textAlign: 'center',
                                            backgroundColor: movie.Type === 'tv' ? '#388e3c' : '#1976d2'
                                        }}>
                                            <Typography variant="caption"
                                                        sx={{color: '#ffffff', fontWeight: "bold", fontSize: "1em"}}>
                                                {movie.Type}
                                            </Typography>
                                        </Box>
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: "center",
                                            maxWidth: '100%',
                                            flexWrap: {xs: "wrap", md: "wrap"}
                                        }}>
                                            {/*{console.log("moviegrid",movie.imdbID, movie.Type)}*/}
                                            <FavoriteComponent movieId={movie.imdbID} type={movie.Type} size="small"/>
                                            <RatingComponent movieId={movie.imdbID} type={movie.Type} size="small"/>
                                        </Box>
                                        {/*{console.log("review table", movie.imdbID, movie.Type)}*/}

                                        <Review movieId={movie.imdbID} type={movie.Type}/>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height="370px"
                        flexDirection="column" // Stack items vertically
                        sx={{p: 4, width: "100%"}} // Add some padding around the box for spacing
                    >
                        <Card
                            sx={{
                                maxWidth: "100%", // Set a max width for the card
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center', // Center card items vertically
                                p: 2, // Padding inside the card for spacing
                                boxShadow: 3, // Elevate the card for focus
                                width: "100%"
                            }}
                        >
                            <CardMedia
                                component="img"
                                image={noDataImageUrl}
                                alt="No data available"
                                sx={{
                                    width: "auto",
                                    height: "40%"
                                }} // Use sx for styling instead of style prop for consistency
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
                )}
            </Box>
        </>
    );
}

export default MovieGrid;
