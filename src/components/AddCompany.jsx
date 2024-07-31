// import { Box } from '@mui/material'
// import React from 'react'
// import NavBar from '../NavBar'

// const AddCompany = () => {
//   return (
//     <div>
//         <Box sx={{ display: "flex", p: 10 }}>
//         <NavBar />
//         <Box component="main" sx={{ flexGrow: 1 }}>
//                 <h1>Add Company Form Here</h1>
//         </Box>
//         </Box>
//     </div>
//   )
// }

// export default AddCompany


import { Box } from '@mui/material'
import React, { useState, useEffect } from 'react'
import NavBar from '../NavBar'
import { useForm } from "react-hook-form";
import {
    Input,
    Button,
    Typography,
    FormControl,
    TextField,
    Stack,
} from "@mui/material";
import axios from 'axios';
import base_url from '../utils/API';


export default function AddCompany() {
    const [data, setData] = useState(null)
    const [adding, setAdding] = useState(false)
    const [edit, setEdit] = useState(null)
    const { register, handleSubmit, reset } = useForm();
    const [logoPreview, setLogoPreview] = useState(null)
    const [sealPreview, setSealPreview] = useState(null)
    const [signaturePreview, setSignaturePreview] = useState(null)


    useEffect(() => {
        fetchData();
        if (edit) {
            reset({
                company_logo: "",
                company_name: edit.company_name || "",
                company_address: edit.company_address || "",
                pincode: edit.pincode || "",
                bank_name: edit.bank_name || "",
                branch_name: edit.branch_name || "",
                account_number: edit.account_number || "",
                ifsc_code: edit.ifsc_code || "",
                gst_in: edit.gst_in || "",
                digital_seal: "",
                digital_signature: "",
                user_id: edit.user_id || "",
            })
            setLogoPreview(edit.company_logo || "");
            setSealPreview(edit.digital_seal || "");
            setSignaturePreview(edit.digital_signature || "")
        }
    }, [reset, edit])

    const fetchData = () => {
        axios.get(`${base_url}/client/company_details/`)
            .then(response => {
              console.log(response.data,'36894689')
                if (response.data && response.data.length > 0) {
                    setData(response.data)
                }
            })
            .catch(error => {
                console.log("error fetching data", error);
            })
    }

    const handleEdit = (companyData) => {
        setEdit(companyData)
        setAdding(true)
    }
    const handleDelete = (company_details_id) => {
        axios
            .delete(`${base_url}/client/company_details/?delete=${company_details_id}`)
            .then(() => {
                fetchData();
            })
            .catch((error) => {
                console.error("Error", error);
            });
    }

    const handleAdd = () => {
        setAdding(true)
        setEdit(null)
    }

    const handleImageChange = (e, setImagePreview) => {
        const file = e.target.files[0]
        if (file) {
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleFormSubmit = (data) => {
        addData(data, edit !== null);
        reset()
    }

    function addData(data, isEditing) {
        const formData = new FormData()
        // formData.append('company_logo', data.company_logo[0]);
        formData.append('company_address', data.company_address);
        formData.append('company_name', data.company_name);
        formData.append('user_id', data.user_id);
        formData.append('pincode', data.pincode);
        formData.append('bank_name', data.bank_name);
        formData.append('branch_name', data.branch_name);
        formData.append('account_number', data.account_number);
        formData.append('ifsc_code', data.ifsc_code);
        formData.append('gst_in', data.gst_in);
        // formData.append('digital_seal', data.digital_seal[0]);
        // formData.append('digital_signature', data.digital_signature[0])

        const url = isEditing
            ? `${base_url}/client/company_details/?company_d_upd=${edit.company_details_id}`
            : `${base_url}/client/company_details/`;

        const method = isEditing ? axios.patch : axios.post;

        method(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
            .then((response) => {
                setData(response.data)
                setAdding(false)
                setEdit(null)
                fetchData();
            })
            .catch((error) => {
                console.log("error submitting data", error);
            })
    }

    return (
        <div>
            <Box sx={{ display: "flex", p: 10 }}>
                <NavBar />
                <Box component="main" sx={{ flexGrow: 1 }}>
                    {data ? (data.map((e, index) => (
                        <Box
                            key={index}
                            sx={{
                                maxWidth: "100%",
                                padding: '20px',
                                margin: '10px',
                                '@media (max-width:600px)': {
                                    padding: '10px',
                                    margin: '5px',
                                },
                            }}
                        >
                            <Button variant="contained" onClick={handleEdit(e)}>Edit</Button>
                            <Button variant="contained" onClick={handleDelete(e.company_details_id)}>Delete</Button>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexDirection: 'row',
                                    margin: '10px',
                                    padding: '10px',
                                    '@media (max-width:600px)': {
                                        flexDirection: 'column',
                                        margin: '5px',
                                        padding: '5px',
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        margin: '10px',
                                        '& img': {
                                            height: '25vh',
                                            width: '20vw',
                                            '@media (max-width:600px)': {
                                                height: '20vh',
                                                width: '80vw',
                                            },
                                        },
                                    }}
                                >
                                    <img src={e.company_logo} alt="logo" />
                                </Box>
                                <Box
                                    sx={{
                                        margin: '10px',
                                        textAlign: 'center',
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: "10px"
                                    }}
                                >
                                    <Typography variant="h4">{e.company_name}</Typography>
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexDirection: 'row',
                                    margin: '10px',
                                    padding: '10px',
                                    '@media (max-width:600px)': {
                                        flexDirection: 'column',
                                        margin: '5px',
                                        padding: '5px',
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        height: '30vh',
                                        width: '20vw',
                                        margin: '10px',
                                        padding: '20px',
                                        flexDirection: "column",
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        '@media (max-width:600px)': {
                                            width: '80vw',
                                            height: 'auto',
                                            padding: '10px',
                                        },
                                    }}
                                >
                                    <Typography variant="h6" sx={{ textAlign: 'left' }}>Address: {e.company_address}</Typography>
                                    <Typography variant="h6">Pincode: {e.pincode}</Typography>
                                </Box>
                                <Box
                                    sx={{
                                        height: '30vh',
                                        width: '20vw',
                                        margin: '10px',
                                        padding: '20px',
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: 'center',
                                        alignItems: 'left',
                                        '@media (max-width:600px)': {
                                            width: '80vw',
                                            height: 'auto',
                                            padding: '10px',
                                        },
                                    }}
                                >
                                    <Typography variant="h6">Bank : {e.bank_name}</Typography>
                                    <Typography variant="h6">Branch : {e.branch_name}</Typography>
                                    <Typography variant="h6">Account Number : {e.account_number}</Typography>
                                    <Typography variant="h6">IFSC Code : {e.ifsc_code}</Typography>
                                    <Typography variant="h6">GST IN : {e.gst_in}</Typography>
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexDirection: 'row',
                                    margin: '10px',
                                    padding: '10px',
                                    '@media (max-width:600px)': {
                                        flexDirection: 'column',
                                        margin: '5px',
                                        padding: '5px',
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        margin: '10px',
                                        '& img': {
                                            height: '20vh',
                                            width: '20vw',
                                            borderRadius: '8px',
                                            '@media (max-width:600px)': {
                                                height: '15vh',
                                                width: '80vw',
                                            },
                                        },
                                    }}
                                >
                                    <Typography variant="h6">Digital Seal :</Typography>
                                    <img src={e.digital_seal} alt="seal" />
                                </Box>
                                <Box
                                    sx={{
                                        height: '20vh',
                                        width: '20vw',
                                        margin: '10px',
                                        '@media (max-width:600px)': {
                                            width: '80vw',
                                            height: 'auto',
                                        },
                                    }}
                                >
                                    <Typography variant="h6">Digital Signature : </Typography>
                                    <img
                                        src={e.digital_signature}
                                        alt="signature"
                                        style={{
                                            height: '20vh',
                                            width: '20vw',
                                            '@media (max-width:600px)': {
                                                height: '15vh',
                                                width: '80vw',
                                            },
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Box>

                    ))
                    ) : (adding || edit ? (
                        <Box sx={{ display: 'block' }} component="form" onSubmit={handleSubmit(handleFormSubmit)}>
                            <Stack spacing={2} direction='row'>
                                <Input
                                    type="text"
                                    id="user_id"
                                    name="user_id"
                                    placeholder="Enter User ID"
                                    {...register("user_id")}
                                    variant="standard"
                                />
                                <Input
                                    type="text"
                                    id="company_name"
                                    name="company_name"
                                    placeholder="Enter Company Name"
                                    {...register("company_name")}
                                    variant="standard"
                                />
                            </Stack>
                            <FormControl margin="normal">
                                <Typography marginBottom={2}>Add Company Logo</Typography>
                                <Input
                                    type="file"
                                    id="logo"
                                    name="logo"
                                    placeholder="Insert Logo"
                                    {...register("logo")}
                                    onChange={(e) => handleImageChange(e, setLogoPreview)}
                                    variant="standard"
                                />
                                {logoPreview && (
                                    <Box mt={2} textAlign="center">
                                        <img src={logoPreview} alt="Logo Preview" style={{ maxWidth: '100%', maxHeight: 150 }} />
                                    </Box>
                                )}
                            </FormControl>
                            <Typography>Company Address</Typography>
                            <Stack spacing={4} direction='row' marginBottom={2}>
                                <TextField
                                    type="text"
                                    id="Address"
                                    name="Address"
                                    placeholder="Company Address"
                                    multiline
                                    maxRows={4}
                                    variant="standard"
                                    {...register("Address")}
                                />
                                <Input
                                    type="text"
                                    id="pincode"
                                    name="pincode"
                                    placeholder="Pincode"
                                    {...register("pincode")}
                                />
                            </Stack>
                            <Typography>Bank Details</Typography>
                            <Stack spacing={2} direction='row' marginBottom={2}>
                                <Input
                                    type="text"
                                    id="bankname"
                                    name="bankname"
                                    placeholder="Bank Name"
                                    {...register("bankname")}
                                />
                                <Input
                                    type="text"
                                    id="branch_name"
                                    name="branch_name"
                                    placeholder="Branch Name"
                                    {...register("branch_name")}
                                />
                            </Stack>
                            <Stack spacing={4} direction='row' marginBottom={2}>
                                <Input
                                    type="text"
                                    id="accountnumber"
                                    name="accountnumber"
                                    placeholder="Account Number"
                                    {...register("accountnumber")}
                                />
                                <Input
                                    type="text"
                                    id="ifsc"
                                    name="ifsc"
                                    placeholder="IFSC Code"
                                    {...register("ifsc")}
                                />
                                <Input
                                    type="text"
                                    id="gst_in"
                                    name="gst_in"
                                    placeholder="GST"
                                    {...register("gst_in")}
                                />
                            </Stack>
                            <Stack spacing={4} direction='row'>
                                <FormControl margin="normal">
                                    <Typography marginBottom={2}>Add Company Seal</Typography>
                                    <Input
                                        type="file"
                                        id="seal"
                                        name="seal"
                                        {...register("seal")}
                                        onChange={(e) => handleImageChange(e, setSealPreview)}
                                    />
                                    {sealPreview && (
                                        <Box mt={2} textAlign="center">
                                            <img src={sealPreview} alt="Seal Preview" style={{ maxWidth: '100%', maxHeight: 150 }} />
                                        </Box>
                                    )}
                                </FormControl>
                                <FormControl margin="normal">
                                    <Typography marginBottom={2}>Add Company Digital Signature</Typography>
                                    <Input
                                        type="file"
                                        id="signature"
                                        name="signature"
                                        {...register("signature")}
                                        onChange={(e) => handleImageChange(e, setSignaturePreview)}
                                    />
                                    {signaturePreview && (
                                        <Box mt={2} textAlign="center">
                                            <img src={signaturePreview} alt="Signature Preview" style={{ maxWidth: '100%', maxHeight: 150 }} />
                                        </Box>
                                    )}
                                </FormControl>
                            </Stack>
                            <Stack spacing={60} direction='row' marginTop={2}>
                                <Button type="submit" variant="contained" color="success">
                                    Submit
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => {
                                        setAdding(false);
                                        setEdit(null);
                                        reset();
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Stack>
                        </Box>
                    ) : (
                        <Button variant="contained" onClick={handleAdd}>Add</Button>
                    ))}
                </Box>
            </Box>
        </div>
    )
}
