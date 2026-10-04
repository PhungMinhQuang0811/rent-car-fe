import React from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";

export interface NotificationAlert {
  open: boolean;
  message?: string;
  severity?: AlertColor;
}

export interface NotificationSnackbarProps {
  alert: NotificationAlert;
  onClose: (event?: React.SyntheticEvent | Event, reason?: string) => void;
}

export default function NotificationSnackbar({
  alert,
  onClose,
}: NotificationSnackbarProps) {
  return (
    <Snackbar
      open={alert.open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <Alert
        severity={alert.severity || "info"}
        onClose={onClose}
        sx={{
          fontWeight: "bold",
          border: "2px solid",
          borderColor:
            alert.severity === "success"
              ? "#05ce80"
              : alert.severity === "error"
              ? "#d32f2f"
              : "#ff9800",
          boxShadow: 2,
          marginTop: { xs: 2, sm: 8 },
          width: { xs: "100%", sm: "auto" },
        }}
      >
        {alert.message || "Something went wrong!"}
      </Alert>
    </Snackbar>
  );
}
