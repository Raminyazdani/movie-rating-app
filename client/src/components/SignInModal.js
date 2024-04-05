import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions } from '@mui/material';
import { useDispatch } from 'react-redux';
import {loginUserWithEmailPassword, loginUserWithGoogle} from '../features/auth/authSlice';
import {queries} from "@testing-library/react";

function SignInModal({ open, onClose }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    const handleGoogleSignIn = () => {
        dispatch(loginUserWithGoogle());
        onClose();
    };

    const handleEmailSignIn = () => {
        dispatch(loginUserWithEmailPassword({ email:email, password:password })).then((action) => {

        }
        )
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} sx={{ '& .MuiPaper-root': { backgroundColor: '#222', color: 'white' } }}>
            <DialogTitle>Sign In</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    label="Email"
                    type="email"
                    fullWidth
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputLabelProps={{ style: { color: 'lightgrey' } }}
                    inputProps={{ style: { color: 'white' } }}
                />
                <TextField
                    margin="dense"
                    label="Password"
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputLabelProps={{ style: { color: 'lightgrey' } }}
                    inputProps={{ style: { color: 'white' } }}
                />
            </DialogContent>
            <DialogActions>
                <Button color="inherit" onClick={handleEmailSignIn}>Sign in with Email</Button>
                <Button color="inherit" onClick={handleGoogleSignIn}>Sign in with Google</Button>
            </DialogActions>
        </Dialog>

    );
}

export default SignInModal;
