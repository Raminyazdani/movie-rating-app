import React from 'react';
import {Box, Container, Typography, Link} from '@mui/material';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: '2vh',

                backgroundColor: '#1c1c1c',
                color: 'lightgrey',
            }}
        >
            <Container maxWidth="sm">
                <Typography variant="body1" align="center">
                    My Movie Rater Website
                </Typography>
                <Typography variant="body2" align="center" sx={{color: 'grey'}}>
                    © {new Date().getFullYear()}{' '}
                    <Link color="inherit" href="https://yourwebsite.com/" sx={{color: 'lightblue'}}>
                        Your Website
                    </Link>
                </Typography>
            </Container>
        </Box>

    );
};

export default Footer;
