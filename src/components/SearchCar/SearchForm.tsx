import React, { useEffect } from "react";
import AddressSelector from "../common/AddressSelector";
import RentalDatePicker from "../common/RentalDateTimePicker";
import { Button, Box, Typography } from "@mui/material";
import { Grid } from "@mui/joy";
import bannerimg from "../../assets/search-img.jpg";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setAddress, setRentalTime } from "../../reducers/RentalTimeReducer";
import { useNavigate, useSearchParams } from "react-router-dom";

export interface SearchFormProps {
  searchParams?: any;
  handleRentalTimeChange?: (pickUp: string, dropOff: string) => void;
  errorMsg?: any;
  setErrorMsg?: React.Dispatch<React.SetStateAction<any>>;
}

const SearchForm: React.FC<SearchFormProps> = ({
  handleRentalTimeChange,
  errorMsg,
  setErrorMsg,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const addressStr = params.get("address") || "";
    if (addressStr) {
      const addressParts = addressStr.split(", ").map((part) => part.trim());
      const addressObj = {
        cityProvince: addressParts[0] || "",
        district: addressParts[1] || "",
        ward: addressParts[2] || "",
      };
      dispatch(setAddress(addressObj));
    }
  }, [params, dispatch]);

  const address = useAppSelector((state) => state.rental.address);
  const pickUpTime = useAppSelector((state) => state.rental.pickUpTime);
  const dropOffTime = useAppSelector((state) => state.rental.dropOffTime);

  const handleSearch = () => {
    if (!address.cityProvince) {
      alert("Please select a valid address.");
      return;
    }
    dispatch(setAddress(address));
    dispatch(setRentalTime({ pickUpTime, dropOffTime }));
    const addresses = Object.values(address).filter(Boolean).join(", ");
    navigate(
      `/search-result?address=${addresses}&pickUpTime=${pickUpTime}&dropOffTime=${dropOffTime}`
    );
  };

  return (
    <Box
      sx={{
        maxWidth: "1200px",
        mx: "auto",
        mt: 2,
        minHeight: { xs: "auto", md: "400px" },
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
      <Grid xs={12} md={6} sx={{ maxWidth: "1200px", mx: "auto", mt: 4 }}>
        <Box
          sx={{
            padding: 3,
            position: "relative",
            zIndex: 2,
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            color: "white",
          }}
        >
          <Typography variant="h4" fontWeight="bold" sx={{ textAlign: "center" }}>
            Search Form
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mt: 2, alignItems: "start" }}>
            <Box sx={{ flex: 0.7 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                Pick-up Location
              </Typography>
              <AddressSelector
                errorMsg={errorMsg}
                isSearch={true}
                useRedux={true}
                setErrorMsg={setErrorMsg}
              />
            </Box>

            <Box sx={{ flex: 0.3 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                Rental Time
              </Typography>
              <RentalDatePicker onRentalTimeChange={handleRentalTimeChange} />
            </Box>
          </Box>

          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Button
              variant="contained"
              onClick={handleSearch}
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
      </Grid>
    </Box>
  );
};

export default SearchForm;
