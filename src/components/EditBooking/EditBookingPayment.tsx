import React from "react";
import {
  Box,
  Typography,
  FormControlLabel,
  FormControl,
  RadioGroup,
  Radio,
  FormLabel,
  Link,
} from "@mui/material";
import { useAppSelector } from "../../redux/hooks";

export const EditBookingPayment: React.FC = () => {
  const { wallet = {} as any, infor = {} as any } = useAppSelector(
    (state) => state.rentCar
  );
  const { carData = {} as any } = useAppSelector((state) => state.carFetch);

  return (
    <Box>
      <Box sx={{ mx: "auto", maxWidth: "1200px", pt: 2 }}>
        <Box
          sx={{
            maxWidth: "1200px",
            margin: "auto",
            p: 3,
            mb: 3,
            border: "1px solid #ddd",
            borderRadius: 2,
            boxShadow: 1,
            bgcolor: "white",
          }}
        >
          <FormControl>
            <FormLabel>Payment method</FormLabel>
            <RadioGroup sx={{ ml: 2 }} value={infor?.data?.paymentType || ""}>
              <FormControlLabel
                value="WALLET"
                id="wallet"
                control={<Radio disabled />}
                label="My wallet"
              />
              <Typography
                sx={{
                  pl: 4,
                  color:
                    (wallet?.data?.balance ?? 0) >= (carData?.data?.deposit ?? 0)
                      ? "green"
                      : "red",
                  fontWeight: "bold",
                }}
              >
                Current balance:{" "}
                {new Intl.NumberFormat("en-US").format(
                  wallet?.data?.balance || 0
                )}{" "}
                VND
              </Typography>
              <FormControlLabel
                value="CASH"
                control={<Radio disabled />}
                label="Cash"
              />
              <Typography sx={{ pl: 4, fontSize: 14, color: "gray" }}>
                Our operator will contact you for further instruction
              </Typography>
              <FormControlLabel
                value="BANK_TRANSFER"
                control={<Radio disabled />}
                label="Bank transfer"
              />
              <Typography sx={{ pl: 4, fontSize: 14, color: "gray" }}>
                Our operator will contact you for further instruction
              </Typography>

              <Typography variant="body1" fontWeight="bold" sx={{ mb: 2 }}>
                Please make sure to have sufficient balance when you return the
                car.
              </Typography>
              <Typography variant="body1" fontWeight="bold" sx={{ mb: 2 }}>
                Go to <Link href="#/my-wallet">My wallet</Link>
              </Typography>
            </RadioGroup>
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
};
