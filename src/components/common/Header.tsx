import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Divider,
  Stack,
  Modal,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Container,
  useMediaQuery,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Menu as MenuIcon } from "@mui/icons-material";
import logo from "../../assets/logo.png";
import UserMenu from "../User/UserMenu";
import { ModalClose, ModalDialog } from "@mui/joy";
import Login from "../User/Login";
import Register from "../User/Register";
import NotificationSnackbar, { NotificationAlert } from "./NotificationSnackbar";

const Header: React.FC = () => {
  const [alert, setAlert] = useState<NotificationAlert>({
    open: false,
    message: "",
    severity: "success",
  });
  const isLoggedIn = Boolean(localStorage.getItem("role"));
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={1}
      sx={{ backgroundColor: "white" }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          mx: "auto",
          maxWidth: "1200px",
          width: "100%",
          py: 1,
          px: 2,
          boxSizing: "border-box",
        }}
      >
        {/* Logo */}
        <Box>
          <Link to="/" style={{ textDecoration: "none" }}>
            <img
              src={logo}
              alt="logo"
              style={{ maxWidth: isMobile ? "150px" : "250px", height: "auto" }}
            />
          </Link>
        </Box>

        {/* Desktop Menu */}
        {!isMobile ? (
          <Stack direction="row" spacing={3} alignItems="center">
            <Link to="/aboutus" style={{ textDecoration: "none" }}>
              <Button
                sx={{
                  fontWeight: 500,
                  textTransform: "none",
                  color: "black",
                  "&:hover": { color: "#05ce80" },
                }}
              >
                About Karental
              </Button>
            </Link>
            <Divider orientation="vertical" flexItem />

            {!isLoggedIn ? (
              <>
                <Button
                  onClick={handleOpen}
                  id="open-register-button"
                  sx={{
                    fontWeight: 500,
                    textTransform: "none",
                    color: "black",
                    "&:hover": { color: "#05ce80" },
                  }}
                >
                  Sign Up
                </Button>
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ width: "1px", height: "25px", alignSelf: "center" }}
                />
                <Button
                  onClick={handleOpen}
                  id="open-login-button"
                  variant="outlined"
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    borderColor: "black",
                    color: "black",
                    fontWeight: 500,
                    textTransform: "none",
                    "&:hover": { borderColor: "#05ce80", color: "#05ce80" },
                  }}
                >
                  Login
                </Button>
              </>
            ) : (
              <UserMenu />
            )}
          </Stack>
        ) : (
          <IconButton onClick={toggleDrawer} sx={{ color: "black" }}>
            <MenuIcon />
          </IconButton>
        )}

        {/* Mobile Drawer */}
        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
          <List sx={{ width: "250px" }}>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/aboutus" onClick={toggleDrawer}>
                About Karental
              </ListItemButton>
            </ListItem>
            {!isLoggedIn ? (
              <>
                <ListItem disablePadding>
                  <ListItemButton onClick={handleOpen}>
                    Sign Up
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={handleOpen}>
                    Login
                  </ListItemButton>
                </ListItem>
              </>
            ) : (
              <UserMenu />
            )}
          </List>
        </Drawer>

        {/* Login/Register Modal */}
        <Modal open={open} onClose={handleClose}>
          <ModalDialog
            sx={{
              width: "65vw",
              maxWidth: "lg",
              maxHeight: "100vh",
              overflowY: "auto",
              zIndex: 1200,
            }}
          >
            <ModalClose onClick={handleClose} />
            <Container
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: 2,
              }}
            >
              <Login onLoginSuccess={handleClose} setAlert={setAlert} />
              {!isMobile && <Divider orientation="vertical" flexItem />}
              <Register
                isCarOwner={false}
                onRegisterSucess={handleClose}
                setAlert={setAlert}
              />
            </Container>
          </ModalDialog>
        </Modal>

        {/* Notification Snackbar */}
        <NotificationSnackbar
          alert={alert}
          onClose={() => setAlert({ ...alert, open: false })}
        />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
