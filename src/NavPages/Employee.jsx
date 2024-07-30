import React from 'react';
import { Box, useMediaQuery } from '@mui/material';
import NavBar from '../NavBar';
import AddEmployee from '../Employee/AddEmployee';

function Payment(props) {
    const isSmallScreen = useMediaQuery('(max-width:400px)');

    return (
        <Box sx={{ display: 'flex', p: 10 }}>
            <NavBar />
            <Box 
                component="main" 
                sx={{ flexGrow: 1, width: isSmallScreen ? '100%' : 'auto' }} 
                aria-label="Payment Section"
            >
                <AddEmployee />
            </Box>
        </Box>
    );
}

export default Payment;
