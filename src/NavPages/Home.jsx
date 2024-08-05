import React, { useEffect, useState } from "react";
import NavBar from "../NavBar";
import Box from "@mui/material/Box";
import { Grid, Typography } from "@mui/material";
import axios from "axios";

import Plot from "react-plotly.js";

import base_url from "../utils/API";
import PieChart from "../components/PieChart";
import { AccountTreeOutlined, CurrencyRupeeOutlined, MovingOutlined, PeopleAltOutlined, TaskAltOutlined } from "@mui/icons-material";

export default function Home() {
  // const [dashboard, setDashboard] = useState([])
  // useEffect(() => {
  //   fetchData()
  // }, [])
  // const fetchData = async () => {
  //   try {
  //     const response = await axios.get(`http://localhost:3000/dashboard/`)
  //     setDashboard(response.data)
  //   }
  //   catch (error) {
  //     console.log('error fetching data');
  //   }
  // }
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get(`${base_url}/client/chart/`);
      console.log(response.data);
      setTableData(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  return (
    <>
      <Box sx={{
        display: "flex",
        flexDirection: { xs: 'column', md: 'row' },
        p: { xs: 2, sm: 5, md: 10 }
      }}>
        <NavBar />
        <Box component="main" sx={{ flexGrow: 1, width: '100%' }}>


          <Grid container spacing={2} sx={{ mt: 3, mb: 3 }} >
            <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', flexWrap: 'wrap' }} item xs={12} sm={6} md={4}>
              <Box sx={{

                border: '1px solid white',
                color: "#53B789",
                backgroundColor: "white",
                boxShadow: '0 0 10px 10px #eeeeee ',
                display: "flex",
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                justifyContent: "space-between",
                p: { xs: 2, sm: 3 },
                height: '100%',
                width: '100%'
              }}>
                <Box>
                  <TaskAltOutlined />
                </Box>
                <Box sx={{ textAlign: 'right', padding: '0', }}>
                  <Typography sx={{ fontWeight: "100" }}>Recent Activity</Typography>
                  <Typography sx={{ fontSize: "25px", fontWeight: "600" }}>Dashboard</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', flexWrap: 'wrap' }} item xs={12} sm={6} md={4}>
              <Box sx={{

                border: '1px solid white',
                color: "#53B789",
                backgroundColor: "white",
                boxShadow: '0 0 10px 10px #eeeeee ',
                display: "flex",
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                justifyContent: "space-between",
                p: { xs: 2, sm: 3 },
                height: '100%',
                width: '100%'
              }}>
                <Box>

                  <MovingOutlined />
                </Box>
                <Box sx={{ textAlign: 'right', padding: '0', }}>

                  <Typography sx={{ fontWeight: "100" }}>Total Sales</Typography>
                  <Typography sx={{ fontSize: "25px", fontWeight: "600" }}>45</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', flexWrap: 'wrap' }} item xs={12} sm={6} md={4}>
              <Box sx={{

                border: '1px solid white',
                color: "#53B789",
                backgroundColor: "white",
                boxShadow: '0 0 10px 10px #eeeeee ',
                display: "flex",
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                justifyContent: "space-between",
                p: { xs: 2, sm: 3 },
                height: '100%',
                width: '100%'
              }}>
                <Box>

                  <CurrencyRupeeOutlined />
                </Box>
                <Box sx={{ textAlign: 'right', padding: '0', }}>

                  <Typography sx={{ fontWeight: "100" }}>Total Income</Typography>
                  <Typography sx={{ fontSize: "25px", fontWeight: "600" }}>650000</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', flexWrap: 'wrap' }} item xs={12} sm={6} md={4}>
              <Box sx={{

                border: '1px solid white',
                color: "#53B789",
                backgroundColor: "white",
                boxShadow: '0 0 10px 10px #eeeeee ',
                display: "flex",
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                justifyContent: "space-between",
                p: { xs: 2, sm: 3 },
                height: '100%',
                width: '100%'
              }}>
                <Box>

                  <AccountTreeOutlined />
                </Box>
                <Box sx={{ textAlign: 'right', padding: '0', }}>
                  <Typography sx={{ fontWeight: "100" }}>Number of Projects</Typography>
                  <Typography sx={{ fontSize: "25px", fontWeight: "600", }}>40</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', flexWrap: 'wrap' }} item xs={12} sm={6} md={4} >
              <Box sx={{

                border: '1px solid white',
                color: "#53B789",
                backgroundColor: "white",
                boxShadow: '0 0 10px 10px #eeeeee ',
                display: "flex",
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                justifyContent: "space-between",
                p: { xs: 2, sm: 3 },
                height: '100%',
                width: '100%'
              }}>
                <Box>
                  <PeopleAltOutlined />
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontWeight: "100" }}>Total Clients</Typography>
                  <Typography sx={{ fontSize: "25px", fontWeight: "600" }}>25</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>

              <Plot
                data={[
                  {
                    x: ['A', 'B', 'C', 'D', 'E'],
                    y: [20, 50, 40, 36, 18],
                    type: "scatter",
                    mode: "lines+markers",
                    marker: { color: "rgb(18, 50, 112)" },
                    name: "Product A",
                  },
                  {
                    x: ['A', 'B', 'C', 'D', 'E'],
                    y: [30, 45, 50, 33, 28], // Example data for Product B
                    type: "scatter",
                    mode: "lines+markers",
                    marker: { color: "pink" },
                    name: "Product B",
                  },
                  {
                    x: ['A', 'B', 'C', 'D', 'E'],
                    y: [15, 25, 35, 40, 30], // Example data for Product C
                    type: "scatter",
                    mode: "lines+markers",
                    marker: { color: "green" },
                    name: "Product C",
                  },
                  {
                    x: ['A', 'B', 'C', 'D', 'E'],
                    y: [22, 28, 38, 35, 27], // Example data for Product D
                    type: "scatter",
                    mode: "lines+markers",
                    marker: { color: "blue" },
                    name: "Product D",
                  },
                  {
                    x: ['A', 'B', 'C', 'D', 'E'],
                    y: [25, 30, 45, 32, 20], // Example data for Product E
                    type: "scatter",
                    mode: "lines+markers",
                    marker: { color: "red" },
                    name: "Product E",
                  },
                ]}
                layout={{
                  title: "TOTAL SALES",
                  width: 600,
                  height: 450,
                  // autosize: true,
                  xaxis: { title: "Category", showgrid: true, zeroline: false },
                  yaxis: { title: "Amount" },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>

              <Plot
                data={[
                  {
                    labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
                    values: [20, 50, 40, 36, 18], // Example values corresponding to total sales
                    type: 'pie',
                    marker: {
                      colors: ['rgb(18, 50, 112)', 'pink', 'green', 'blue', 'red'], // Assigning colors to each slice
                    },
                  },
                ]}
                layout={{
                  title: 'TOTAL SALES DISTRIBUTION',
                  width: 600,
                  height: 500,
                  // autosize:true,
                }}
              />
            </Grid>
          </Grid>
          {/* <Plot
  data={[
    {
      x: ['A', 'B', 'C', 'D', 'E'],
      y: [20, 50, 40, 36, 18], // Example values
      type: 'bar',
      marker: {
        color: ['rgb(18, 50, 112)', 'pink', 'green', 'blue', 'red'], // Different color for each category
      },
    },
  ]}
  layout={{
    title: 'TOTAL SALES',
    width: 800,
    height: 450,
    xaxis: { title: 'Category' },
    yaxis: { title: 'Amount' },
  }}
/> */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>

              <Plot
                data={[
                  {
                    x: [20, 50, 40, 36, 18], // Values
                    y: ['A', 'B', 'C', 'D', 'E'], // Categories
                    type: 'bar',
                    orientation: 'h', // Set the orientation to horizontal
                    marker: {
                      color: ['crimson', 'darkgray', 'skyblue', 'brown', 'darkpink'], // Colors from top to bottom
                    },
                  },
                ]}
                layout={{
                  title: 'TOTAL SALES',
                  // autosize:true,
                  width: 550,
                  height: 450,
                  xaxis: { title: 'Amount' },
                  yaxis: { title: 'Category' },
                }}
              />

            </Grid>

            {/* 
    <Plot
      data={[
        {
          labels: tableData.tech_count_name,
          values: tableData.tech_count_num,
          type: "pie",
          },
      ]}
      layout={{
        title: "TECHNOLOGIES",
        width: 850,
        height: 500,
        margin: { l: 50, r: 50, b: 100, t: 120 },
        }}
        /> */}
            <Grid item xs={12} sm={6}>

              <Box sx={{ marginTop: 5 }}>
                <PieChart />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>



    </>
  );
}


