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
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
function Project(props) {
  const initialFormData = {
    project_id: "",
    item_price: "",
    tax_id: "",
    tax_amount: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [tableData, setTableData] = useState([]);
  const [projectdata, setProjectdata] = useState([]);
  const [taxdata, settaxdata] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [projectid, setprojectid] = React.useState("");
  const [taxid, settaxid] = React.useState("");

  useEffect(() => {
    getData();
    getproject();
    gettax();
  }, []);
  const gettax = async () => {
    try {
      const response = await axios.get(`${base_url}/client/api/tax/`);
      settaxdata(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };
 
  const getproject = async () => {
    try {
      const response = await axios.get(`${base_url}/client/project/`);
      setProjectdata(response.data);
      console.log(response.data, "#$%^##");
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };
  const getData = async () => {
    try {
      const response = await axios.get(`${base_url}/client/invoice_item/`);
      console.log(response.data);
      setTableData(response.data);
    } catch (err) {
      console.log(err);
      console.error("Error fetching data:", err);
    }
  };

  function postDataToServer(values) {
    axios
      .post(`${base_url}/client/invoice_item/`, formData)
      .then((res) => {
        console.log(res.data);
        getData();
        alert("Invoice Item Added Successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const updateDataToServer = async () => {
    try {
      await axios.put(`${base_url}/client/invoice_item/`, formData);
      getData();
      alert("Invoice Item updated Successfully");
    } catch (err) {
      console.error("Error updating client:", err);
    }
  };

  const deleteDataFromServer = async (invoice_item_id) => {
    try {
      await axios.delete(
        `${base_url}/client/invoice_item/?delete=${invoice_item_id}`
      );
      getData();
      alert("Invoice Item deleted Successfully");
    } catch (err) {
      console.error("Error deleting client:", err);
    }
  };

  
  const handleChangeProjectDropdown = (event) => {
    setprojectid(event.target.value);
    setFormData({
      ...formData,
      project_id: +event.target.value,
    });
  };
  const handleChangeTaxDropdown = (event) => {
    const selectedTax = event.target.value;
    const taxRate = selectedTax.rate;
    const itemPrice = formData.item_price;
    const taxAmount = ((itemPrice * taxRate)/100).toFixed(2);
    console.log(event.target.value.rate,'event tax dropdown');
    settaxid(selectedTax);
    // settaxid(event.target.value);
    setFormData({
      ...formData,
      // tax_id: +event.target.value,
      tax_id: +selectedTax.tax_id,
      tax_amount: taxAmount,
    });
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

  const handleDelete = (invoice_item_id) => {
    deleteDataFromServer(invoice_item_id);
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
            {editMode ? "Edit Invoice Item" : "Add Invoice Item"}
          </Typography>
          

          <FormControl sx={{ margin: 2, width: 200 }}>
            <InputLabel id="demo-simple-select-label">Project Id</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={projectid}
              variant="standard"
              label="Invoice Id"
              onChange={handleChangeProjectDropdown}
            >
              {projectdata.map(
                (row, index) => (
                  console.log(row, "******"),
                  (<MenuItem value={row.project_id}>{row.project_name}</MenuItem>)
                )
              )}
            </Select>
          </FormControl>

          <FormControl sx={{ margin: 2 }}>
            <InputLabel htmlFor="client-id">Item Price</InputLabel>
            <Input
              id="item-price"
              name="item_price"
              value={formData.item_price}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl sx={{ margin: 2, width: 200 }}>
            <InputLabel id="demo-simple-select-label">Tax Name</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={taxid}
              variant="standard"
              label="Invoice Id"
              onChange={handleChangeTaxDropdown}
            >
              {taxdata.map((row, index) => (
                <MenuItem value={row}>{row.tax_name}-{row.rate}%</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ margin: 2 }}>
            <InputLabel htmlFor="tech-id">Tax Amount</InputLabel>
            <Input
              id="tax-amount"
              name="tax_amount"
              value={formData.tax_amount}
              onChange={handleChange}
              disabled
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
          <TableHead sx={{ m: 5, backgroundColor: "#53B789" }}>
            <TableRow>
              
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                Invoice_Item_Id
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                Project Name
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                Item Price
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                Tax Name
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                Tax Amount
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
                  {row.invoice_item_id}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {row.project_name}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {row.item_price}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>{row.tax_name}-{row.tax_rate}%</TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                {row.tax_amount}
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
                    onClick={() => handleDelete(row.invoice_item_id)}
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
