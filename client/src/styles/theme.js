import {createTheme} from "@mui/material/styles";

export const theme = createTheme({
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {

                    '&::-webkit-scrollbar': {
                        width: '10px',
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: '#2e2e2e',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#6b6b6b',
                        borderRadius: '10px',
                        border: '2px solid #2e2e2e',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: '#959595',
                    },

                    scrollbarWidth: 'thin',
                    scrollbarColor: '#6b6b6b #2e2e2e',
                },
            },
        },
    },
    palette: {
        mode: 'dark',
        background: {
            default: '#121212',
            paper: '#121212',
        },
    },
});