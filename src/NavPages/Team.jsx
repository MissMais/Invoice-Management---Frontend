import React, { useState } from "react";
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
import { FaTableColumns } from "react-icons/fa6";

function Team(props) {
  const initialFormData = {
    team_id: "",
    team_name: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [tableData, setTableData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

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
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          onClick={handleOpenModal}
          size="medium"
          variant="contained"
          sx={{
            color: "white",
            backgroundColor: "#01579b",
            borderRadius: 2,
            "&:hover": { color: "black", backgroundColor: "#90caf9" },
          }}
        >
          ADD
        </Button>
      </Box>

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
            <InputLabel htmlFor="tem-id">Team ID</InputLabel>
            <Input
              id="tem-id"
              name="team_id"
              value={formData.team_id}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="team-name">Team Name</InputLabel>
            <Input
              id="team-name"
              name="team_name"
              value={formData.team_name}
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

      <TableContainer
        component={Paper}
        sx={{ maxHeight: "100vh", marginTop: 5 }}
      >
        <Table>
          <TableHead sx={{ m: 5, backgroundColor: "#0097a7" }}>
            <TableRow>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                Team ID
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                {" "}
                Team Name
              </TableCell>

              <TableCell sx={{ color: "white", textAlign: "center" }}>
                Action
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
                  "&:hover": { backgroundColor: "#e0f7fa" },
                }}
              >
                <TableCell sx={{ textAlign: "center" }}>
                  {row.team_id}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {row.team_name}
                </TableCell>

                <TableCell sx={{ textAlign: "center" }}>
                  <IconButton
                    onClick={() => handleEdit(index)}
                    aria-label="edit"
                    sx={{ color: "grey" }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(index)}
                    aria-label="delete"
                    sx={{ color: "red" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Team;





