import React from "react";
import {
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  IconButton,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function EmployeeTable({ data, edit, dlt, setOpen }) {
  function handleAddClick() {
    edit({});
    setOpen(true);
  }
  return (
    <>
      <Box sx={{ display: "block" }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={handleAddClick}
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
        <TableContainer
          component={Paper}
          sx={{ maxHeight: "100vh", marginTop: 5 }}
        >
          <Table>
            <TableHead sx={{ m: 5, backgroundColor: "#53B789" }}>
              <TableRow>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  Employee ID
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  User ID
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  Age
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  Salary
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  ID Proof
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  Address
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  Pincode
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  City ID
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  State ID
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  Country ID
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  Role ID
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data &&
                data.map((e, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      m: 5,
                      height: "3",
                      backgroundColor: "#fff",
                      "&:hover": { backgroundColor: "#dcf0e7" },
                    }}
                  >
                    <TableCell sx={{ textAlign: "center" }}>{e.id}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {e.user_id}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{e.age}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {e.salary}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {e.id_proof}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {e.address}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {e.pincode}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {e.city_id}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {e.state_id}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {e.country_id}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {e.role_id}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <IconButton
                        onClick={() => edit(e)}
                        aria-label="edit"
                        sx={{ color: "grey" }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => dlt(e.id)}
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
    </>
  );
}
