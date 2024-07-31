import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import HomeIcon from "@mui/icons-material/Home";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import GroupIcon from "@mui/icons-material/Group";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { routeNames } from "./Base";
import { useAuth } from "./auth";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function NavBar() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [modalOpen, setModalOpen] = React.useState(false);
  const location = useLocation();
  const { clearTokens } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddCompany = () => {
    handleMenuClose();
    navigate("/AddCompany");
  };

  const handleViewCompany = () => {
    handleMenuClose();
    navigate("/ViewCompany");
  };

  const Logout = () => {
    clearTokens();
    navigate("/");
  };
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  function toClient() {
    navigate("/Client");
  }
  function toProject() {
    navigate("/Project");
  }
  function toInvoice() {
    navigate("/Invoice");
  }
  function toInvoiceItem() {
    navigate("/InvoiceItem");
  }
  function toPayment() {
    navigate("/Payment");
  }
  function toPaymentMethod() {
    navigate("/PayMethod");
  }
  function toTax() {
    navigate("/Tax");
  }

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{ bgcolor: "#123270" }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            INVOICE AND BILLING
          </Typography>
          <Button color="inherit" onClick={handleModalOpen}>
            <AddIcon />
          </Button>

          <Button color="inherit" onClick={Logout}>
            <LogoutIcon />
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem
            disablePadding
            sx={{
              display: "block",
              backgroundColor:
                location.pathname === routeNames.HOME ? "#53B789" : "initial",
                
              color:
              location.pathname === routeNames.HOME ? "white" : "initial",
            }}
            onClick={() => navigate("/")}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                  
                  color:
                  location.pathname === routeNames.HOME ? "white" : "initial",
                }}
              >
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>

          <ListItem
            disablePadding
            sx={{
              display: "block",
              backgroundColor:
                location.pathname === routeNames.INVOICE
                  ? "#53B789"
                  : "initial",
                  
              color:
              location.pathname === routeNames.INVOICE ? "white" : "initial",
            }}
            onClick={() => navigate("/Invoice")}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                  color:
                  location.pathname === routeNames.INVOICE ? "white" : "initial",
                }}
              >
                <ReceiptIcon />
              </ListItemIcon>
              <ListItemText primary="Invoice" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
          <ListItem
            disablePadding
            sx={{
              display: "block",
              backgroundColor:
                location.pathname === routeNames.CLIENT ? "#53B789" : "initial",
              color:
                location.pathname === routeNames.CLIENT ? "white" : "initial",
            }}
            onClick={() => navigate("/Client")}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                  color:
                  location.pathname === routeNames.CLIENT ? "white" : "initial",
                }}
              >
                <GroupIcon />
              </ListItemIcon>
              <ListItemText primary="Client" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
          <ListItem
            disablePadding
            sx={{
              display: "block",
              backgroundColor:
                location.pathname === routeNames.PROFILE
                  ? "skyblue"
                  : "initial",
            }}
            onClick={handleMenuOpen}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
      </Drawer>
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        sx={{
          "& .MuiPaper-root": {
            marginTop: 1,
            marginLeft: 1,
            color: "black",
            width: 220,
            height: "auto",
            // backgroundColor: "#123270",
            borderRadius: 2,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <MenuItem
          sx={{
            fontSize: "16px",
            padding: "10px 20px",
            paddingLeft: "50px",
            "&:hover": {
              color: "white",
              backgroundColor: "#53B789",
            },
          }}
          onClick={handleAddCompany}
        >
          Company Info
        </MenuItem>
        {/* <MenuItem
          sx={{
            fontSize: "16px",
            padding: "10px 20px",
            paddingLeft: "50px",

            "&:hover": {
              backgroundColor: "#53B789",
            },
          }}
          onClick={handleViewCompany}
        >
          View Company
        </MenuItem> */}
      </Menu>
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "45%",
            left: "55%",
            transform: "translate(-50%, -50%)",
            width: 800,
            height: 300,
            bgcolor: "background.paper",
            border: "1px solid #000",
            borderRadius: 3,
            p: 3,
            boxShadow: 24,
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <Typography variant="h8">
                <GridViewOutlinedIcon /> GENERAL
              </Typography>
              <ul>
                <br />
                <li>
                  <Button
                    onClick={toClient}
                    sx={{
                      color: "black",
                      "&:hover": {
                        color: "white",
                        backgroundColor: "#53B789",
                      },
                    }}
                  >
                    + Client
                  </Button>
                </li>
                <br />
                <li>
                  {" "}
                  <Button
                    onClick={toProject}
                    sx={{
                      color: "black",
                      "&:hover": {
                        color: "white",
                        backgroundColor: "#53B789",
                      },
                    }}
                  >
                    + Project
                  </Button>
                </li>
                <br />
              </ul>
            </Grid>
            <Grid item xs={3} sx={{ marginLeft: 6 }}>
              <Typography variant="h8">
                <ShoppingCartOutlinedIcon /> SALES
              </Typography>
              <ul>
                <br />
                <li>
                  <Button
                    onClick={toInvoice}
                    sx={{
                      color: "black",
                      "&:hover": {
                        color: "white",
                        backgroundColor: "#53B789",
                      },
                    }}
                  >
                    + Invoice
                  </Button>
                </li>
                <br />
                <li>
                  <Button
                    onClick={toInvoiceItem}
                    sx={{
                      color: "black",
                      "&:hover": {
                        color: "white",
                        backgroundColor: "#53B789",
                      },
                    }}
                  >
                    + Invoice Item
                  </Button>
                </li>
              </ul>
            </Grid>
            <Grid item xs={3} sx={{ marginLeft: 6 }}>
              <Typography variant="h8">
                <AccountBalanceOutlinedIcon /> BANKING
              </Typography>
              <ul>
                <br />
                <li>
                  <Button
                    onClick={toPayment}
                    sx={{
                      color: "black",
                      "&:hover": {
                        color: "white",
                        backgroundColor: "#53B789",
                      },
                    }}
                  >
                    + Payment
                  </Button>
                </li>
                <br />
                <li>
                  <Button
                    onClick={toPaymentMethod}
                    sx={{
                      color: "black",
                      "&:hover": {
                        color: "white",
                        backgroundColor: "#53B789",
                      },
                    }}
                  >
                    + Payment Method
                  </Button>
                </li>
                <br />
                <li>
                  <Button
                    onClick={toTax}
                    sx={{
                      color: "black",
                      "&:hover": {
                        color: "white",
                        backgroundColor: "#53B789",
                      },
                    }}
                  >
                    + Tax
                  </Button>
                </li>
                <br />
              </ul>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
}

