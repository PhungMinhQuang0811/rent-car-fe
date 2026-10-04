import React from "react";
import CarOwnerBanner from "../components/common/CarOwnerBanner";
import { Box } from "@mui/material";
import BenefitsSection from "../components/common/BenefitSection";

const HomePageCarOwner: React.FC = () => {
  return (
    <Box
      sx={{
        maxWidth: "1200px",
        mx: "auto",
        mt: 4,
      }}
    >
      <CarOwnerBanner />
      <BenefitsSection />
    </Box>
  );
};

export default HomePageCarOwner;
