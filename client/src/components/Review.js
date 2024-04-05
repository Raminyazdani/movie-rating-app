import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {TextField, Button, Typography, Box, Paper, Alert} from '@mui/material';
import {addReview, fetchReviews} from '../features/review/reviewSlice';
import {fetchFavorites} from "../features/favorite/favoriteSlice";
import {setSnackbar} from "../features/auth/authSlice";

const ReviewComponent = ({movieId, type}) => {
        const dispatch = useDispatch();
        const userId = useSelector((state) => state.user.userId);
        const reviews = useSelector((state) => state.reviews.reviews);
        const [initialReview, setinitReviewText] = useState(reviews.find(review => Object.keys(review)[0] === movieId && review[movieId].type === type) || '');
        const user = useSelector(state => state.auth.user);

        const [reviewText, setReviewText] = useState("");


        const [isEditing, setIsEditing] = useState(false);


        useEffect(() => {
                const review_temp = reviews.find(review => Object.keys(review)[0] === movieId && review[movieId].type === type) || ""
                if (review_temp !== "") {
                    setinitReviewText(review_temp[movieId].review);
                }

            }
            , [reviews, movieId, type]);


        useEffect(() => {
            if (!isEditing && initialReview !== null) {
                setReviewText(initialReview);
            }
        }, [isEditing, initialReview]);

        const handleReviewChange = (e) => {
            if (!user) {
                dispatch(setSnackbar({
                    open: true,
                    message: 'Please log in to manage ratings.',
                    severity: 'warning', 
                }));
                return;
            }
            setReviewText(e.target.value);
        };


        const handleFocus = () => {
            
            if (!user) {
                dispatch(setSnackbar({
                    open: true,
                    message: 'Please log in to manage ratings.',
                    severity: 'warning', 
                }));
                return;
            }
            setIsEditing(true);
        };
        const toggleEdit = () => {
            if (!user) {
                dispatch(setSnackbar({
                    open: true,
                    message: 'Please log in to manage ratings.',
                    severity: 'warning', 
                }));
                return;
            }
            setIsEditing(!isEditing);
        };

        const handleSubmitReview = () => {
            if (!user) {
                dispatch(setSnackbar({
                    open: true,
                    message: 'Please log in to manage ratings.',
                    severity: 'warning', 
                }));
                return;
            }
            if (reviewText.trim() === '') {
                dispatch(setSnackbar({
                    open: true,
                    message: 'rating cannot be empty.',
                    severity: 'warning', 
                }));
                return;
            }
            dispatch(addReview({userId, movieId, review: reviewText.trim(), type: type})).then(() => {
                    dispatch(fetchReviews({userId: userId}
                    ));
                }
            ).then(() => {
                    dispatch(fetchFavorites(userId)
                    );
                }
            );
            setinitReviewText(reviewText.trim());
            setIsEditing(false); 
        };
        const handleCancelReview = () => {
            setReviewText(initialReview);
            setIsEditing(false); 
        };
        return !user ? (
                <Paper sx={{padding: 2}}>
                    <Alert severity="info" sx={{fontSize:"0.6em"}}>
                        Reviews are temporarily disabled
                    </Alert>
                </Paper>)

            :
            (
                <Box display="flex" flexDirection="column" gap={1} sx={{marginY: 2}}>
                    <input
                        type="text"
                        placeholder="Your Review"
                        value={reviewText}
                        onChange={handleReviewChange}
                        onFocus={handleFocus}
                        style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: isEditing ? '1px solid #ced4da' : 'none',
                            borderRadius: '4px',
                            boxSizing: 'border-box',
                            lineHeight: '1.5',
                            fontSize: '1rem',
                            outline: 'none',
                            backdropFilter: 'blur(10px)',
                            transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                            backgroundColor: isEditing ? "gray" : "lightgray",
                            color: isEditing ? "white" : "black",
                        }}
                    />


                    {isEditing && (
                        <Box display="flex" gap={1}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmitReview}
                                sx={{flexGrow: 5}} 
                            >
                                Submit
                            </Button>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: 'red', 
                                    color: '#fff', 
                                    '&:hover': {
                                        backgroundColor: 'darkred', 
                                    },
                                    flexGrow: 1, 
                                }}
                                onClick={handleCancelReview}
                            >
                                X
                            </Button>
                        </Box>
                    )}
                </Box>
            );
    }
;
const ReviewTemporarilyDisabled = () => (
    <Paper sx={{padding: 2}}>
        <Typography variant="h6">Reviews are temporarily disabled.</Typography>
        <Alert severity="info">
            Reviews are temporarily disabled
        </Alert>
    </Paper>
);


export default ReviewComponent;
