import React, { useEffect, useState } from "react";
import axios from "axios";
import { Route, Routes } from "react-router-dom";
import EmployeeForm from "./EmployeeForm";
import EmployeeTable from "./EmployeeTable";

export default function AddEmployee() {
  let [data, setData] = useState([]);
  let [edit, setEdit] = useState({});
  let [open, setOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  function addData(data, editable) {
    if (editable) {
      axios
        .put(`http://localhost:3000/employee/${edit.id}`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          fetchData();
          setEdit({});
          setOpen(false);
        })
        .catch((error) => {
          console.log("error editing");
        });
    } else {
      axios
        .post(`http://localhost:3000/employee/`, data ,{
          headers:{
            "Content-Type":"application/json"
          }
        })
        .then((response) => {
          fetchData();
          setOpen(false);
        })
        .catch((error) => {
          console.log("error adding data");
        });
    }
  }
  function editData(data) {
    setEdit({ ...data });
    setOpen(true);
  }
  function deleteData(id) {
    axios
      .delete(`http://localhost:3000/employee/${id}`)
      .then((response) => {
        fetchData();
        setData(data.filter((e) => e.id !== id));
      })
      .catch((error) => {
        console.log("error deleting data");
      });
  }
  async function fetchData() {
    try {
      const response = await axios.get(`http://localhost:3000/employee/`);
      setData(response.data);
    } catch (error) {
      console.log("error getting data");
    }
  }
  return (
    <>
      <EmployeeForm
        open={open}
        onClose={() => setOpen(false)}
        addData={addData}
        edit={edit}
      />
      <Routes>
        <Route
          path="/"
          element={
            <EmployeeTable
              data={data}
              edit={editData}
              dlt={deleteData}
              setOpen={setOpen}
            />
          }
        />
      </Routes>
    </>
  );
}
