import React, { useEffect, useState } from "react";
import NavBar from "../NavBar";
import Box from "@mui/material/Box";
import Plot from "react-plotly.js";
import axios from "axios";
import base_url from "../utils/API";
import PieChart from "../components/PieChart";

function Home(props) {
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
    <div>
      <Box sx={{ display: "flex", p: 10 }}>
        <NavBar />
        <Box component="main" sx={{ flexGrow: 1 }}>
          {/* <h1>Total Sales</h1> */}
          <Plot
            data={[
              {
                x: tableData.due_date,
                y: tableData.total_amount,
                type: "bar",
                mode: "lines+markers",
                marker: { color: "123270" },
              },
            ]}
            layout={{
              title: "TOTAL SALES",
              width: 800,
              height: 450,
              xaxis: { title: "Invoices - Month Wise" },
              yaxis: { title: "Amount" },
            }}
          />

          {/* <Plot
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
          <Box sx={{marginTop:5}}>
          <PieChart/>
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default Home;
