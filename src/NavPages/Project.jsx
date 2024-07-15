import React, { useState, useEffect } from "react";
import Select from 'react-select';
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
  List,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import NavBar from "../NavBar";
import axios from "axios";
import base_url from "../utils/API";
function Project(props) {
  const initialFormData = {
    project_name: "",
    duration: "",
    client_id: "",
    team_id: "",
    tech_id: [],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [tableData, setTableData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [Optionid, setOptionid] = useState([]);
  const [tech_id, settech_id] = useState([]);

  
  useEffect(() => {
    getData();
    getDataMultiSelect();
  }, []);
  
  const getDataMultiSelect = async () => {
    try {
      const response = await axios.get(`${base_url}/client/api/technology`);
      // console.log(response.data, "#$%^##");
      setOptionid(response.data.map((tech) => ({
        label:tech.name,
        value: tech.tech_id,
      })));
      
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };
  const getData = async () => {
    try {
      const response = await axios.get(`${base_url}/client/project/`);
      setTableData(response.data);
      console.log(response.data, "#$%^##");
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  function postDataToServer(values) {
    axios
      .post(`${base_url}/client/project/`, formData)
      .then((res) => {
        console.log(res.data);
        getData();
        alert("Project Added Successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const updateDataToServer = async () => {
    try {
      await axios.put(`${base_url}/client/project/`, formData);
      getData();
      alert("Project updated Successfully");
    } catch (err) {
      console.error("Error updating client:", err);
    }
  };

  const deleteDataFromServer = async (project_id) => {
    try {
      await axios.delete(`${base_url}/client/project/?delete=${project_id}`);
      getData();
      alert("Project deleted Successfully");
    } catch (err) {
      console.error("Error deleting client:", err);
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

  const handleChangeMultiSelect = (selectedOption) => {
    settech_id(selectedOption);
    console.log(tech_id,'ywiudddi');
    setFormData({...formData, tech_id: selectedOption.map((o) => o.value) });

  };

  const handleSubmit = () => {
    if (editMode) {
      updateDataToServer();
      const updatedData = [...tableData];
      updatedData[editIndex] = formData;
      setTableData(updatedData);
    } else {
      postDataToServer();
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

  const handleDelete = (project_id) => {
    deleteDataFromServer(project_id);
  };

  return (
    <Box sx={{ display: "block", p: 10, marginLeft: 30 }}>
      <NavBar />
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          onClick={handleOpenModal}
          size="medium"
          variant="contained"
          sx={{
            color: "white",
            backgroundColor: "#123270",
            borderRadius: 2,
            "&:hover": { color: "black", backgroundColor: "#53B789" },
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
            flexDirection: "column",
            position: "absolute",
            top: "60%",
            left: "60%",
            transform: "translate(-50%, -50%)",
            width: 800,
            bgcolor: "background.paper",
            border: "3px solid #455a64",
            boxShadow: 24,
            p: 4,
            borderRadius: 4,
          }}
        >
          <Typography id="modal-title" component="main" sx={{ flexGrow: 1 }}>
            {editMode ? "Edit Project" : "Add Project"}
          </Typography>
          <FormControl sx={{ margin: 2 }}>
            <InputLabel htmlFor="project-id">Project Name</InputLabel>
            <Input
              id="project-name"
              name="project_name"
              value={formData.project_name}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl sx={{ margin: 2 }}>
            <InputLabel htmlFor="duration">Duration</InputLabel>
            <Input
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl sx={{ margin: 2 }}>
            <InputLabel htmlFor="client-id">Client Id</InputLabel>
            <Input
              id="client-id"
              name="client_id"
              value={formData.client_id}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl sx={{ margin: 2 }}>
            <InputLabel htmlFor="team-id">Team Id</InputLabel>
            <Input
              id="team-id"
              name="team_id"
              value={formData.team_id}
              onChange={handleChange}
            />
          </FormControl>
          {/* <FormControl sx={{ margin: 2 }}>
            <InputLabel htmlFor="tech-id">Tech Id</InputLabel>
            <Input
              id="tech-id"
              name="tech_id"
              value={formData.tech_id}
              onChange={handleChange}
            />
          </FormControl> */}
          <Select isMulti
          isSearchable
          value={tech_id}
        // defaultValue={selectedOption}
        placeholder="Tech Id:Enter The Technology Name"
        onChange={handleChangeMultiSelect}
        options={Optionid}
      />
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
                Project Name
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                Duration
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                Client Id
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                Team Id
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                Tech Id
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
                  "&:hover": { backgroundColor: "#dcf0e7" },
                }}
              >
                <TableCell sx={{ textAlign: "center" }}>
                  {row.project_name}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {row.duration}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {row.client_id}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {row.team_id}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {row.tech_id}
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
                    onClick={() => handleDelete(row.project_id)}
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

export default Project;
