import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions } from '@mui/material';
import { useDispatch } from 'react-redux';
import { signupUserWithEmailPassword, loginUserWithGoogle } from '../features/auth/authSlice';

function SignUpModal({ open, onClose }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    const handleSignUpWithEmailPassword = () => {
        dispatch(signupUserWithEmailPassword({ email, password }));
        onClose();
    };

    const handleSignUpWithGoogle = () => {
        dispatch(loginUserWithGoogle());
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} sx={{ '& .MuiPaper-root': { backgroundColor: '#222', color: 'white' } }}>
            <DialogTitle>Sign Up</DialogTitle>
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
                <Button onClick={handleSignUpWithEmailPassword}>Sign Up</Button>
                <Button onClick={handleSignUpWithGoogle}>Sign Up with Google</Button>
            </DialogActions>
        </Dialog>

    );
}

export default SignUpModal;
