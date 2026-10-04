import React from "react";
import {
  useMediaQuery,
  Card,
  CardContent,
  Typography,
  Box,
  MenuItem,
  Select,
} from "@mui/material";
import { Star, StarBorder, StarHalf } from "@mui/icons-material";
import Sliders from "../common/Sliders";
import LoadingComponent from "./LoadingComponent";

export interface CarCardProps {
  carData: any;
  large?: boolean;
  isEditPage?: boolean;
  onStatusChange?: (newStatus: string) => void;
}

const CarCard: React.FC<CarCardProps> = ({
  carData,
  large,
  isEditPage,
  onStatusChange,
}) => {
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  if (!carData) return <LoadingComponent />;

  const formattedPrice =
    new Intl.NumberFormat("vi-VN").format(carData.basePrice) + "đ/day";
  const ratingStars = Array.from({ length: 5 }).map((_, i) => {
    const roundedAvg = Math.ceil((carData.averageRatingByCar || 0) * 2) / 2;
    return i < Math.floor(roundedAvg) ? (
      <Star key={i} color="warning" fontSize="small" />
    ) : i === Math.floor(roundedAvg) && roundedAvg % 1 !== 0 ? (
      <StarHalf key={i} color="warning" fontSize="small" />
    ) : (
      <StarBorder key={i} fontSize="small" color="warning" />
    );
  });

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: "center",
        maxWidth: { xs: 300, sm: 700, md: 1000 },
        minHeight: { md: 220 },
        maxHeight: { md: 280 },
        width: "100%",
        p: { xs: 0, md: large ? 2 : 3 },
        boxShadow: "none",
      }}
    >
      <Sliders
        images={[
          carData.carImageFront,
          carData.carImageBack,
          carData.carImageLeft,
          carData.carImageRight,
        ]}
        isSmallScreen={isSmallScreen}
      />
      <CardContent
        sx={{
          display: "flex",
          width: { xs: "100%", sm: "40%" },
          p: 0,
          flexDirection: "column",
          justifyContent: "flex-start",
          mx: { xs: 2, md: "25px" },
          gap: isSmallScreen ? 0 : 1,
          my: { xs: 1, md: 0 },
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            fontSize: { xs: "1.2rem", md: large ? "1.6rem" : "1.5rem" },
          }}
        >
          {carData.brand + " " + carData.model}
        </Typography>
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            alignItems: "center",
            my: 1,
          }}
        >
          {ratingStars}
        </Box>
        <Typography variant="body1">
          No. of rides: <strong>{carData.noOfRides || 0}</strong>
        </Typography>
        <Typography variant="body1">
          Price:{" "}
          <span
            style={{
              color: "#05ce80",
              fontSize: "1.1rem",
              fontWeight: "bold",
            }}
          >
            <strong>{formattedPrice}</strong>
          </span>
        </Typography>
        <Typography variant="body1">
          Location: <strong>{carData.address}</strong>
        </Typography>
        {isEditPage ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              width: "100%",
            }}
          >
            <Typography variant="body1">Status:</Typography>
            <Select
              value={carData.status}
              onChange={(e) => onStatusChange && onStatusChange(e.target.value)}
              sx={{ fontSize: "1rem", fontWeight: "bold", width: "50%" }}
              id="statusChangeDropdown"
            >
              <MenuItem value="NOT_VERIFIED" disabled>
                NOT VERIFIED
              </MenuItem>
              <MenuItem
                value="VERIFIED"
                disabled={carData.status !== "NOT_VERIFIED"}
              >
                VERIFIED
              </MenuItem>
              <MenuItem value="STOPPED" disabled>
                STOPPED
              </MenuItem>
            </Select>
          </Box>
        ) : (
          <Typography
            variant="body1"
            sx={{
              color: carData.status === "STOPPED" ? "red" : "green",
              fontWeight: "bold",
            }}
          >
            Status: {carData.status}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default CarCard;
