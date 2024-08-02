import React, { useState, useEffect, useRef } from "react";
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
import autoTable from "jspdf-autotable";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
// import Bill from "../Bill"
// import "../"

function Invoice(props) {
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
  const [invoice, setInvoice] = useState(null);

  const [CompanyDetails, setCompanyDetails] = useState();
  const invoiceRef = useRef();
  useEffect(() => {
    getData();
    getclient();
    getDataMultiInvoiceItems();
  }, []);

  const getDataMultiInvoiceItems = async () => {
    try {
      const response = await axios.get(`${base_url}/client/invoice_item/`);
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
  const getData = async () => {
    try {
      const response = await axios.get(`${base_url}/client/invoice/`);
      setTableData(response.data);
    } catch (err) {
      console.log(err);
      console.error("Error fetching data:", err);
    }
  };

  const getCompanyDetails = async () => {
    try {
      const response = await axios.get(`${base_url}/client/company_details/`);
      // console.log(response.data, "Company Details");
      setCompanyDetails(response.data);
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

  const getinvoice____ = async (invoice_id) => {
    try {
      const response = await axios.get(
        `${base_url}/client/invoice/?invoice_id=${invoice_id}`
      );
      setInvoice(response.data);
    } catch (err) {
      console.error("There was an error fetching the invoice data!", error);
    }
  };

  function postDataToServer(values) {
    // const pdfFile = new Blob([jsPDF], { type: 'application/pdf' });
    // const formDataToSend = new FormData();
    // formDataToSend.append('invoice_pdf', pdfFile, 'invoice.pdf');
    // formDataToSend.append('client_id', formData.client_id);
    // formDataToSend.append('invoice_number', formData.invoice_number);
    // formDataToSend.append('generated_date', formData.generated_date);
    // formDataToSend.append('total_amount', formData.total_amount);
    // formDataToSend.append('status', formData.status);
    // formDataToSend.append('invoice_item_id', formData.invoice_item_id)
    // const pdfformdata = {
    //   ...(formData + formDataToSend)
    //   // invoice_pdf:formDataToSend.toString()
    // };
    axios
      .post(`${base_url}/client/invoice/`, formData, {
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
    setInvoiceData(invoice);
    setIsInvoiceModalOpen(true);
  };

  const ViewPdf = (invoice_id) => {
    getinvoice____(invoice_id);
    getCompanyDetails();
    setIsInvoiceModalOpen(true);
    setInvoiceData(invoice);
  };

  const handleCloseInvoiceModal = () => {
    setIsInvoiceModalOpen(false);
    setInvoiceData(null);
  };

  // const handleDownloadPDF = () => {
  //   const doc = new jsPDF();
  //   doc.text("Invoice Details", 20, 10);
  //   doc.autoTable({
  //     startY: 20,
  //     head: [
  //       [
  //         "Customer Name",
  //         "Invoice Number",
  //         "Order Number",
  //         "Invoice Date",
  //         "Due Date",
  //       ],
  //     ],
  //     body: [
  //       [
  //         tableData.client_name,
  //         invoiceData.client_name,
  //         invoiceData.order_number,
  //         invoiceData.invoice_date,
  //         invoiceData.generated_date,
  //       ],
  //     ],
  //   });
  //   doc.autoTable({
  //     startY: doc.previousAutoTable.finalY + 10,
  //     head: [["Description", "Quantity", "Price", "Amount"]],
  //     body: [
  //       [
  //         invoiceData.description,
  //         invoiceData.quantity,
  //         invoiceData.price,
  //         invoiceData.amount,
  //       ],
  //     ],
  //   });
  //   doc.autoTable({
  //     startY: doc.previousAutoTable.finalY + 10,
  //     head: [["Notes"]],
  //     body: [[invoiceData.notes]],
  //   });
  //   doc.save("invoice.pdf");
  // };

  const handleDownloadPDF = () => {
    const input = invoiceRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 0, 0);
      pdf.save("invoice.pdf");
    });
  };

  const handlegetPDF = useReactToPrint({
    content: () => invoiceRef.current,
    documentTitle: "invoice",
    onAfterPrint: () => alert("Print successful"),
  });
  // const handlePrintPDF = () => {
  //   const doc = new jsPDF();
  //   doc.text("Invoice Details", 20, 10);
  //   doc.autoTable({
  //     startY: 20,
  //     head: [
  //       [
  //         "Customer Name",
  //         "Invoice Number",
  //         "Order Number",
  //         "Invoice Date",
  //         "Due Date",
  //       ],
  //     ],
  //     body: [
  //       [
  //         invoiceData.client_name,
  //         invoiceData.invoice_number,
  //         invoiceData.order_number,
  //         invoiceData.invoice_date,
  //         invoiceData.generated_date,
  //       ],
  //     ],
  //   });
  //   doc.autoTable({
  //     startY: doc.previousAutoTable.finalY + 10,
  //     head: [["Description", "Quantity", "Price", "Amount"]],
  //     body: [
  //       [
  //         invoiceData.description,
  //         invoiceData.quantity,
  //         invoiceData.price,
  //         invoiceData.amount,
  //       ],
  //     ],
  //   });
  //   doc.autoTable({
  //     startY: doc.previousAutoTable.finalY + 10,
  //     head: [["Notes"]],
  //     body: [[invoiceData.notes]],
  //   });
  //   const blob = doc.output("blob");
  //   const url = URL.createObjectURL(blob);
  //   window.open(url);
  // };

  //  if (!invoice) {
  //                return (<div>Loading...</div>)

  //                       }

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
                      onClick={() => ViewPdf(row.invoice_id)}
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
      {invoice && (
        <Modal open={isInvoiceModalOpen} onClose={handleCloseInvoiceModal}>
          <Box
            sx={{
              flexDirection: "column",
              position: "absolute",
              top: "50%",
              bottom: "10%",
              left: "60%",
              transform: "translate(-50%, -50%)",
              width: "100%",
              height: "100%",
              bgcolor: "background.paper",
              border: "3px solid #455a64",
              boxShadow: 24,
              p: 4,
              borderRadius: 4,
              overflow: "scroll",
            }}
          >
            <div className="invoice" style={styles.invoice_table}>
              <div className="head" style={styles.head}>
                <h1 style={styles.headH1}>AFUCENT TECHNOLOGIES</h1>
              </div>
              <div className="invoice-logo" style={styles.invoiceLogo}>
                <img
                  style={{ maxWidth: "100px" }}
                  src="logo.png"
                  alt="Invoice logo"
                />
              </div>
              <div className="invoice-address" style={styles.invoiceAddress}>
                <p>
                  4th Floor, New Janpath Complex
                  <br />
                  9 Ashok Marg, Hazratganj, LUCKNOW
                  <br />
                  Uttar Pradesh - 226001
                </p>
              </div>
              <div className="invoice-header" style={styles.invoiceHeader}>
                <h2 style={styles.invoiceHeaderH2}>Tax Invoice</h2>
                <div className="invoice-details" style={styles.invoiceDetails}>
                  <div style={{ width: "60%" }}>
                    <div>Invoice No.: {invoice.invoice_number}</div>
                    <div>Invoice Date: {invoice.generated_date}</div>
                    <div>Due Date: {invoice.generated_date}</div>
                    <div>State: {invoice.client_address}</div>
                  </div>
                  <div style={{ width: "40%" }}>
                    <div>GSTIN/UIN: {invoice.client_pincode}</div>
                    <div>Ref. No. & Date: {invoice.client_pincode}</div>
                    <div>Buyer Order No. & Date: {invoice.client_pincode}</div>
                    <div>Delivery Note: {invoice.client_pincode}</div>
                    <div>Destination: {invoice.client_pincode}</div>
                  </div>
                </div>
              </div>

              <div className="invoice-buyer" style={styles.invoiceBuyer}>
                <h2 style={{ textAlign: "center" }}>Buyer (Bill to Party)</h2>
                <div className="buyer-details">
                  <div style={{ width: "60%" }}>
                    <div>Name: {invoice.client_name}</div>
                    <div>Address: {invoice.client_address}</div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>City: {invoice.client_address}</div>
                      <div>PIN: {invoice.client_pincode}</div>
                      <div>State: {invoice.client_address}</div>
                    </div>
                  </div>
                  <div style={{ width: "40%" }}>
                    <div>GSTIN/UIN: {invoice.client_address}</div>
                  </div>
                </div>
              </div>
              <table className="invoice-table" style={styles.invoiceTable}>
                <thead style={styles.invoiceTableTh}>
                  <tr>
                    <th>SN</th>
                    <th>Product Description</th>
                    <th>Qty</th>
                    <th>Rate Rs</th>
                    <th>Taxable Value</th>
                    <th>%</th>
                    <th>IGST</th>
                    <th>Total</th>
                  </tr>
                </thead>
                {/* <tbody style={styles.invoiceTableTd}>
                  {invoice.invoice_item_id.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.project_name}</td>
                      <td>{item.tax_id}</td>
                      <td>{item.item_price}</td>
                      <td>{item.tax_amount}</td>
                      <td>{item.tax_rate}</td>
                      <td>{item.tax_amount}</td>
                      <td>{item.tax_amount}</td>
                    </tr>
                  ))}
                  <tr>
                    <td
                      colSpan="2"
                      style={{ textAlign: "center", fontWeight: "bold" }}
                    >
                      Total
                    </td>
                    <td colSpan="2" style={{ fontWeight: "bold" }}>
                      {invoice.invoice_item_id.tax_rate}
                    </td>
                    <td colSpan="2" style={{ fontWeight: "bold" }}>
                      {invoice.invoice_item_id.tax_amount}
                    </td>
                    <td style={{ fontWeight: "bold" }}>
                      {invoice.total_amount}
                    </td>
                    <td style={{ fontWeight: "bold" }}>
                      Rs {invoice.total_amount}
                    </td>
                  </tr>
                </tbody> */}
              </table>
              <div className="total-words" style={styles.totalWords}>
                <p>Total Rounded off Invoice Amount in Words (Rupees)</p>
                <p>{invoice.amountInWords}</p>
              </div>
              <div className="amount-summary" style={styles.amountSummary}>
                <table className="invoice-table-amount">
                  <tbody>
                    <tr>
                      <td>
                        Total Amount Before Tax: {invoice.totalAmountBeforeTax}
                      </td>
                    </tr>
                    <tr>
                      <td>IGST: {invoice.totalIGST}</td>
                    </tr>
                    <tr>
                      <td>Total Tax: {invoice.totalTax}</td>
                    </tr>
                    <tr>
                      <td>
                        Total Amount with Tax: {invoice.totalAmountWithTax}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Net Amount Payable in Tax: {invoice.netAmountPayable}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Advance Amount Paid Rs.: {invoice.advanceAmountPaid}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Balance Amount Payable Rs.:{" "}
                        {invoice.balanceAmountPayable}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bank-details" style={styles.bankDetails}>
                <h5 style={{ textAlign: "center", fontWeight: "bold" }}>
                  <u>Bank Details</u>
                </h5>
                <div>
                  <u>Name:</u> {CompanyDetails.company_name}
                </div>
                <div>
                  <u>A/c No.:</u> {CompanyDetails.account_number}
                </div>
                <div>
                  <u>Bank & IFSC:</u> {CompanyDetails.bank_name} -{" "}
                  {CompanyDetails.ifsc_code}
                </div>
                <div>
                  <u>Branch:</u> {CompanyDetails.branch_name}
                </div>
              </div>
              <div className="declaration" style={styles.declaration}>
                <h5 style={{ textAlign: "center" }}>
                  <b>
                    <u>Declaration</u>
                  </b>
                </h5>
                <p style={styles.declarationP}>
                  We declare that this invoice shows the actual price of the
                  goods described and that all particulars are true and correct.
                </p>
              </div>
              <div className="signature" style={styles.signature}>
                <h5 style={{ textAlign: "center" }}>
                  <b>FOR</b>
                </h5>
                <img
                  style={styles.signatureImg}
                  src={CompanyDetails.digital_seal}
                  alt="Signature"
                />
                <img
                  style={styles.signatureImg}
                  src={CompanyDetails.digital_signature}
                  alt="Seal"
                />
                <p>Authorized Signatory</p>
              </div>
            </div>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Button
                variant="contained"
                color="primary"
                // onClick={handlePrintPDF}
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
              {/* <Button
                   variant="contained"
                   color="info"
                   onClick={handleEditInvoice}
                 >
                   Edit
                 </Button> */}
            </Box>
          </Box>
        </Modal>
      )}
    </Box>
  );
}

const styles = {
  invoice_table: {
    fontFamily: "Arial, sans-serif",
    margin: "20px auto",
    border: "2px solid black",
    width: "80%",
    display: "grid",
    gridTemplateAreas: `
"header header"
"logo company-address"
"tax-invoice tax-invoice"
"buyer-details buyer-details"
"items-table items-table"
"total-words amount-summary"
"bank-details amount-summary"
"declaration signature"
`,
    gridGap: "10px",
    padding: "4px",
    marginBottom: 10,
  },
  head: {
    gridArea: "header",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "#123270",
    color: "aliceblue",
    padding: "10px",
  },
  headH1: {
    fontFamily: "'Times New Roman', Times, serif",
    margin: 0,
  },
  invoiceLogo: {
    gridArea: "logo",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  invoiceLogoImg: {
    maxWidth: "100px",
  },
  invoiceAddress: {
    gridArea: "company-address",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-end",
    textAlign: "right",
  },
  invoiceHeader: {
    gridArea: "tax-invoice",
    border: "1px solid black",
    margin: 0,
    fontWeight: "bolder",
    padding: "10px",
  },
  invoiceHeaderH2: {
    fontSize: "21px",
    margin: "5px 0",
    fontWeight: "bolder",
    textDecoration: "underline",
    textAlign: "center",
  },
  invoiceDetails: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    lineHeight: "33px",
  },
  invoiceBuyer: {
    gridArea: "buyer-details",
    border: "1px solid black",
    margin: 0,
    fontWeight: "bolder",
    padding: "10px",
  },
  invoiceTable: {
    gridArea: "items-table",
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  invoiceTableTh: {
    border: "1px solid #000",
    padding: "8px",
    textAlign: "left",
  },
  invoiceTableTd: {
    border: "1px solid #000",
    padding: "8px",
    textAlign: "left",
  },
  totalWords: {
    gridArea: "total-words",
    fontWeight: "bold",
    padding: "10px",
    width: "100%",
  },
  amountSummary: {
    gridArea: "amount-summary",
    marginTop: "-5px",
    fontWeight: "bold",
  },
  bankDetails: {
    gridArea: "bank-details",
    fontWeight: "bold",
    border: "1px solid black",
    padding: "10px",
    width: "70%",
  },
  declaration: {
    gridArea: "declaration",
    padding: "10px",
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    width: "inherit",
  },
  declarationP: {
    margin: "10px 0",
  },
  signature: {
    gridArea: "signature",
    padding: "10px",
  },
  signatureImg: {
    maxWidth: "100px",
    marginLeft: "10px",
  },
};
export default Invoice;
