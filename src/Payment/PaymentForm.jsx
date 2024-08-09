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
  useMediaQuery
} from "@mui/material";

export default function PaymentForm({ addData, edit, open, onClose }) {
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    reset({
      invoice_id: edit?.invoice_id || "",
      method_id: edit?.method_id || "",
      amount: edit?.amount || "",
      payment_date: edit?.payment_date || "",
    });
  }, [edit, reset]);

  const onSubmit = (data) => {
    addData(data, Object.keys(edit || {}).length > 0);
    onClose();
  };
  const isSmallScreen = useMediaQuery("(max-width:600px)");

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
        >
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="invoice_id">Invoice ID</InputLabel>
            <Input
              id="invoice_id"
              name="invoice_id"
              {...register("invoice_id")}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="method_id">Method ID</InputLabel>
            <Input id="method_id" name="method_id" {...register("method_id")} />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="amount">Amount</InputLabel>
            <Input
              type="number"
              id="amount"
              name="amount"
              {...register("amount")}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <Input
              type="date"
              id="payment_date"
              name="payment_date"
              {...register("payment_date")}
            />
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
