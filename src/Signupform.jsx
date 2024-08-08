import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Input,
  Box,
  Button,
  FormControl,
  InputLabel,
  Link,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import base_url from "../src/utils/API";
export default function Signupform() {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate()

  const onSubmit = (formData) => {
    axios.post(`${base_url}/auth_user/user/`,
      formData, {
      headers: {
        "Content-Type": "application/json"
      }
    }).then((response) => {
      alert("User registered successfully");
      reset();
      navigate('/')
    }).catch((error) => {
      console.log("error");
      alert("An error occurred while registering");
    })
  };
  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          margin: 8,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          height: "100vh",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 4,
        }}
      >
        <FormControl fullWidth margin="normal">
          <InputLabel>Username</InputLabel>
          <Input
            type="text"
            placeholder="Enter Your Username"
            {...register("user_name")}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Firstname</InputLabel>
          <Input
            type="text"
            placeholder="Enter your Firstname"
            {...register("first_name")}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Lastname</InputLabel>
          <Input
            type="text"
            placeholder="Enter Your Lastname"
            {...register("last_name")}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Email Address</InputLabel>
          <Input
            type="email"
            placeholder="Enter Your Email address"
            {...register("email")}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Contact Number</InputLabel>
          <Input
            type="text"
            placeholder="Enter Your Contact Number"
            {...register("contact", {
              required: "contact number is required",
              pattern: {
                value: /^\+91\d{10}$/,
                message: "Contact number must be in the format +91XXXXXXXXXX",
              },
            })}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Password</InputLabel>
          <Input
            type="password"
            placeholder="Enter Your Password"
            {...register("password")}
          />
        </FormControl>

        <Link href="/">Already have an account</Link>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button type="submit" variant="contained" color="success">
            Sign up
          </Button>
        </Box>
      </Box>
    </>
  );
}
