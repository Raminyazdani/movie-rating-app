import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {likeMovie, fetchFavorites, unlikeMovie} from '../features/favorite/favoriteSlice';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import iconSizes from "./icon-font-size";
import {fetchRecommendations} from "../features/recommendation/recommendationSlice";
import {setSnackbar} from "../features/auth/authSlice";

function FavoriteComponent({movieId, type, size}) {
    const dispatch = useDispatch();
    const items = useSelector(state => state.favorites.items);
    const user = useSelector(state => state.auth.user);
    const userId = useSelector(state => state.user.userId);
    const [isFavorite, setIsFavorite] = useState(false);
    useEffect(() => {

        const isFavorite = items.some(item => item.movie_id === movieId && item.type === type);

        setIsFavorite(isFavorite);
    }, [items, movieId, type]);

    const handleToggleFavorite = () => {
        if (!user) {
            dispatch(setSnackbar({
                open: true,
                message: 'Please log in to manage favorites.',
                severity: 'warning',
            }));
            return;
        }

        if (isFavorite) {
            dispatch(unlikeMovie({userId: userId, imdbId: movieId, type: type})).then(() => {
                    dispatch(fetchFavorites(userId)
                    );
                }
            ).then(() => {
                    dispatch(fetchRecommendations(userId)
                    );
                }
            );
        } else {
            dispatch(likeMovie({userId: userId, imdbId: movieId, type: type})).then(() => {
                    dispatch(fetchFavorites(userId)
                    );
                }
            ).then(() => {
                    dispatch(fetchRecommendations(userId)
                    );
                }
            );
            ;
        }

    };

    return (
        <IconButton onClick={handleToggleFavorite} color="error" size={size}>
            {isFavorite ? <FavoriteIcon sx={{margin: "auto", fontSize: iconSizes.fontSize}}/> :
                <FavoriteBorderIcon sx={{fontSize: iconSizes.fontSize}}/>}
        </IconButton>
    );
}

export default FavoriteComponent;
