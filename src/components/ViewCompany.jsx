import { Box } from '@mui/material'
import React from 'react'
import NavBar from '../NavBar'

const ViewCompany = () => {
  return (
    <div>
        <Box sx={{ display: "flex", p: 10 }}>
        <NavBar />
        <Box component="main" sx={{ flexGrow: 1 }}>
                <h1>View Comapany here</h1>
        </Box>
        </Box>
    </div>
  )
}

export default ViewCompany