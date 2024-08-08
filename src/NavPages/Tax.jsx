import React, { useState, useEffect } from 'react';
import { Input, Box, Button, Typography, Table,useMediaQuery, TableBody, TableCell, IconButton, TableContainer, TableHead, TableRow, Paper, FormControl, InputLabel, Modal } from '@mui/material';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import NavBar from '../NavBar';
import axios from "axios";
import base_url from "../utils/API";

function Tax(props) {

  const initialFormData = {
    tax_name: '',
    rate: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [tableData, setTableData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get(`${base_url}/client/api/tax/`);
      setTableData(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setEditMode(false);
    setFormData(initialFormData);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditMode(false);
    setFormData(initialFormData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    if (editMode) {

      const updatedData = [...tableData];
      updatedData[editIndex] = formData;
      setTableData(updatedData);
    } else {
      setTableData([...tableData, formData]);
    }
    setFormData(initialFormData);
    handleCloseModal();
  };

  const handleEdit = (index) => {
    setFormData(tableData[index]);
    setEditMode(true);
    setEditIndex(index);
    setIsModalOpen(true);
  };

  const handleDelete = (index) => {
    const updatedData = [...tableData];
    updatedData.splice(index, 1);
    setTableData(updatedData);
  };
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  return (
    <>

      <Box sx={{ display: "flex", p: 10, flexDirection: isSmallScreen ? "column" : "row" }} >
        <NavBar />
        <Box
          component="main"
          sx={{ flexGrow: 1, width: isSmallScreen ? "100%" : "auto" }}
          aria-label="Payment Section"
        >
          <Modal
            open={isModalOpen}
            onClose={handleCloseModal}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: isSmallScreen ? "100%" : '90%',
                maxWidth: 800,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: { xs: 2, sm: 4 },
                borderRadius: 2,
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
              component="form"
            >
              <Typography id="modal-title" variant="h6" component="h2">
                {editMode ? 'Edit Tax' : 'Add Tax'}
              </Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="tax-name">Tax Name</InputLabel>
                <Input
                  id="tax-name"
                  name="tax_name"
                  value={formData.tax_name}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="tax-rate">Tax Rate</InputLabel>
                <Input
                  id="tax-rate"
                  name="tax_rate"
                  value={formData.tax_rate}
                  onChange={handleChange}
                />
              </FormControl>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button variant="contained" color="success" onClick={handleSubmit}>
                  {editMode ? 'Update' : 'Save'}
                </Button>
                <Button variant="outlined" color="error" onClick={handleCloseModal}>
                  Cancel
                </Button>
              </Box>
            </Box>
          </Modal>

          <Box sx={{ display: "block" }}>
            <TableContainer
              component={Paper}
              sx={{ maxHeight: "100vh", marginTop: 5 }}
            >
              <Table>
                <TableHead sx={{ m: 5, backgroundColor: '#53B789' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white', textAlign: 'center' }}>Tax Name</TableCell>
                    <TableCell sx={{ color: 'white', textAlign: 'center' }}>Tax Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData.map((row) => (
                    <TableRow key={row.tax_id} sx={{ m: 5, height: '3', backgroundColor: '#fff', '&:hover': { backgroundColor: '#dcf0e7' } }}>
                      <TableCell sx={{ textAlign: 'center' }}>{row.tax_name}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{row.rate}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Tax;
