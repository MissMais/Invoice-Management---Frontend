import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Input,
  Box,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Modal,
} from "@mui/material";

export default function EmployeeForm({ addData, edit, open, onClose }) {
  const { register, handleSubmit, reset } = useForm();
  useEffect(() => {
    reset({
      user_id: edit?.user_id || "",
      age: edit?.age || "",
      salary: edit?.salary || "",
      id_proof: edit?.id_proof || "",
      address: edit?.address || "",
      pincode: edit?.pincode || "",
      city_id: edit?.city_id || "",
      state_id: edit?.state_id || "",
      country_id: edit?.country_id || "",
      role_id: edit?.role_id || "",
    });
  }, [edit, reset]);
  function onSubmit(data) {
    addData(data, Object.keys(edit || {}).length > 0);
    onClose();
  }

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            maxHeight: "80vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            border: "3px solid #455a64",
            boxShadow: 24,
            p: 4,
            borderRadius: 4,
          }}
        >
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="user_id">User ID</InputLabel>
            <Input id="user_id" name="user_id" {...register("user_id")} />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="age">Age</InputLabel>
            <Input id="age" name="age" {...register("age")} />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="salary">Salary</InputLabel>
            <Input
              type="number"
              id="salary"
              name="salary"
              {...register("salary")}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="id_proof">ID Proof</InputLabel>
            <Input id="id_proof" name="id_proof" {...register("id_proof")} />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="address">Address</InputLabel>
            <Input id="address" name="address" {...register("address")} />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="pincode">Pincode</InputLabel>
            <Input id="pincode" name="pincode" {...register("pincode")} />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="city_id">City ID</InputLabel>
            <Input id="city_id" name="city_id" {...register("city_id")} />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="state_id">State ID</InputLabel>
            <Input id="state_id" name="state_id" {...register("state_id")} />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="country_id">Country ID</InputLabel>
            <Input
              id="country_id"
              name="country_id"
              {...register("country_id")}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="role_id">Role ID</InputLabel>
            <Input id="role_id" name="role_id" {...register("role_id")} />
          </FormControl>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button type="submit" variant="contained" color="success">
              Submit
            </Button>
            <Button variant="outlined" color="error" onClick={onClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
