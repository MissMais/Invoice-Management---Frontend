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
  FormHelperText,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Modal,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import NavBar from "../NavBar";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import base_url from "../utils/API";

import Select from "@mui/material/Select";
import ReactSelect from "react-select";
import MenuItem from "@mui/material/MenuItem";

function Project(props) {
  const initialFormData = {
    client_id: "",
    invoice_number: "",
    generated_date: "",
    total_amount: "",
    status: "",
    invoice_item_id: [],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [tableData, setTableData] = useState([]);
  const [client, setclient] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [client_id, setclient_id] = React.useState("");
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [Option, setOption] = useState([]);
  const [totalAmount, setTotalAmount] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getData();
    getclient();
    getDataMultiInvoiceItems();
  }, []);

  const getDataMultiInvoiceItems = async () => {
    try {
      const response = await axios.get(`${base_url}/client/invoice_item/`);
      console.log(response.data, "invice");
      setOption(
        response.data.map((item_invoice) => ({
          label: item_invoice.project_name,
          value: item_invoice.invoice_item_id,
          price: item_invoice.item_price,
          tax_amount: item_invoice.tax_amount,
          totalAmount: item_invoice.item_price + item_invoice.tax_amount,
        }))
      );
    } catch (err) {
      console.log(err);
      console.error("Error fetching data:", err);
    }
  };

  const getclient = async () => {
    try {
      const response = await axios.get(`${base_url}/client/client/`);
      setclient(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };
  const getData = async () => {
    try {
      const response = await axios.get(`${base_url}/client/invoice/`);
      console.log(response.data, "table data");
      setTableData(response.data);
    } catch (err) {
      console.log(err);
      console.error("Error fetching data:", err);
    }
  };

  function postDataToServer(values) {
    const pdfFile = new Blob([jsPDF], { type: "application/pdf" });
    const formDataToSend = new FormData();
    formDataToSend.append("invoice_pdf", pdfFile, "invoice.pdf");
    formDataToSend.append("client_id", formData.client_id);
    formDataToSend.append("invoice_number", formData.invoice_number);
    formDataToSend.append("generated_date", formData.generated_date);
    formDataToSend.append("total_amount", formData.total_amount);
    formDataToSend.append("status", formData.status);
    formDataToSend.append("invoice_item_id", formData.invoice_item_id);

    // const pdfformdata = {
    //   ...formData,
    // invoice_pdf:formDataToSend.toString()
    // }
    axios
      .post(`${base_url}/client/invoice/`, formDataToSend, {
        // headers: {
        //   'Content-Type': 'multipart/form-data'
        // }
      })
      .then((res) => {
        console.log(res.data);
        getData();
        alert("Invoice Added Successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const updateDataToServer = async (invoice_id) => {
    try {
      await axios.put(`${base_url}/client/invoice/`, formData);
      getData();
      alert("Invoice updated Successfully");
    } catch (err) {
      console.error("Error updating client:", err);
    }
  };

  const deleteDataFromServer = async (invoice_id) => {
    try {
      await axios.delete(
        `${base_url}/client/invoice/?delete=${invoice_id}`,
        formData
      );
      getData();
      alert("Invoice deleted Successfully");
    } catch (err) {
      console.error("Error deleting client:", err);
    }
  };

  const handleChangeInvoiceMulti = (selectedOption) => {
    setInvoiceItems(selectedOption);
    console.log(invoiceItems, "ywiudddi");
    setFormData({
      ...formData,
      invoice_item_id: selectedOption.map((o) => o.value),
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

  const handleChangeClientDropdown = (event) => {
    setclient_id(event.target.value);
    setFormData({
      ...formData,
      client_id: +event.target.value,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "invoice_number") {
      const pattern = /^[A-Z]{2}\/\d{4}\/\d{2}-\d{2}$/;
      const trimmedValue = value.trim();

      if (trimmedValue && !pattern.test(trimmedValue)) {
        setError("ENTER IN THIS FORMAT: XX/0000/00-00");
      } else {
        setError("");
      }
    }
  };

  // const handleSubmit = () => {
  //   if (editMode) {
  //     updateDataToServer();
  //     const updatedData = [...tableData];
  //     updatedData[editIndex] = formData;
  //     setTableData(updatedData);
  //   } else {
  //     if (!error) {
  //       postDataToServer();
  //       setTableData([...tableData, { ...formData, id: tableData.length + 1 }]);
  //     } else {
  //       alert("Please fix the errors before submitting.");
  //     }
  //   }
  //   setFormData(initialFormData);
  //   handleCloseModal();
  // };
  const handleSubmit = async () => {
    if (editMode) {
      await updateDataToServer();
      const updatedData = [...tableData];
      updatedData[editIndex] = formData;
      setTableData(updatedData);
    } else {
      if (!error) {
        postDataToServer();
        setTableData([...tableData, { ...formData, id: tableData.length + 1 }]);

        const pdfFile = new Blob([jsPDF], { type: "application/pdf" });
        // const formDataToSend = new FormData();
        // formData.append('invoice_pdf', pdfFile, 'invoice.pdf');

        // try {
        //   const response = await axios.post(`${base_url}/client/invoice/`, formData, {
        //     headers: {
        //       'Content-Type': 'multipart/form-data'
        //     }
        //   });
        //   console.log('PDF uploaded successfully:', response.data);
        // } catch (error) {
        //   console.error('Error uploading PDF:', error);
        // }
      } else {
        alert("Please fix the errors before submitting.");
      }
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

  const handleEditInvoice = () => {
    if (invoiceData) {
      setFormData(invoiceData);
      setEditMode(true);
      setEditIndex(tableData.findIndex((item) => item.id === invoiceData.id));
      setIsModalOpen(true);
      setIsInvoiceModalOpen(false);
    }
  };

  const handleDelete = (invoice_id) => {
    deleteDataFromServer(invoice_id);
  };

  const handleInvoiceClick = (id) => {
    const invoice = tableData.find((item) => item.id === id);
    console.log(invoice, "888888888");
    setInvoiceData(invoice);
    setIsInvoiceModalOpen(true);
  };

  const handleCloseInvoiceModal = () => {
    setIsInvoiceModalOpen(false);
    setInvoiceData(null);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Invoice Details", 20, 10);
    doc.autoTable({
      startY: 20,
      head: [
        [
          "Customer Name",
          "Invoice Number",
          "Order Number",
          "Invoice Date",
          "Due Date",
        ],
      ],
      body: [
        [
          tableData.client_name,
          invoiceData.client_name,
          invoiceData.order_number,
          invoiceData.invoice_date,
          invoiceData.generated_date,
        ],
      ],
    });
    doc.autoTable({
      startY: doc.previousAutoTable.finalY + 10,
      head: [["Description", "Quantity", "Price", "Amount"]],
      body: [
        [
          invoiceData.description,
          invoiceData.quantity,
          invoiceData.price,
          invoiceData.amount,
        ],
      ],
    });
    doc.autoTable({
      startY: doc.previousAutoTable.finalY + 10,
      head: [["Notes"]],
      body: [[invoiceData.notes]],
    });
    doc.save("invoice.pdf");
  };

  const handlePrintPDF = () => {
    const doc = new jsPDF();
    doc.text("Invoice Details", 20, 10);
    doc.autoTable({
      startY: 20,
      head: [
        [
          "Customer Name",
          "Invoice Number",
          "Order Number",
          "Invoice Date",
          "Due Date",
        ],
      ],
      body: [
        [
          invoiceData.client_name,
          invoiceData.invoice_number,
          invoiceData.order_number,
          invoiceData.invoice_date,
          invoiceData.generated_date,
        ],
      ],
    });
    doc.autoTable({
      startY: doc.previousAutoTable.finalY + 10,
      head: [["Description", "Quantity", "Price", "Amount"]],
      body: [
        [
          invoiceData.description,
          invoiceData.quantity,
          invoiceData.price,
          invoiceData.amount,
        ],
      ],
    });
    doc.autoTable({
      startY: doc.previousAutoTable.finalY + 10,
      head: [["Notes"]],
      body: [[invoiceData.notes]],
    });
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    window.open(url);
  };

  return (
    <Box sx={{ display: "block", p: 10, marginLeft: 30 }}>
      <NavBar />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {" "}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            type="search"
            placeholder="Enter the Client Name"
            onChange={(e) => setSearch(e.target.value)}
            variant="outlined"
            sx={{
              flex: 1,
              mr: 2,
              "& .MuiOutlinedInput-root": {
                height: "43px",
                width: 780,
                borderRadius: 16,
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button
            onClick={() => handleOpenModal()}
            size="medium"
            variant="contained"
            sx={{
              color: "white",
              backgroundColor: "#123270",
              borderRadius: 2,
              height: "40px",
              "&:hover": { color: "black", backgroundColor: "#53B789" },
            }}
          >
            ADD
          </Button>
        </Grid>
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
            {editMode ? "Edit Invoice" : "Add Invoice"}
          </Typography>
          <FormControl sx={{ margin: 2 }}>
            <InputLabel htmlFor="invoice-number">Invoice Number</InputLabel>
            <Input
              id="invoice-number"
              name="invoice_number"
              value={formData.invoice_number}
              onChange={handleChange}
              error={!!error}
              placeholder="XX/0000/00-00"
              inputProps={{ maxLength: 13 }}
            />
            {error && <FormHelperText error>{error}</FormHelperText>}
          </FormControl>

          <FormControl sx={{ margin: 2, width: 200 }}>
            <InputLabel id="demo-simple-select-label">Client Name</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={client_id}
              variant="standard"
              label="Client Name"
              onChange={handleChangeClientDropdown}
            >
              {client.map((row, index) => (
                <MenuItem value={row.client_id}>{row.client_name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ margin: 2, marginTop: -1 }}>
            {/* <InputLabel htmlFor="due-date">Due Date</InputLabel> */}
            <label htmlFor="due-date">Generated Date</label>
            <Input
              type="date"
              id="generated-date"
              name="generated_date"
              value={formData.generated_date}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl sx={{ margin: 2 }}>
            <InputLabel htmlFor="amount">Total Amount</InputLabel>
            <Input
              id="total-amount"
              name="total_amount"
              value={formData.total_amount}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl sx={{ margin: 2 }}>
            <InputLabel htmlFor="invoice-number">status</InputLabel>
            <Input
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            />
          </FormControl>
          <ReactSelect
            isMulti
            isSearchable
            value={invoiceItems}
            // defaultValue={selectedOption}
            placeholder="Enter Invoice Items"
            onChange={handleChangeInvoiceMulti}
            options={Option}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleSubmit}
              disabled={!!error}
            >
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
                ID
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                Invoice Number
              </TableCell>
              {/* <TableCell sx={{ color: "white", textAlign: "center" }}>
                Client Name
              </TableCell> */}
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                Generated Date
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                Total Amount
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                Status
              </TableCell>
              {/* <TableCell sx={{ color: "white", textAlign: "center" }}>
                Invoice Items
                </TableCell> */}
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                Details
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData

              .filter((e) => {
                return search.toLowerCase() === ""
                  ? e
                  : e.client_id?.client_name.toLowerCase().includes(search);
              })
              .map((row, index) => (
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
                    {row.invoice_id}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {row.invoice_number}
                  </TableCell>
                  {/* <TableCell sx={{ textAlign: "center" }}>
                    {row.client_name}
                  </TableCell> */}
                  <TableCell sx={{ textAlign: "center" }}>
                    {row.generated_date}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {row.total_amount}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {row.status}
                  </TableCell>
                  {/* <TableCell sx={{ textAlign: "center" }}>
                    {row.invoice_item_id}
                  </TableCell> */}
                  <TableCell sx={{ textAlign: "center", cursor: "pointer" }}>
                    <Button
                      variant="standard"
                      sx={{
                        textTransform: "none",
                        "&:hover": {
                          color: "black",
                          backgroundColor: "#53B789",
                        },
                      }}
                      onClick={() => handleInvoiceClick(row.id)}
                    >
                      View Invoice
                    </Button>
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
                      onClick={() => handleDelete(row.invoice_id)}
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

      <Modal open={isInvoiceModalOpen} onClose={handleCloseInvoiceModal}>
        <Box
          sx={{
            flexDirection: "column",
            position: "absolute",
            top: "60%",
            left: "60%",
            transform: "translate(-50%, -50%)",
            width: 900,
            height: 450,
            bgcolor: "background.paper",
            border: "3px solid #455a64",
            boxShadow: 24,
            p: 4,
            borderRadius: 4,
          }}
        >
          <Typography id="modal-title" component="h2">
            Invoice Details
          </Typography>
          {invoiceData && (
            <>
              <Typography variant="body1">
                Customer Name: {invoiceData.customer_name}
              </Typography>
              <Typography variant="body1">
                Invoice Number: {invoiceData.invoice_number}
              </Typography>
              <Typography variant="body1">
                Order Number: {invoiceData.order_number}
              </Typography>
              <Typography variant="body1">
                Invoice Date: {invoiceData.invoice_date}
              </Typography>
              <Typography variant="body1">
                Due Date: {invoiceData.generated_date}
              </Typography>
              <Typography variant="body1">
                Notes: {invoiceData.notes}
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{invoiceData.description}</TableCell>
                    <TableCell>{invoiceData.quantity}</TableCell>
                    <TableCell>{invoiceData.price}</TableCell>
                    <TableCell>{invoiceData.amount}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePrintPDF}
                >
                  Print
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleDownloadPDF}
                >
                  Download PDF
                </Button>
                <Button
                  variant="contained"
                  color="info"
                  onClick={handleEditInvoice}
                >
                  Edit
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}

export default Project;
