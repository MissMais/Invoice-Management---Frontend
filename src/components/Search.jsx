import React, { useState } from "react";

import { styled, alpha } from "@mui/material/styles";

import InputBase from "@mui/material/InputBase";

import SearchIcon from "@mui/icons-material/Search";


const Search = ({ data }) => {
  console.log(data, "yriurfylriei");

  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  }));

  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    width: "100%",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),

      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      [theme.breakpoints.up("sm")]: {
        width: "12ch",
        "&:focus": {
          width: "20ch",
        },
      },
    },
  }));

  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      
      <Search sx={{ marginRight: 5 }}>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          sx={{
            width: 750,
            borderWidth: 0.5,
            borderColor: "gray",
            borderRadius: 5,
          }}
          placeholder="Search…"
          inputProps={{ "aria-label": "search" }}
        />
      </Search>
    </div>
  );
};

export default Search;
