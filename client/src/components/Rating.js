import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {addRating, fetchRatings, removeRating} from '../features/rating/ratingSlice';
import IconButton from '@mui/material/IconButton';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import CancelIcon from '@mui/icons-material/Cancel';
import iconSizes from "./icon-font-size";
import {fetchFavorites} from "../features/favorite/favoriteSlice";
import {fetchRecommendations} from "../features/recommendation/recommendationSlice";
import {setSnackbar} from "../features/auth/authSlice";  

function RatingComponent({movieId, type, size = 'medium'}) {
    const dispatch = useDispatch();
    const {ratings} = useSelector(state => state.ratings);
    const user = useSelector(state => state.auth.user);
    const userId = useSelector(state => state.user.userId);
    const [rating, setRating] = useState(0);



    useEffect(() => {
        const movieRating = ratings.find(rating => Object.keys(rating)[0] === movieId && rating[movieId].type === type);

        if (movieRating) {
            setRating(movieRating[movieId].rating);
        }
    }, [ratings, movieId, type]);

    const handleRateMovie = (ratingValue) => {
        if (!user) {
            dispatch(setSnackbar({
                open: true,
                message: 'Please log in to manage ratings.',
                severity: 'warning', 
            }));            return;
        }
        
        dispatch(addRating({userId: userId, imdbId: movieId, rating: ratingValue, type: type})).then(() => {
            dispatch(fetchRatings(userId));

        }).then(() => {
                dispatch(fetchRecommendations(userId)
                );
            }
        );


        setRating(ratingValue);
    };

    const handleRemoveRating = () => {
        if (!user) {
            dispatch(setSnackbar({
                open: true,
                message: 'Please log in to manage ratings.',
                severity: 'warning', 
            }));            return;
        }

        dispatch(removeRating({userId: userId, imdbId: movieId, type: type})).then(() => {
            dispatch(fetchRatings(userId));

        }).then(() => {
                dispatch(fetchRecommendations(userId)
                );
            }
        );

        setRating(0);  
    };

    return (
        <div style={{display: 'flex', flexWrap: 'nowrap', maxWidth: '100%', justifyContent: "center"}}>
            {[1, 2, 3, 4, 5].map((star) => (
                <IconButton
                    key={star}
                    onClick={() => handleRateMovie(star)}
                    color={star <= rating ? "primary" : "default"}
                    sx={{
                        flex: '1 0 auto',
                        maxWidth: '20%', 
                        fontSize: iconSizes.fontSize,
                        paddingX: 0
                    }}
                >
                    {star <= rating ? <StarIcon sx={{margin: "auto", fontSize: iconSizes.fontSize}}/> :
                        <StarBorderIcon sx={{margin: "auto", fontSize: iconSizes.fontSize}}/>}
                </IconButton>
            ))}
            {rating > 0 && (
                <IconButton
                    onClick={handleRemoveRating}
                    color="error"
                    sx={{
                        flex: '1 0 auto',
                        maxWidth: '20%',
                        fontSize: iconSizes.fontSize,
                    }}
                >
                    <CancelIcon sx={{margin: "auto", fontSize: iconSizes.fontSize}}/>
                </IconButton>
            )}
        </div>
    );
}

export default RatingComponent;
