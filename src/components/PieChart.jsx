import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import { MenuItem, Box, FormControl, InputLabel, Select } from "@mui/material";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { CgEnter } from "react-icons/cg";
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [chartData, setChartData] = useState({
    labels: ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"],
    datasets: [
      {
        data: [10, 20, 30, 40, 50],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#F7464A",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#F7464A",
        ],
      },
    ],
  });

//   const handleChange = (event) => {
//     setSelectedOption = event.target.value;
//     updateChartData(event.target.value);
//   };
const handleChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    updateChartData(selectedValue);
};

  const updateChartData = (option) => {
    let newData;
    switch (option) {
      case "Option 1":
        newData = [300, 50, 100];
        break;
      case "Option 2":
        newData = [200, 150, 80];
        break;
      case "Option 3":
        newData = [100, 300, 150];
        break;
      case "option 4":
        newData = [50, 200, 250];
        break;
      case "Option 5":
        newData = [400, 100, 50];
        break;
      default:
        newData = [300, 50, 100];
    }
    setChartData({
        ...chartData,
        datasets: [{ ...chartData.datasets[0], data: newData,}],
    });
};
    
  return (
    <Box>
      <FormControl variant="standard" sx={{width:300, marginLeft:15, marginBottom:4}}>
        
        <InputLabel id="select-label">Choose any option to see data</InputLabel>
        <Select
          labelId="select-label"
            value={selectedOption}
          onChange={handleChange}
          label="Select Any Option"
          //   defaultValue=""
        >
          <MenuItem value="Option 1">Option 1</MenuItem>
          <MenuItem value="Option 2">Option 2</MenuItem>
          <MenuItem value="Option 3">Option 3</MenuItem>
          <MenuItem value="Option 4">Option 4</MenuItem>
          <MenuItem value="Option 5">Option 5</MenuItem>
        </Select>
      </FormControl>
      <Box width="350px" height="350px" marginLeft={10} >
        <Pie data={chartData}/>
      </Box>
    </Box>
  );
};

export default PieChart;
