import React from 'react';
import {Box, Typography} from '@mui/material';

const SectionHeading = ({title}) => {
    return (
        <Box sx={{
            p: 2,
            background: 'linear-gradient(145deg, #333, #444 , #555, #666, #777, #888, #999, #aaa, #bbb, #ccc, #ddd, #eee, #fff)',
            borderLeft: '5px solid #ffeb3b',
            color: '#ffffff',
            marginBottom: 0,
            // marginTop:3.
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
            width: "100%"
        }}>
            <Typography variant="h4" component="h2" sx={{
                fontSize: '1.1rem',
                fontWeight: 'bold',
                textShadow: '0 2px 2px rgba(0, 0, 0, 0.3)'
            }}>
                {title}
            </Typography>
        </Box>
    );
};

export default SectionHeading;
