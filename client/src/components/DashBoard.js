import React from 'react';
import {Grid} from "@mui/material";

const MainComponent = ({children}) => {
    const movieGridRef = React.useRef(null);

    return (
        <Grid container spacing={2} justifyContent="center" alignItems="flex-start"
              style={{maxHeight: "100%", overflow: "auto"}}>
            <Grid item xs={12} md={7} lg={8} ref={movieGridRef}>
                {React.Children.toArray(children)[0]}
            </Grid>
            <Grid item xs={12} md={5} lg={4} container direction="column" justifyContent="flex-start"
                  alignItems="center" wrap="nowrap" style={{maxHeight: "100%", overflow: "auto" ,minHeight:"43vh"}}>
                {React.Children.toArray(children)[1]}
            </Grid>
            <Grid item xs={12} md={12} lg={12} container direction="column" justifyContent="flex-start"
                  alignItems="center" wrap="nowrap" style={{maxHeight: "100%", overflow: "auto"}}>
                {React.Children.toArray(children)[2]}
            </Grid>

        </Grid>
    );

};

export default MainComponent;
