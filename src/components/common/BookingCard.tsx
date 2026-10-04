import React from "react";
import { Card, CardContent, Typography, Stack, useMediaQuery } from "@mui/material";
import Sliders from "../common/Sliders";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN").format(amount || 0) + "đ";

interface BookingInfoRowProps {
  label: string;
  value: any;
  id?: string;
  isCurrency?: boolean;
}

const BookingInfoRow: React.FC<BookingInfoRowProps> = ({
  label,
  value,
  id,
  isCurrency = false,
}) => (
  <Typography
    variant="body1"
    sx={{ fontSize: "0.9rem", fontWeight: isCurrency ? "bold" : "normal" }}
  >
    <strong>{label}</strong>
    <span
      style={{
        color: isCurrency ? "#05ce80" : "inherit",
        fontSize: isCurrency ? "1.1rem" : "inherit",
      }}
    >
      <strong id={id}>{value}</strong>
    </span>
  </Typography>
);

const getStatusColor = (status: string) => {
  if (status === "CONFIRMED") return "#05ce80";
  if (
    [
      "IN_PROGRESS",
      "WAITING_CONFIRMED",
      "WAITING_PAYMENT",
      "WAITING_CONFIRMED_RETURN_CAR",
    ].includes(status)
  )
    return "orange";
  if (["PENDING_DEPOSIT", "PENDING_PAYMENT"].includes(status)) return "red";
  if (status === "COMPLETED") return "blue";
  if (status === "CANCELLED") return "gray";
  return "black";
};

export interface BookingCardProps {
  BookingData: any;
}

const BookingCard: React.FC<BookingCardProps> = ({ BookingData }) => {
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  if (!BookingData) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: "center",
        maxWidth: { xs: "300px", sm: "700px", md: "1000px" },
        minHeight: { xs: "auto", md: "220px" },
        maxHeight: { xs: "none", sm: "700px", md: "280px" },
        width: "100%",
        p: { xs: 0, md: 3 },
        boxShadow: "none",
      }}
    >
      {/* Image Slider */}
      <Sliders
        images={[
          BookingData.carImageFrontUrl,
          BookingData.carImageBackUrl,
          BookingData.carImageLeftUrl,
          BookingData.carImageRightUrl,
        ]}
        isSmallScreen={isSmallScreen}
      />
      {/* Booking Information */}
      <CardContent
        sx={{
          display: "flex",
          width: { xs: "100%", sm: "40%" },
          p: 0,
          flexDirection: "column",
          justifyContent: "flex-start",
          mx: { xs: 2, md: "25px" },
          gap: 1,
          my: { xs: 1, md: 0 },
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", fontSize: { xs: "1.2rem", md: "1.5rem" } }}
          id="booking-name"
        >
          {BookingData.brand + " " + BookingData.model}
        </Typography>
        <Stack spacing={0.5}>
          <Typography
            variant="body1"
            sx={{ fontSize: "0.875rem", fontWeight: 500, color: "text.primary" }}
            id="booking-pickUpTime"
          >
            <span style={{ fontWeight: "bold", color: "gray" }}>From: </span>{" "}
            {new Date(BookingData.pickUpTime).toLocaleDateString()} -{" "}
            {new Date(BookingData.pickUpTime).getHours()}:00
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontSize: "0.875rem", fontWeight: 500, color: "text.primary" }}
            id="booking-dropOffTime"
          >
            <span style={{ fontWeight: "bold", color: "gray" }}>To: </span>{" "}
            {new Date(BookingData.dropOffTime).toLocaleDateString()} -{" "}
            {new Date(BookingData.dropOffTime).getHours()}:00
          </Typography>
        </Stack>
        <BookingInfoRow
          label="Number of days:"
          value={
            BookingData.numberOfDay ||
            (BookingData.totalPrice && BookingData.basePrice
              ? BookingData.totalPrice / BookingData.basePrice
              : 1)
          }
          id="booking-numberOfDay"
        />
        <BookingInfoRow
          label="Base Price: "
          value={formatCurrency(BookingData.basePrice) + "/day"}
          id="booking-basePrice"
          isCurrency
        />
        <BookingInfoRow
          label="Total: "
          value={formatCurrency(BookingData.totalPrice)}
          id="booking-totalPrice"
          isCurrency
        />
        <BookingInfoRow
          label="Deposit: "
          value={formatCurrency(BookingData.deposit)}
          id="booking-deposit"
          isCurrency
        />
        <BookingInfoRow
          label="Booking No.: "
          value={BookingData.bookingNumber}
          id="booking-number"
        />
        <Typography
          variant="body1"
          id="booking-status"
          sx={{
            color: getStatusColor(BookingData.status),
            fontWeight: "bold",
          }}
        >
          <span style={{ fontWeight: "bold", color: "black" }}>
            Booking Status:{" "}
          </span>{" "}
          {BookingData.status}
          {BookingData.status === "PENDING_DEPOSIT" && (
            <Typography variant="body2" color="gray">
              <em>Our operator will contact you for further instruction</em>
            </Typography>
          )}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default BookingCard;
