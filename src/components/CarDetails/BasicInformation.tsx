import React, { useMemo } from "react";
import { Grid } from "@mui/joy";
import { Box, Typography, Stack, Divider } from "@mui/material";
import Documents from "../common/Document";

interface InfoItemProps {
  icon: string;
  title: string;
  value?: string | number | null;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, title, value = "-" }) => (
  <Grid xs={6} sm={3} md={3} lg={3}>
    <Stack
      direction={{ xs: "column", md: "row" }}
      alignItems="center"
      justifyContent="center"
      spacing={2}
    >
      <img
        src={icon}
        alt={title || "Icon"}
        style={{ width: "40px", height: "40px" }}
      />
      <Stack
        direction="column"
        alignItems="center"
        sx={{ minWidth: { xs: "80px", md: "150px" } }}
      >
        <Typography variant="body2" color="text.secondary" fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="body1" fontWeight="bold">
          {value || "-"}
        </Typography>
      </Stack>
    </Stack>
  </Grid>
);

export interface BasicInformationProps {
  CarData: {
    licensePlate?: string;
    color?: string;
    brand?: string;
    model?: string;
    productionYear?: string | number;
    numberOfSeats?: number | string;
    automatic?: boolean | null;
    gasoline?: boolean | null;
    [key: string]: any;
  };
}

export const BasicInformation: React.FC<BasicInformationProps> = ({ CarData }) => {
  const infoItems = useMemo(
    () => [
      {
        title: "License Plate",
        icon: "https://img.icons8.com/?size=100&id=32294&format=png&color=40C057",
        value: CarData.licensePlate,
      },
      {
        title: "Color",
        icon: "https://img.icons8.com/?size=100&id=25945&format=png&color=40C057",
        value: CarData.color,
      },
      {
        title: "Brand Name",
        icon: "https://img.icons8.com/?size=100&id=EfPWEq9XYdxP&format=png&color=40C057",
        value: CarData.brand,
      },
      {
        title: "Model",
        icon: "https://img.icons8.com/?size=100&id=32722&format=png&color=40C057",
        value: CarData.model,
      },
      {
        title: "Production Year",
        icon: "https://img.icons8.com/?size=100&id=Ck0t2l1fp3Wa&format=png&color=40C057",
        value: CarData.productionYear,
      },
      {
        title: "No. of Seats",
        icon: "https://img.icons8.com/?size=100&id=yuvJ0WW58Rci&format=png&color=40C057",
        value: CarData.numberOfSeats?.toString() || "0",
      },
      {
        title: "Transmission",
        icon: "https://img.icons8.com/?size=100&id=N09LiGodnV7F&format=png&color=40C057",
        value:
          CarData.automatic != null
            ? CarData.automatic
              ? "Automatic"
              : "Manual"
            : "-",
      },
      {
        title: "Fuel",
        icon: "https://img.icons8.com/?size=100&id=24723&format=png&color=40C057",
        value:
          CarData.gasoline != null
            ? CarData.gasoline
              ? "Gasoline"
              : "Diesel"
            : "-",
      },
    ],
    [CarData]
  );

  return (
    <Box>
      <Grid container spacing={{ xs: 2, md: 4 }} sx={{ p: { xs: 2, md: 4 } }}>
        {infoItems.map((item) => (
          <InfoItem key={item.title} {...item} />
        ))}
      </Grid>

      <Divider sx={{ p: 2 }} />

      <Grid container sx={{ p: { xs: 2, md: 4 } }}>
        <Grid xs={12}>
          <Stack direction="column" alignItems="flex-start">
            <Typography variant="h6" color="text.secondary" fontWeight="bold">
              Vehicle Registration Documents
            </Typography>
            <Documents CarData={CarData} />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BasicInformation;
