import React,{useState} from 'react';
import { Button, Box, Table, TableBody, TableCell, TextField, IconButton, TableContainer, TableHead, TableRow, Paper, } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function PaymentTable({ data, edit, dlt, setOpen }) {
  const [search, setSearch] = useState("");
  const handleAddClick = () => {
    edit({});
    setOpen(true);
  };

  return (
    <>
      <Box sx={{ display: 'block'  }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          
          <TextField
            type="search"
            placeholder="Enter the Invoice ID"
            onChange={(e) => setSearch(e.target.value)}
            variant="outlined"
            sx={{ flex: 1, mr: 2, '& .MuiOutlinedInput-root': {height: '43px', width:780, borderRadius: 16 } }}
          />
          <Button
            onClick={handleAddClick}
            size='medium'
            variant='contained'
            sx={{ color: 'white', backgroundColor: '#123270', borderRadius: 2, '&:hover': { color: 'black', backgroundColor: '#53B789' } }}
          >
            ADD
          </Button>
        </Box>
        <TableContainer component={Paper} sx={{ maxHeight: '100vh', marginTop: 5, bgcolor: "#53B789" }}>
          <Table>
            <TableHead sx={{ m: 5, backgroundColor: '#53B789' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', textAlign: 'center' }}>Payment ID</TableCell>
                <TableCell sx={{ color: 'white', textAlign: 'center' }}>Invoice ID</TableCell>
                <TableCell sx={{ color: 'white', textAlign: 'center' }}>Method ID</TableCell>
                <TableCell sx={{ color: 'white', textAlign: 'center' }}>Amount</TableCell>
                <TableCell sx={{ color: 'white', textAlign: 'center' }}>Payment Date</TableCell>
                <TableCell sx={{ color: 'white', textAlign: 'center' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {data &&
                data
                  .filter((e) => {
                    return search.toLowerCase() === ""
                      ? e
                      : e.invoice_id.toLowerCase().includes(search);
                  }).map((e, index) => (
                <TableRow key={index} sx={{ m: 5, height: '3', backgroundColor: '#fff', '&:hover': { backgroundColor: '#dcf0ef' } }}>
                  <TableCell sx={{ textAlign: 'center' }}>{e.id}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{e.invoice_id}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{e.method_id}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>${e.amount}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{e.payment_date}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <IconButton onClick={() => edit(e)} aria-label="edit" sx={{ color: 'grey' }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => dlt(e.id)} aria-label="delete" sx={{ color: 'red' }}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}