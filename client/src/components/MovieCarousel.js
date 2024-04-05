import React, {useEffect, useState, useMemo} from 'react';
import {apiMovie, getMovieCarousel} from '../config/apiClient';
import Carousel from 'react-material-ui-carousel';
import {Box, Button, Card, CardContent, CircularProgress, Typography} from "@mui/material";
import FavoriteComponent from './Favorite';
import RatingComponent from "./Rating";
import SectionHeading from "./SectionHeading";
import Review from "./Review";

const defaultImageUrl = 'https://motivatevalmorgan.com/wp-content/uploads/2016/06/default-movie-768x1129.jpg';

const MovieCarousel = () => {
    const [category, setCurrentCategory] = useState('now_playing');

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                const data = await getMovieCarousel(category);
                setMovies(data);
            } catch (error) {
                console.error('Failed to fetch movies for category:', category, error);
                setMovies([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [category]);


    const handleCategoryChange = (category) => {
        setCurrentCategory(category);
    };
    return (
        <>
            <SectionHeading title="Featured Movies" />
            <Box display="flex" justifyContent="center" my={2} flexWrap="wrap">
                <Button
                    variant={category === 'now_playing' ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => handleCategoryChange('now_playing')}
                    sx={{ m: 1 }}
                >
                    Now Playing
                </Button>
                <Button
                    variant={category === 'popular' ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => handleCategoryChange('popular')}
                    sx={{ m: 1 }}
                >
                    Popular
                </Button>
                <Button
                    variant={category === 'top_rated' ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => handleCategoryChange('top_rated')}
                    sx={{ m: 1 }}
                >
                    Top Rated
                </Button>
                <Button
                    variant={category === 'upcoming' ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => handleCategoryChange('upcoming')}
                    sx={{ m: 1 }}
                >
                    Upcoming
                </Button>
            </Box>
            {!category ? (
                <Box display="flex" justifyContent="center" alignItems="center" height={500}>
                    <Typography variant="h5">Nothing selected</Typography>
                </Box>
            ) : loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height={500}>
                    <CircularProgress/>
                    {/* Alternatively, for a simple text message:
                    <Typography>Loading...</Typography> */}
                </Box>
            ) : (
                <Carousel animation="slide" sx={{mt: 2}}>
                    {movies.map((movie, index) => (
                        <Card key={index} sx={{position: 'relative', height: 500}}>
                            <img
                                src={movie.Poster !== 'N/A' && movie.Poster !== '' ? movie.Poster : defaultImageUrl}
                                alt={movie.Title}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    filter: 'blur(10px)',
                                    objectFit: 'cover',
                                    zIndex: 1
                                }}
                            />

                            <Box sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                zIndex: 2,
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            }}>
                                <Box sx={{
                                    width: 300,
                                    alignSelf: 'center',
                                    p: 2
                                }}>
                                    <img
                                        src={movie.Poster !== 'N/A' && movie.Poster !== '' ? movie.Poster : defaultImageUrl}
                                        alt={movie.Title}
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            objectFit: 'cover',
                                            borderRadius: 10
                                        }}
                                    />
                                </Box>

                                <Box sx={{
                                    flexGrow: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    px: 3,
                                    color: 'white',
                                }}>
                                    <CardContent sx={{
                                        padding: '16px',
                                        background: 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(0,0,0,0.6))',
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: '8px',
                                        color: '#f0f0f0',
                                        border: '1px solid rgba(255, 255, 255, 0.15)',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                                    }}>
                                        <Typography variant="h4" component="h2" gutterBottom
                                                    sx={{fontWeight: 'bold', marginBottom: '8px', color: '#ffffff'}}>
                                            {movie.Title}
                                        </Typography>
                                        <div style={{display: "flex" }} sx={{margin:2}}>
                                            <Review movieId={movie.imdbID} type={movie.Type}/>
                                            {/*{console.log("movie carousel ",movie.imdbI,movie.Type)}*/}

                                            <FavoriteComponent movieId={movie.imdbID} type={movie.Type}/>
                                            <RatingComponent movieId={movie.imdbID} type={movie.Type}/>
                                        </div>
                                        <Box sx={{display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '8px'}}>
                                            <Box sx={{background: '#6a1b9a', borderRadius: '4px', padding: '2px 6px'}}>
                                                <Typography variant="caption" sx={{color: '#ffffff'}}>
                                                    {movie.Year}
                                                </Typography>
                                            </Box>
                                            <Box sx={{background: '#c2185b', borderRadius: '4px', padding: '2px 6px'}}>
                                                <Typography variant="caption" sx={{color: '#ffffff'}}>
                                                    {movie.Genre}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Typography variant="body1" gutterBottom
                                                    sx={{marginBottom: '8px', fontWeight: 'medium', color: '#dddddd'}}>
                                            IMDb Rating: <span
                                            style={{fontWeight: 'bold', color: '#ffeb3b'}}>{movie.imdbRating}</span>
                                        </Typography>

                                        <Box sx={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                                            <Box sx={{background: '#1976d2', borderRadius: '4px', padding: '2px 6px'}}>
                                                <Typography variant="caption" sx={{color: '#ffffff'}}>
                                                    Type: {movie.Type}
                                                </Typography>
                                            </Box>
                                            <Box sx={{background: '#388e3c', borderRadius: '4px', padding: '2px 6px'}}>
                                                <Typography variant="caption" sx={{color: '#ffffff'}}>
                                                    IMDb ID: {movie.imdbID}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Typography variant="body2"
                                                    sx={{opacity: 0.85, color: '#e0e0e0', marginTop: '12px'}}>
                                            Plot: {movie.Plot.length > 150 ? `${movie.Plot.substring(0, 150)}...` : movie.Plot}
                                        </Typography>
                                    </CardContent>
                                </Box>
                            </Box>
                        </Card>
                    ))}
                </Carousel>)}
        </>
    );

};

export default MovieCarousel;
