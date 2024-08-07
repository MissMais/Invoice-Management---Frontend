import { Box } from '@mui/material'
import React, { useState, useEffect } from 'react'
import NavBar from '../NavBar'
import {
  Grid,
  Modal,
  Input,
  Button,
  Typography,
  FormControl,
  TextField,
  InputLabel,
  Stack,
} from "@mui/material";
import axios from 'axios';
import base_url from '../utils/API';


export default function AddCompany() {
  const [data, setData] = useState({
    "company_details_id": "",
    "company_name": "",
    "company_address": "",
    "pincode": "",
    "bank_name": "",
    "branch_name": "",
    "account_number": "",
    "ifsc_code": "",
    "gst_in": "",
    "user_id": ""

  })
  const [images, setImages] = useState({
    "company_logo": null,
    "digital_seal": null,
    "digital_signature": null,
  })
  const [dataImage, setDataImage] = useState({
    "company_logo": "",
    "digital_seal": "",
    "digital_signature": "",
  })
  const [edit, setEdit] = useState(null)
  const [open, setOpen] = useState(false)

  const handleAdd = () => {
    setOpen(true)
    setEdit(null)
    setData({})
  }
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    axios.get(`${base_url}/client/company_details/`)
      .then((response) => {
        console.log(response.data);
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          setData(response.data);
          const imageData = response.data[0];
          setDataImage({
            company_logo: imageData.company_logo || "",
            digital_seal: imageData.digital_seal || "",
            digital_signature: imageData.digital_signature || "",
          });
        } else {
          setData([]);
          setDataImage({
            company_logo: "",
            digital_seal: "",
            digital_signature: "",
          });
        }
      }).catch((error) => {
        console.log("error fetching data", error);
      });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prevData => ({
      ...prevData,
      [name]: value,
    }))
  }
  const handleImageChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      setImages(prevImages => ({
        ...prevImages,
        [name]: files[0]
      }))
      const reader = new FileReader();
      reader.onloadend = () => {
        setDataImage(prevData => ({
          ...prevData,
          [name]: reader.result
        }))
      }
      reader.readAsDataURL(files[0])
    }
  }
  const handleFormSubmit = (e) => {
    e.preventDefault();
    addData(data, edit)
  }
  function addData(data, editable) {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    for (const key in images) {
      if (images[key]) {
        formData.append(key, images[key]);
      }
    }
    if (editable) {
      axios.patch(`${base_url}/client/company_details/?company_d_upd=${edit.company_details_id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then((response) => {
        fetchData()
        setOpen(false)
      }).catch((error) => {
        console.log("error editing data", error);
      })
    }
    else {
      axios.post(`${base_url}/client/company_details/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then((response) => {
        fetchData()
        setOpen(false)
      })
        .then((error) => {
          console.log("error adding data", error);
        })
    }
  }
  const handleEdit = (item) => {
    fetchData()
    setEdit(item);
    setData(item);
    setDataImage({
      company_logo: item.company_logo || "",
      digital_seal: item.digital_seal || "",
      digital_signature: item.digital_signature || "",
    });
    setOpen(true);
  }
  const handleDelete = (company_details_id) => {
    axios.delete(`${base_url}/client/company_details/?delete=${company_details_id}`)
      .then((response) => {
        fetchData()
        // setData(data => data.filter((e) => e.company_details_id !== company_details_id))
        setData(prevData => prevData.filter((e) => e.company_details_id !== company_details_id))
      }).catch((error) => {
        console.log("error deleting data", error);
      })
  }

  return (
    <>
      <div>
        <Box sx={{ display: "flex", p: 10 }}>
          <NavBar />
          <Box component="main" sx={{ flexGrow: 1 }}>
            {data.length > 0 ? (
              data.map((e, index) => (
                <Box 
                  key={index}
                  sx={{
                    maxWidth: "100%",
                    padding: '20px',
                    margin: '10px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    '@media (max-width:600px)': {
                      padding: '15px',
                      margin: '5px',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                    <Button variant="outlined" onClick={() => handleEdit(e)} sx={{ marginRight: '10px' }}>Edit</Button>
                    <Button variant="outlined" color="error" onClick={() => handleDelete(e.company_details_id)}>Delete</Button>
                  </Box>

                  <Grid sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    marginBottom: '20px',
                    '@media (max-width:600px)': {
                      flexDirection: 'column',
                    },
                  }} container spacing={3}>
                    <Grid item xs={12} md={6}>

                      <Box
                        sx={{
                          '& img': {
                            height: '120px',
                            width: 'auto',
                            maxWidth: '100%',
                            objectFit: 'contain',
                          },
                        }}
                      >

                        <img src={e.company_logo} alt="Company Logo" />
                      </Box>
                    </Grid>

                    {/* </Box> */}
                    <Grid item xs={12} md={6}>

                      <Typography variant="h4" sx={{ fontWeight: 'bold', marginLeft: '20px' }}>{e.company_name}</Typography>
                    </Grid>
                  </Grid>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" sx={{ marginBottom: '10px', fontWeight: 'bold' }}>Company Details</Typography>
                      <Typography><strong>Address:</strong> {e.company_address}</Typography>
                      <Typography><strong>Pincode:</strong> {e.pincode}</Typography>
                      <Typography><strong>GST IN:</strong> {e.gst_in}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" sx={{ marginBottom: '10px', fontWeight: 'bold' }}>Bank Details</Typography>
                      <Typography><strong>Bank:</strong> {e.bank_name}</Typography>
                      <Typography><strong>Branch:</strong> {e.branch_name}</Typography>
                      <Typography><strong>Account Number:</strong> {e.account_number}</Typography>
                      <Typography><strong>IFSC Code:</strong> {e.ifsc_code}</Typography>
                    </Grid>
                  </Grid>

                  <Box sx={{ marginTop: '20px' }}>

                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="h6" sx={{ marginBottom: '10px', fontWeight: 'bold' }}>Digital Seal</Typography>
                        <img
                          src={e.digital_seal}
                          alt="Digital seal"
                          style={{
                            maxWidth: '100%',
                            height: 'auto',
                            maxHeight: '150px',
                            objectFit: 'contain',
                            border: '1px solid #e0e0e0',
                            borderRadius: '4px',
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="h6" sx={{ marginBottom: '10px', fontWeight: 'bold' }}>Digital Signature</Typography>
                        <img
                          src={e.digital_signature}
                          alt="Digital signature"
                          style={{
                            maxWidth: '100%',
                            height: 'auto',
                            maxHeight: '150px',
                            objectFit: 'contain',
                            border: '1px solid #e0e0e0',
                            borderRadius: '4px',
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              ))
            ) : ( <Box sx={{ display: 'flex', justifyContent: 'center', marginY: '20px' }}>

              <Button variant="outlined" onClick={handleAdd}>Add</Button>
            </Box>
            )} {
              (open || edit) && (
                <Modal
                  open={open}
                  onClose={() => setOpen(false)}
                  aria-labelledby="modal-title"
                  aria-describedby="modal-description"
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '90%',
                      maxWidth: 800,
                      bgcolor: 'background.paper',
                      boxShadow: 24,
                      p: { xs: 2, sm: 4 },
                      borderRadius: 2,
                      maxHeight: '90vh',
                      overflowY: 'auto',
                    }}
                    component="form"
                    onSubmit={handleFormSubmit}
                  >
                    <Typography id="modal-title" variant="h6" sx={{fontWeight:'bold'}} component="h2" gutterBottom>
                      {edit ? 'Edit Company Details' : 'Add Company Details'}
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <InputLabel htmlFor="user_id">User ID</InputLabel>
                        <Input
                          fullWidth
                          id="user_id"
                          name="user_id"
                          value={data.user_id}
                          onChange={handleChange}
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <InputLabel htmlFor="company_name">Company Name</InputLabel>
                        <Input
                          fullWidth
                          id="company_name"
                          name="company_name"

                          value={data.company_name}
                          onChange={handleChange}

                          margin="normal"
                        />
                      </Grid>

                      {/* <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>Company Logo</Typography>
                        <Input
                          type="file"
                          id="company_logo"
                          name="company_logo"
                          onChange={handleImageChange}
                          sx={{ display: 'none' }}
                        />
                        <label htmlFor="company_logo">
                          <Button variant="contained" component="span">
                            Upload Logo
                          </Button>
                        </label>
                        {dataImage.company_logo && (
                          <Box mt={2}>
                            <img src={dataImage.company_logo} alt="Company Logo" style={{ maxWidth: '200px' }} />
                          </Box>
                        )}
                      </Grid> */}

                      <Grid item xs={12} sm={6}>
                        <InputLabel htmlFor="company_address">Address</InputLabel>
                        <Input
                          fullWidth
                          id="company_address"
                          name="company_address"
                          multiline
                          value={data.company_address}
                          onChange={handleChange}
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <InputLabel htmlFor="pincode">Pincode</InputLabel>
                        <Input
                          fullWidth
                          id="pincode"
                          name="pincode"
                          value={data.pincode}
                          onChange={handleChange}
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <InputLabel htmlFor="bank_name">Bank Name</InputLabel>
                        <Input
                          fullWidth
                          id="bank_name"
                          name="bank_name"

                          value={data.bank_name}
                          onChange={handleChange}

                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <InputLabel htmlFor="branch_name">Branch Name</InputLabel>
                        <Input
                          fullWidth
                          id="branch_name"
                          name="branch_name"
                          value={data.branch_name}
                          onChange={handleChange}
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <InputLabel htmlFor="account_number">Account Number</InputLabel>
                        <Input
                          fullWidth
                          id="account_number"
                          name="account_number"

                          value={data.account_number}
                          onChange={handleChange}

                          margin="normal"
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <InputLabel htmlFor="gst.in">GST</InputLabel>
                        <Input
                          fullWidth
                          id="gst_in"
                          name="gst_in"

                          value={data.gst_in}
                          onChange={handleChange}

                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <InputLabel htmlFor="ifcs_code">IFSC Code</InputLabel>
                        <Input
                          fullWidth
                          id="ifsc_code"
                          name="ifsc_code"
                          value={data.ifsc_code}
                          onChange={handleChange}
                          margin="normal"
                        />
                      </Grid>
                      <Grid container spacing={3} sx={{margin:"10px"}}>
                      <Grid item xs={12} sm={4} >
                        <Typography variant="subtitle1" gutterBottom>Company Logo</Typography>
                        <Input
                          type="file"
                          id="company_logo"
                          name="company_logo"
                          onChange={handleImageChange}
                          sx={{ display: 'none' }}
                        />
                        <label htmlFor="company_logo">
                          <Button variant="contained" component="span">
                            Upload Logo
                          </Button>
                        </label>
                        {dataImage.company_logo && (
                          <Box mt={2}>
                            <img src={dataImage.company_logo} alt="Company Logo" style={{ maxWidth: '200px' }} />
                          </Box>
                        )}
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <Typography variant="subtitle1" gutterBottom>Digital Seal</Typography>
                        <Input
                          type="file"
                          id="digital_seal"
                          name="digital_seal"
                          onChange={handleImageChange}
                          sx={{ display: 'none' }}
                        />
                        <label htmlFor="digital_seal">
                          <Button variant="contained" component="span">
                            Upload Seal
                          </Button>
                        </label>
                        {dataImage.digital_seal && (
                          <Box mt={2}>
                            <img src={dataImage.digital_seal} alt="Digital Seal" style={{ maxWidth: '200px' }} />
                          </Box>
                        )}
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="subtitle1" gutterBottom>Digital Signature</Typography>
                        <Input
                          type="file"
                          id="digital_signature"
                          name="digital_signature"
                          onChange={handleImageChange}
                          sx={{ display: 'none' }}
                        />
                        <label htmlFor="digital_signature">
                          <Button variant="contained" component="span">
                            Upload Signature
                          </Button>
                        </label>
                        {dataImage.digital_signature && (
                          <Box mt={2}>
                            <img src={dataImage.digital_signature} alt="Digital Signature" style={{ maxWidth: '200px' }} />
                          </Box>
                        )}
                      </Grid>
                      </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                      <Button onClick={() => setOpen(false)} sx={{ mr: 1 }}>
                        Cancel
                      </Button>
                      <Button type="submit" variant="contained" color="primary">
                        {edit ? 'Update' : 'Save'}
                      </Button>
                    </Box>
                  </Box>
                </Modal>
              )}
          </Box>
        </Box>
      </div>
    </>
  )
}
