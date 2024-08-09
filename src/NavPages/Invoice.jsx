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
  useMediaQuery
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
import { useReactToPrint } from 'react-to-print';
import html2canvas from 'html2canvas';
import sign_logo from '../assets/sign_logo.jpeg'
import dummy_logo from '../assets/dummy_logo.jpeg'
// import { ToWords } from 'to-words';
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
  const [amountto, setamountto] = useState(null);
  const [CompanyDetails, setCompanyDetails] = useState(null);
  const invoiceRef = useRef();
  useEffect(() => {
    getData();
    getclient();
    getDataMultiInvoiceItems();
    getCompanyDetails();
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
          totalAmount: parseInt(item_invoice.item_price) + parseInt(item_invoice.tax_amount),
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
      console.log("********************",response.data.length)
    } catch (err) {
      console.log(err);
      console.error("Error fetching data:", err);
    }
  };

  const getCompanyDetails = async () => {
    try {
      const response = await axios.get(`${base_url}/client/company_details/`);
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

  function postDataToServer(values) {
    axios
      .post(`${base_url}/client/invoice/`, formData)
      .then((res) => {
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
    const SelOpt = selectedOption.map((o) =>  o.totalAmount)
    
    let SumTotal=0;
    for(let i=0; i<SelOpt.length;i++){
      SumTotal+=SelOpt[i];
    }
    
    
    setInvoiceItems(selectedOption);
    setFormData({
      ...formData,
      invoice_item_id: selectedOption.map((o) => o.value),
      total_amount:SumTotal,
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

  const ViewPdf = (invoice_data_of_row) => {
     
    var converter = require('number-to-words');
    let words = converter.toWords(invoice_data_of_row.total_amount)
    
    setInvoice(
      {...invoice_data_of_row,
      amountowords : words}
    );

    setIsInvoiceModalOpen(true);
    
  };

  const handleCloseInvoiceModal = () => {
    setIsInvoiceModalOpen(false);
    setInvoiceData(null);
  };

  

  const handlePrintPDF = useReactToPrint({
    content: () => invoiceRef.current,
    documentTitle: 'invoice',
    onAfterPrint: () => alert('Print successful'),
  });

  const handleDownloadPDF = () => {
    const input = invoiceRef.current;
    html2canvas(input)
      .then(canvas => {
        const imgData = canvas.toDataURL('image/JPEG');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'JPEG', 15, 10, 185, 250);
        pdf.save('invoice.pdf');
      });
  };



  const isSmallScreen = useMediaQuery("(max-width:600px)");

  return (
    <Box sx={{ display: "flex", p: 10, flexDirection : isSmallScreen ? "column" : "row"}} >
      <NavBar />
      <Box
        component="main"
        sx={{ flexGrow: 1, width: isSmallScreen ? "100%" : "auto" }}
        aria-label="Payment Section"
      >
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
                width: isSmallScreen ? "100%" : 1000,
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
              disabled
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
      <Box sx={{ display: "block" }}>
        <TableContainer
          component={Paper} 
          sx={{ maxHeight: "100vh", marginTop: 5 }} 
        >
        <Table>
          <TableHead sx={{ m: 5, backgroundColor: "#53B789" }}>
            <TableRow>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                ID
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                Invoice Number
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                Generated Date
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                Total Amount
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>
                Status
              </TableCell>
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
                  <TableCell sx={{ textAlign: "center" }}>
                    {row.generated_date}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {row.total_amount}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {row.status}
                  </TableCell>
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
                      onClick={() => ViewPdf(row)}
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
      </Box>
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
              width: isSmallScreen ? "90%" : "100%",
              height: isSmallScreen ? "90%" : "100%",
              width: "80%",
              height: "100%",
              bgcolor: "background.paper",
              border: "3px solid #455a64",
              boxShadow: 24,
              // p: 4,
              borderRadius: 4,
              overflow: "scroll",
            }}
          >
            <div className="invoice" ref={invoiceRef} style={styles.invoice_table}>
              <div className="head" style={styles.head}>
                <h1 style={styles.headH1}>AFUCENT TECHNOLOGIES</h1>
              </div>
              <div className="invoice-logo" style={styles.invoiceLogo}>
                <img
                  style={{ maxWidth: "175px" }}
                  src={dummy_logo}
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
                    {CompanyDetails.map((row, company_id) => (
                      <div>GSTIN/UIN: {row.gst_in}</div>
                    ))}
                    <div>Ref. No. & Date: {invoice.client_pincode}</div>
                    <div>Buyer Order No. & Date: {invoice.client_pincode}</div>
                    <div>Delivery Note: {invoice.client_pincode}</div>
                    <div>Destination: {invoice.client_pincode}</div>
                  </div>
                </div>
              </div>

              <div className="invoice-buyer" style={styles.invoiceBuyer}>
                <h2 style={styles.invoiceHeaderH2}>Buyer (Bill to Party)</h2>
                <div className="buyer-details" style={styles.buyerdetails}>
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
                  <div className="buyerdetails">
                    {CompanyDetails.map((row, company_id) => (
                      <div>GSTIN/UIN: {row.gst_in}</div>
                    ))}
                  </div>
                  
                </div>
              </div>
              <table className="invoice-table" style={styles.invoiceTable}>
                <thead style={styles.invoiceTableTh}>
                  <tr>
                    <th style={styles.invoiceTableTh}>SN</th>
                    <th style={styles.invoiceTableTh}>Product Description</th>
                    <th style={styles.invoiceTableTh}>Qty</th>
                    <th style={styles.invoiceTableTh}>Rate Rs</th>
                    <th style={styles.invoiceTableTh}>Taxable Value</th>
                    <th style={styles.invoiceTableTh}>%</th>
                    <th style={styles.invoiceTableTh}>IGST</th>
                    <th style={styles.invoiceTableTh}>Total</th>
                  </tr>
                </thead>
                <tbody style={styles.invoiceTableTd}>
                  {invoice.invoice_item_id.map((item, index) => (
                    <tr key={index}>
                      <td style={styles.invoiceTableTd}>{index + 1}</td>
                      <td style={styles.invoiceTableTd}>{item.project_name}</td>
                      {/* <td style={styles.invoiceTableTd}>{item.tax_id}</td> */}
                      <td style={styles.invoiceTableTd}>1</td>
                      <td style={styles.invoiceTableTd}>{item.item_price}</td>
                      <td style={styles.invoiceTableTd}>{item.tax_amount}</td>
                      <td style={styles.invoiceTableTd}>{item.tax_rate}</td>
                      <td style={styles.invoiceTableTd}>{item.tax_amount}</td>
                      <td style={styles.invoiceTableTd}>{item.tax_amount}</td>
                    </tr>
                  ))}
                  <tr>
                    <td
                      colSpan="2"
                      style={{ textAlign: "center", fontWeight: "bold" }}
                    >
                      Total
                    </td>
                    <td colSpan="2" style={styles.invoiceTableTd}>
                      {invoice.invoice_item_id.tax_rate}
                    </td>
                    <td colSpan="2" style={styles.invoiceTableTd}>
                      {invoice.invoice_item_id.tax_amount}
                    </td>
                    <td style={styles.invoiceTableTd}>
                      {invoice.total_amount}
                    </td>
                    <td style={styles.invoiceTableTd}>
                      Rs {invoice.total_amount}
                    </td>
                  </tr>
                </tbody>
              </table>
      
                
                <div className="total-words" style={styles.totalWords}>
                <p>Total Rounded off Invoice Amount in Words (Rupees)</p>
                <p>{invoice.amountowords} Only</p>
              </div>
              <div className="amount-summary" style={styles.amountSummary}>
                <table className="invoice-table-amount">
                  <tbody>
                    <tr>
                      <td>
                        Total Amount Before Tax: {invoice.total_amount}
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

              {CompanyDetails.map((row, company_id) => (
                <div className="bank-details" style={styles.bankDetails}>
                  <h5 style={{ textAlign: "center", fontWeight: "bold" }}>
                    <u>Bank Details</u>
                  </h5>
                  <div>
                    <u>Name:</u> {row.company_name}
                  </div>
                  <div>
                    <u>A/c No.:</u> {row.account_number}
                  </div>
                  <div>
                    <u>Bank & IFSC:</u> {row.bank_name} - {row.ifsc_code}
                  </div>
                  <div>
                    <u>Branch:</u> {row.branch_name}
                  </div>
                </div>
              ))}

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
              {CompanyDetails.map((row, company_id) => (
                <div className="signature" style={styles.signature}>
                  <h5 style={{ textAlign: "center" }}>
                    <b>FOR</b>
                  </h5>
                  <img
                    style={styles.sealImg}
                    
                    src={sign_logo}
                    alt="Signature"
                  />
                  <img
                    style={styles.signatureImg}
                    src={row.digital_signature}
                    alt="Seal"
                  />
               
                </div>
              ))}
              
            </div>
            <Box
              sx={{ display: "flex", justifyContent:"center",gap:"10px", mt: 2 }}
            >
            
              <Button
                variant="contained"
                color="primary"
                // backgroundColor="green"
                onClick={handlePrintPDF}
              >
                Print
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleDownloadPDF}
              >
                Send to Email
              </Button>
              
            
            </Box>
          </Box>
        </Modal>
      )}
    </Box>
    </Box>
  );
}

const styles = {
  invoice_table: {
    fontFamily: "Arial, sans-serif",
    margin: "20px auto",
    border: "2px solid black",
    width:  "80%",
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
    marginBottom: 20,
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
    fontSize:"23px",
    fontWeight: "bold",
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
  buyerdetails: {
    display: "flex",
    // justifyContent: "space-between",
  },
  invoiceTable: {
    gridArea: "items-table",
    width: "100%",
    // borderCollapse: "collapse",
    marginTop: "20px",
  },
  invoiceTableTh: {
    border: "1px solid black",
    padding: "8px",
    textAlign: "left",
  },
  invoiceTableTd: {
    border: "1px solid black",
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
    marginLeft: "45px",
  },
  sealImg:{
    maxWidth: "100px",
    marginLeft: "70px",
  },
  signatureImg: {
    maxWidth: "200px",
    height:"70px",
    marginLeft: "50px",
  },
};
export default Invoice;
