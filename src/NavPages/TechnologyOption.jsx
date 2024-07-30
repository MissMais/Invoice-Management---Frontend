import React, { useState, useEffect } from "react";
import {
  Input,
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  IconButton,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Modal,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import NavBar from "../NavBar";
import axios from "axios";
import base_url from "../utils/API";

function TechnologyOption(props) {
  const initialFormData = {
    opt_id: "",
    option: "",
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
      const response = await axios.get(
        `${base_url}/client/api/technology_option/`
      );
      console.log(response.data);
      setTableData(response.data);
    } catch (err) {
      console.log(err);
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

  return (
    <Box sx={{ display: "block", p: 10, marginLeft: 30 }}>
      <NavBar />
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "3px solid #455a64",
            boxShadow: 24,
            p: 4,
            borderRadius: 4,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            {editMode ? "Edit Tax" : "Add Tech"}
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="opt-id">Option ID</InputLabel>
            <Input
              id="opt-id"
              name="opt_id"
              value={formData.opt_id}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="opt">Option</InputLabel>
            <Input
              id="opt"
              name="option"
              value={formData.option}
              onChange={handleChange}
            />
          </FormControl>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button variant="contained" color="success" onClick={handleSubmit}>
              {editMode ? "Update" : "Save"}
            </Button>
            <Button variant="outlined" color="error" onClick={handleCloseModal}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      <TableContainer component={Paper} sx={{ marginTop: 5 }}>
        <Table>
          <TableHead sx={{ m: 5, backgroundColor: "#53B789" }}>
            <TableRow>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                Option ID
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                Option
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, index) => (
              <TableRow
                key={index}
                sx={{
                  m: 5,
                  height: "3",
                  backgroundColor: "#fff",
                  "&:hover": { backgroundColor: "#dcf0e7" },
                }}
              >
                <TableCell sx={{ textAlign: "center" }}>
                  {row.option_id}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>{row.option}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default TechnologyOption;
