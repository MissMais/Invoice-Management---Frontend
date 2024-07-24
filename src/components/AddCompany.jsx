import { Box } from '@mui/material'
import React from 'react'
import NavBar from '../NavBar'

const AddCompany = () => {
  return (
    <div>
        <Box sx={{ display: "flex", p: 10 }}>
        <NavBar />
        <Box component="main" sx={{ flexGrow: 1 }}>
                <h1>Add Company Form Here</h1>
        </Box>
        </Box>
    </div>
  )
}

export default AddCompany