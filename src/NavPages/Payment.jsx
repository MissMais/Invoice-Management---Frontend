import React from 'react';
import AddPayment from '../Payment/AddPayment';
import { Box, useMediaQuery } from '@mui/material';
import NavBar from '../NavBar';

function Payment(props) {
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    return (
        <Box sx={{ display: 'flex', paddingY: 10 , paddingX:5 }}>
            <NavBar />
            <Box 
                component="main" 
                sx={{ flexGrow: 1, width: isSmallScreen ? '100%' : 'auto' }} 
                aria-label="Payment Section"
            >
                <AddPayment />
            </Box>
        </Box>
    );
}

export default Payment;
