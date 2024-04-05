import React, {useEffect, useState} from 'react';
import {
    Box,
    TextField,
    List,
    ListItem,
    ListItemText,
    Card,
    CardContent,
    Typography,
    CardMedia,
    ToggleButton,
    ToggleButtonGroup, Grid
} from '@mui/material';
import SectionHeading from "./SectionHeading";
import {
    apiMovie,
    fetchByTitle,
    fetchDetailsAndMemoize,
} from "../config/apiClient";
import FavoriteComponent from './Favorite';
import RatingComponent from "./Rating";
import Review from "./Review";

const defaultImageUrl = 'https://cdn-icons-png.flaticon.com/512/0/375.png'; // Your default poster image URL

const SearchComponent = () => {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [searchType, setSearchType] = useState('movie');

    useEffect(() => {
        const performSearch = async () => {
            if (query.trim().length > 2) {
                try {
                    const response = await fetchByTitle(query, searchType);

                    setSearchResults(response);
                } catch (error) {
                    console.error('Error searching movies/TV shows:', error);
                }
            } else {
                setSearchResults([]);
            }
        };

        performSearch();
    }, [query, searchType]);

    const handleInputChange = (event) => {
        setQuery(event.target.value);
    };


    const handleSelectMovie = async (movie) => {

        setSelectedMovie(movie);

        setQuery(movie.Title);
        setSearchResults([])

    };


    const handleTypeChange = (event, newType) => {
        if (newType !== null) {
            setSearchType(newType);
        }
    };

    return (
        <>
            <Box sx={{position: 'relative', flexGrow: 1, width: "100%", maxHeight: '58vh', minHeight: "58vh"}}>
                <SectionHeading title="Search Movie or Tv"/>
                <Box sx={{display: 'flex', flexDirection: 'column', position: 'relative', mt: 2}}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <TextField
                            variant="outlined"
                            placeholder="Search movies..."
                            value={query}
                            onChange={handleInputChange}
                            sx={{flexGrow: 1, mr: 2}}
                        />
                        <ToggleButtonGroup
                            color="primary"
                            value={searchType}
                            exclusive
                            onChange={handleTypeChange}
                        >
                            <ToggleButton value="movie">Movies</ToggleButton>
                            <ToggleButton value="tv">Tv</ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                    {searchResults.length > 0 && (
                        <List sx={{
                            position: 'absolute',
                            top: '100%',
                            width: '100%',
                            maxHeight: 'auto',
                            overflow: 'auto',
                            zIndex: 1000,
                            bgcolor: 'background.paper',
                            mt: 2,
                        }}>
                            {searchResults.map((movie) => (

                                <ListItem button key={movie.imdbID} onClick={() => handleSelectMovie(movie)}>
                                    <img src={movie.Poster !== 'N/A' ? movie.Poster : defaultImageUrl} alt={movie.Title}
                                         style={{
                                             minWidth: "50px",
                                             marginRight: "15px",
                                             width: '50px',
                                             height: '75px',
                                             objectFit: 'cover'
                                         }}/>
                                    <ListItemText primary={movie.Title} secondary={`Year: ${movie.Year}`}/>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box>

                {selectedMovie ? (
                    <Card sx={{
                        display: 'block',
                        mt: 2,
                        maxWidth: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        maxHeight: "100%",
                        minHeight: "100%",

                    }}>
                        <Grid container spacing={0} minHeight="43vh">
                            <Grid container spacing={2} alignItems="stretch">
                                {/* Image Column */}
                                <Grid item xs={2} md={4}>
                                    <CardMedia
                                        component="img"
                                        image={selectedMovie.Poster !== 'N/A' ? selectedMovie.Poster : defaultImageUrl}
                                        sx={{ minHeight: "15vh", width: '100%', objectFit: 'cover' , }}
                                        alt={selectedMovie.Title}
                                    />
                                </Grid>
                                {/* Details Column */}
                                <Grid item xs={10} md={8} container direction="column" justifyContent="space-between">
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="h4" component="h2" gutterBottom
                                                    sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
                                            {selectedMovie.Title}
                                        </Typography>
                                        <div style={{ display: "flex" }}>
                                            {/*{console.log("search",selectedMovie.imdbID, selectedMovie.Type)}*/}
                                            <FavoriteComponent movieId={selectedMovie.imdbID} type={selectedMovie.Type}/>
                                            <RatingComponent movieId={selectedMovie.imdbID} type={selectedMovie.Type}/>
                                        </div>
                                        <Box sx={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
                                            <Box sx={{ background: '#6a1b9a', borderRadius: '4px', padding: '2px 6px' }}>
                                                <Typography variant="caption" sx={{ color: '#ffffff' }}>
                                                    {selectedMovie.Year}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ background: '#c2185b', borderRadius: '4px', padding: '2px 6px' }}>
                                                <Typography variant="caption" sx={{ color: '#ffffff' }}>
                                                    {selectedMovie.Genre}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body1" gutterBottom sx={{ fontWeight: 'medium' }}>
                                                IMDb Rating: <span style={{ fontWeight: 'bold', color: '#ffeb3b' }}>{selectedMovie.imdbRating}</span>
                                            </Typography>
                                            <Box sx={{ background: '#1976d2', borderRadius: '4px', padding: '2px 6px' }}>
                                                <Typography variant="caption" sx={{ color: '#ffffff' }}>
                                                    Type: {selectedMovie.Type}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ background: '#388e3c', borderRadius: '4px', padding: '2px 6px' }}>
                                                <Typography variant="caption" sx={{ color: '#ffffff' }}>
                                                    IMDb ID: {selectedMovie.imdbID}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Grid>
                            </Grid>

                            {/* Second Row - Plot */}
                            <Grid item xs={12} sx={{ mt: 2, paddingX: 2 }}>
                                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                                    Plot: {selectedMovie.Plot.length > 150 ? `${selectedMovie.Plot.substring(0, 150)}...` : selectedMovie.Plot}
                                </Typography>
                            </Grid>

                            {/* Third Row - Review */}
                            <Grid item xs={12} sx={{ mt: 2, paddingX: 2 }}>
                                <Box sx={{ borderRadius: '4px', padding: '2px 6px',mb:1 }}>
                                    <Review movieId={selectedMovie.imdbID} type={selectedMovie.Type}/>
                                </Box>
                            </Grid>


                        </Grid>
                    </Card>
                ) : (
                    <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                        <Typography variant="h5">Nothing selected</Typography>
                    </Box>
                )}


            </Box>
        </>
    )
        ;
};

export default SearchComponent;
