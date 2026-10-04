import React from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";

const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
  event.preventDefault();
  console.info("You clicked a breadcrumb.");
};

const NavigateBreadcrumb: React.FC = () => {
  return (
    <div role="presentation" onClick={handleClick}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Link
          underline="hover"
          color="inherit"
          href="/material-ui/getting-started/installation/"
        >
          My Booking
        </Link>
        <Typography sx={{ color: "text.primary" }}>Booking details</Typography>
      </Breadcrumbs>
    </div>
  );
};

export default NavigateBreadcrumb;
