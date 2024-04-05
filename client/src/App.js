import React, {useEffect, useState} from 'react';
import {Box, CssBaseline} from '@mui/material';
import NavBar from './components/NavBar';
import {useDispatch, useSelector} from 'react-redux';
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from './config/firebase-config';
import {setUser, clearUser, setSnackbar} from './features/auth/authSlice';
import {fetchFavorites} from "./features/favorite/favoriteSlice";
import {fetchRatings} from "./features/rating/ratingSlice";
import {fetchUserId} from "./features/user/userSlice";
import MovieCarousel from "./components/MovieCarousel";
import Footer from "./components/footer";
import MovieGrid from "./components/MovieGrid";
import HistoryTable from "./components/HistoryTable";
import Dashboard from "./components/DashBoard";
import SearchBar from "./components/SearchBar";
import {fetchReviews} from "./features/review/reviewSlice";
import {fetchRecommendations} from "./features/recommendation/recommendationSlice";
import { Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';
function App() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const userId = useSelector((state) => state.user.userId);
    const favorites = useSelector((state) => state.favorites.items);
    const ratings = useSelector((state) => state.ratings.ratings);
    const reviews = useSelector((state) => state.reviews.reviews);
    const recommendations = useSelector(state => state.recommendations.recommendations);
    const snackbar = useSelector((state) => state.auth.snackbar);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        dispatch(setSnackbar({ ...snackbar, open: false }));
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            localStorage.clear()
            if (currentUser) {

                const userInfo = {
                    uid: currentUser.uid,
                    email: currentUser.email,

                };
                dispatch(setUser(userInfo));

                dispatch(fetchUserId(currentUser.email))
                    .then((action) => {
                        if (action.payload) {
                            const userId = action.payload;
                            dispatch(fetchRatings(userId));

                            dispatch(fetchFavorites(userId));

                            dispatch(fetchReviews({userId:userId}));
                            dispatch(fetchRecommendations(userId))

                        }
                    })
                    .catch(error => {
                        console.error('Error fetching user ID and data:', error);
                    });
            } else {
                dispatch(clearUser());
            }
        });

        return () => unsubscribe();
    }, [dispatch]);


    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh'
        }}>
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
            <CssBaseline/>
            <NavBar/>

            <Box component="main" sx={{flex: 1,paddingX:"1vw"}}>
                <MovieCarousel/>
                <Dashboard>
                    <HistoryTable />
                    <SearchBar />
                    <MovieGrid />
                </Dashboard>
                <div>
                    <p>User ID: {userId}</p>
                    <p>User: {user?.email}</p>
                    <p>Favorites: {JSON.stringify(favorites)}</p>
                    <p>Ratings: {JSON.stringify(ratings)}</p>
                    <p>Reviews: {JSON.stringify(reviews)}</p>
                    <p>recommendations: {JSON.stringify(recommendations)}</p>

                </div>
            </Box>

            <Footer/>
        </Box>
    );
}

export default App;
