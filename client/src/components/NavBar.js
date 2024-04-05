import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, useTheme, useMediaQuery, Snackbar, Alert } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../features/auth/authSlice';
import SignInModal from './SignInModal'; 
import SignUpModal from './SignUpModal'; 

function NavBar() {
    const [signInModalOpen, setSignInModalOpen] = useState(false);
    const [signUpModalOpen, setSignUpModalOpen] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false); 

    const user = useSelector((state) => state.auth.user);
    const authStatus = useSelector((state) => state.auth.status);
    const authError = useSelector((state) => state.auth.error);

    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));



    const handleSignOut = () => {
        dispatch(logoutUser()).then(() => {
        });

    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    return (

        <AppBar position="sticky" sx={{ mb: 2, background: 'linear-gradient(90deg, #000000 30%, #1c1c1c 90%)', boxShadow: 'none' }}>

            <Toolbar>
                <Typography variant="h4" sx={{ flexGrow: 1, color: '#f0f0f0', fontWeight: 'bold', letterSpacing: '0.1rem' }}>
                    Movie Rater
                </Typography>
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={handleSnackbarClose}
                    message="Logged out successfully"
                    action={
                        <>
                            <Button color="secondary" size="small" onClick={handleSnackbarClose}>
                                UNDO
                            </Button>
                        </>
                    }
                />
                {user ? (
                    <Typography variant="body1" sx={{ marginRight: 10, color: '#c7c7c7', display: isMobile ? 'none' : 'block' }}>
                        Welcome, {user.email}
                    </Typography>
                ) : null}
                {user ? (
                    <Button variant="outlined" color="inherit" onClick={handleSignOut} sx={{ borderColor: '#f0f0f0', color: '#f0f0f0', '&:hover': { backgroundColor: '#555' } }}>
                        Sign Out
                    </Button>
                ) : (
                    <>
                        <Button variant="outlined" color="inherit" onClick={() => setSignInModalOpen(true)} sx={{ color: '#f0f0f0', '&:hover': { backgroundColor: '#555' } }}>
                            Sign In
                        </Button>
                        <Button variant="outlined" color="inherit" onClick={() => setSignUpModalOpen(true)} sx={{ borderColor: '#f0f0f0', color: '#f0f0f0', '&:hover': { backgroundColor: '#555' } }}>
                            Sign Up
                        </Button>
                    </>
                )}
                <SignInModal open={signInModalOpen} onClose={() => setSignInModalOpen(false)} />
                <SignUpModal open={signUpModalOpen} onClose={() => setSignUpModalOpen(false)} />
            </Toolbar>
            <SignInModal open={signInModalOpen} onClose={() => setSignInModalOpen(false)} />
            <SignUpModal open={signUpModalOpen} onClose={() => setSignUpModalOpen(false)} />

        </AppBar>
    );
}

export default NavBar;
