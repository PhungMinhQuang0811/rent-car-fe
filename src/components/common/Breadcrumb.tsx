import React from "react";
import { Breadcrumbs, Link, Typography } from "@mui/material";

export interface BreadcrumbItem {
  name: string;
  link?: string;
}

export interface BreadcrumbProps {
  listData?: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ listData = [] }) => {
  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ my: 2 }}>
      {listData.map((item, index) =>
        index !== listData.length - 1 ? (
          <Link key={index} color="inherit" href={item.link} underline="hover">
            {item.name}
          </Link>
        ) : (
          <Typography key={index} color="text.primary">
            {item.name}
          </Typography>
        )
      )}
    </Breadcrumbs>
  );
};

export default Breadcrumb;
