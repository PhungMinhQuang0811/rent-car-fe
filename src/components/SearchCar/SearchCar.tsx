import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Box, Typography, Modal } from "@mui/material";
import { Divider, Grid } from "@mui/joy";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setRentalTime } from "../../reducers/RentalTimeReducer";
import dayjs from "dayjs";
import bannerimg from "../../assets/search-img.jpg";
import AddressSelector from "../common/AddressSelector";
import RentalDatePicker from "../common/RentalDateTimePicker";
import { ModalClose, ModalDialog } from "@mui/joy";
import Register from "../User/Register";

const SearchCar: React.FC = () => {
  const [, setAlert] = useState<{ open: boolean; message: string; severity: "success" | "error" | "info" | "warning" }>({
    open: false,
    message: "",
    severity: "success",
  });
  const isLoggedIn = Boolean(localStorage.getItem("role"));
  const isCarOwner = false;
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const pickUpTime = useAppSelector((state) => state.rental.pickUpTime);
  const dropOffTime = useAppSelector((state) => state.rental.dropOffTime);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<Record<string, string>>({});
  const reduxAddress = useAppSelector((state) => state.rental.address);

  const handleRentalTimeChange = (newPickUpTime: string, newDropOffTime: string) => {
    const formattedPickUp = dayjs(newPickUpTime).format("YYYY-MM-DDTHH:mm:ss[Z]");
    const formattedDropOff = dayjs(newDropOffTime).format("YYYY-MM-DDTHH:mm:ss[Z]");
    localStorage.setItem("pickUpTime", formattedPickUp);
    localStorage.setItem("dropOffTime", formattedDropOff);
    dispatch(setRentalTime({ pickUpTime: formattedPickUp, dropOffTime: formattedDropOff }));
  };

  const validateField = (name: string, value: any) => {
    if (!value || !String(value).trim()) {
      if (name === "cityProvince") return "Please select a city/province";
      if (name === "district") return "";
      if (name === "ward") return "";
      if (name === "houseNumberStreet") return "";
      return "This field is required";
    }
    return "";
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    Object.keys(reduxAddress).forEach((key) => {
      const error = validateField(key, (reduxAddress as any)[key]);
      if (error) errors[key] = error;
    });

    setErrorMsg(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (new Date(dropOffTime).getTime() - new Date(pickUpTime).getTime() < 2 * 60 * 60 * 1000) {
      alert("Drop-off date time must be at least 2 hours later than Pick-up date time, please try again.");
      return;
    }
    const address = Object.values(reduxAddress).filter(Boolean).join(", ");
    const queryParams = new URLSearchParams({
      address: address,
      pickUpTime: pickUpTime,
      dropOffTime: dropOffTime,
      page: "0",
      size: "10",
      sort: "productionYear,desc",
    }).toString();
    localStorage.setItem("pickUpTime", pickUpTime);
    localStorage.setItem("dropOffTime", dropOffTime);
    navigate(`/search-result?${queryParams}`);
  };

  return (
    <Box
      sx={{
        maxWidth: "1200px",
        mx: "auto",
        mt: 4,
        minHeight: { xs: "auto", md: "550px" },
        backgroundImage: `url(${bannerimg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        borderRadius: "16px",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.55)",
          zIndex: 1,
        },
      }}
    >
      <Grid container sx={{ position: "relative", zIndex: 2, p: 4, color: "white" }}>
        {/* Left Side Text */}
        <Grid
          xs={12}
          md={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Typography variant="h3" fontWeight="bold">
            Looking for a <span style={{ color: "#05ce80" }}>vehicle</span>?
          </Typography>
          <Typography variant="h3" fontWeight="bold">
            You're at the <span style={{ color: "#05ce80" }}>right</span> place.
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 4, lineHeight: 1.6 }}>
            We have a <span style={{ color: "#05ce80" }}>large selection</span> of locally owned cars
            available for you to choose from. Rental plans are <span style={{ color: "#05ce80" }}>customised</span> to
            suit your needs.
          </Typography>
          <Divider sx={{ height: "1px", bgcolor: "rgb(255, 255, 255)", width: "60%", alignSelf: "center" }} />
          <Typography variant="subtitle1" sx={{ lineHeight: 1.6, mb: 2 }}>
            With over <span style={{ color: "#05ce80" }}>300 cars</span> located nationwide we will have something for
            you.
          </Typography>
        </Grid>

        {/* Right Side Search Box */}
        <Grid xs={12} md={6}>
          <Box
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              padding: 3,
              borderRadius: "12px",
              boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.3)",
            }}
          >
            <Typography variant="h5" fontWeight="bold">
              Find the ideal car rental for your trip
            </Typography>

            {/* Pick-up Location */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                Pick-up Location
              </Typography>
              <AddressSelector
                errorMsg={errorMsg}
                isSearch={true}
                useRedux={true}
                setErrorMsg={setErrorMsg}
              />
            </Box>

            {/* Rental Time Picker */}
            <Grid xs={12} md={8}>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                  Rental Time
                </Typography>
                <RentalDatePicker onRentalTimeChange={handleRentalTimeChange} />
              </Box>
            </Grid>

            {!isLoggedIn ? (
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Button
                  onClick={handleOpen}
                  id="open-register-button"
                  sx={{
                    mt: 1,
                    backgroundColor: "#04b36d",
                    color: "white",
                    fontWeight: "bold",
                    "&:hover": { backgroundColor: "#057347" },
                    position: "relative",
                    zIndex: 2,
                    p: 1.5,
                  }}
                >
                  Join Us To View Search Result
                </Button>
                {/* Modal Register */}
                <Modal open={open} onClose={handleClose}>
                  <ModalDialog
                    sx={{
                      width: "32vw",
                      maxWidth: "lg",
                      maxHeight: "100vh",
                      overflowY: "auto",
                    }}
                  >
                    <ModalClose onClick={handleClose} />
                    <Register isCarOwner={isCarOwner} setAlert={setAlert} onRegisterSucess={handleClose} />
                  </ModalDialog>
                </Modal>
              </Box>
            ) : (
              <Box>
                {/* Search Button */}
                <Box sx={{ textAlign: "center", mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{
                      padding: "10px 20px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      borderRadius: "8px",
                      bgcolor: "#05ce80",
                      "&:hover": {
                        bgcolor: "#048c5a",
                      },
                    }}
                  >
                    Search
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchCar;
