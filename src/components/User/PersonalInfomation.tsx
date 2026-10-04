import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Typography,
  Grid,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import PersonalDetails from "./PersonalDetail";
import AddressSelector from "../common/AddressSelector";
import NotificationSnackbar from "../common/NotificationSnackbar";
import ConfirmationDialog from "../common/ConfirmationDialog";
import { updateUserProfile } from "../../services/UserServices";

export interface PersonalInformationProps {
  initialData?: any;
  onlyView?: boolean;
}

export default function PersonalInformation({ initialData = {}, onlyView = false }: PersonalInformationProps) {
  const [formData, setFormData] = useState({
    fullName: initialData.fullName || "",
    phoneNumber: initialData.phoneNumber || "",
    email: initialData.email || "",
    nationalId: initialData.nationalId || "",
    dob: initialData.dob ? dayjs(initialData.dob) : null,
    cityProvince: initialData.cityProvince || "",
    district: initialData.district || "",
    ward: initialData.ward || "",
    houseNumberStreet: initialData.houseNumberStreet || "",
    drivingLicenseFile: initialData.drivingLicenseUrl || initialData.drivingLicenseFile || null,
    drivingLicensePreview: initialData.drivingLicenseUrl || initialData.drivingLicenseFile || null,
  });
  const [errorMsg, setErrorMsg] = useState<Record<string, string>>({});
  const [openConfirm, setOpenConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [alert, setAlert] = useState<{ open: boolean; message: string; severity: "success" | "error" | "info" | "warning" }>({
    open: false,
    message: "",
    severity: "success",
  });
  const [isValid, setIsValid] = useState(true);
  const maxDate = dayjs().subtract(18, "year");

  useEffect(() => {
    setIsValid(Object.keys(errorMsg).length === 0);
  }, [errorMsg]);

  const validateField = (name: string, value: any) => {
    let error = "";
    if (typeof value !== "string") {
      value = value ? String(value) : "";
    }
    if (!value.trim()) error = "This field is required";

    if (name === "phoneNumber" && !/^0\d{9}$/.test(value)) error = "Phone must be 10 digits and start with '0'";
    if (name === "dob" && value && dayjs(value).isAfter(dayjs())) error = "Date of Birth cannot be in the future";
    if (name === "fullName" && (!/^[\p{L}\s]+$/u.test(value) || value.trim() === "")) error = "Full Name must contain only letters";
    if (name === "nationalId" && (!/^\d{12}$/.test(value))) {
      error = "National ID must be exactly 12 digits";
    }
    if (name === "cityProvince" && !value) error = "Please select a city/province";
    if (name === "district" && !value) error = "Please select a district";
    if (name === "ward" && !value) error = "Please select a ward";
    if (name === "houseNumberStreet" && !value) error = "Please enter your house number";

    setErrorMsg((prev) => {
      const updatedErrors = { ...prev };
      if (error) {
        updatedErrors[name] = error;
      } else {
        delete updatedErrors[name];
      }
      return updatedErrors;
    });
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    Object.keys(formData).forEach((key) => {
      validateField(key, (formData as any)[key]);
    });

    if (!formData.cityProvince) errors.cityProvince = "Please select a city/province";
    if (!formData.district) errors.district = "Please select a district";
    if (!formData.ward) errors.ward = "Please select a ward";
    if (!formData.houseNumberStreet) errors.houseNumberStreet = "Please enter your house number";

    setErrorMsg(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleDateChange = (date: Dayjs | null) => {
    const newDate = date ? dayjs(date) : null;
    let error = "";

    if (!date) {
      error = "Date of Birth is required";
    } else if (newDate && newDate.isAfter(maxDate)) {
      error = "You must be at least 18 years old";
    }

    setFormData((prev) => ({ ...prev, dob: newDate }));
    setErrorMsg((prev) => {
      const updatedErrors = { ...prev };
      if (error) {
        updatedErrors.dob = error;
      } else {
        delete updatedErrors.dob;
      }
      return updatedErrors;
    });
  };

  const handleFileChange = (file: File | null) => {
    if (file && file.size > 5 * 1024 * 1024) {
      setAlert({ open: true, message: "Can't upload file, file size must be under 5MB", severity: "error" });
      return;
    }
    setFormData({
      ...formData,
      drivingLicenseFile: file,
      drivingLicensePreview: file ? URL.createObjectURL(file) : null,
    });
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setOpenConfirm(true);
    setConfirmAction(() => async () => {
      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("phoneNumber", formData.phoneNumber);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("nationalId", formData.nationalId);
      formDataToSend.append("cityProvince", formData.cityProvince);
      formDataToSend.append("district", formData.district);
      formDataToSend.append("ward", formData.ward);
      formDataToSend.append("houseNumberStreet", formData.houseNumberStreet);
      if (formData.dob) {
        formDataToSend.append("dob", (formData.dob as Dayjs).format("YYYY-MM-DD"));
      }

      if (formData.drivingLicenseFile) {
        if (formData.drivingLicenseFile instanceof File) {
          formDataToSend.append("drivingLicense", formData.drivingLicenseFile);
        } else {
          formDataToSend.append("drivingLicenseUrl", formData.drivingLicenseFile);
        }
      } else if (formData.drivingLicensePreview) {
        formDataToSend.append("drivingLicenseUrl", formData.drivingLicensePreview);
      }

      try {
        await updateUserProfile(formDataToSend);
        setAlert({ open: true, message: "Profile Updated Successfully!", severity: "success" });
      } catch (error: any) {
        setAlert({ open: true, message: error.response?.data?.message || "Profile Updated Failed!", severity: "error" });
      }
      setOpenConfirm(false);
    });
  };

  const handleDiscard = () => {
    setOpenConfirm(true);
    setConfirmAction(() => () => {
      setAlert({ open: true, message: "Discard Change Successfully!", severity: "success" });
      setErrorMsg({});
      setFormData({
        ...initialData,
        dob: initialData.dob ? dayjs(initialData.dob) : null,
        drivingLicenseFile: initialData.drivingLicenseUrl || null,
        drivingLicensePreview: initialData.drivingLicenseUrl || null,
      });
      setOpenConfirm(false);
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          {onlyView ? "Driver's Information" : "Personal Information"}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <PersonalDetails
              formData={formData}
              handleChange={handleChange}
              handleDateChange={handleDateChange}
              handleFileChange={handleFileChange}
              errorMsg={errorMsg}
              onlyView={onlyView}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ marginTop: { xs: "250px", md: "0px" } }}>
            <AddressSelector
              formData={formData}
              setFormData={setFormData}
              errorMsg={errorMsg}
              handleChange={handleChange}
              disabled={onlyView}
              includeHouseNumber={true}
            />
          </Grid>
        </Grid>
        {!onlyView && (
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button variant="outlined" onClick={handleDiscard}>
              Discard
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#05ce80", color: "white", "&:hover": { backgroundColor: "#04b16d" } }}
              disabled={!isValid}
              onClick={handleSubmit}
            >
              Save
            </Button>
          </Box>
        )}
      </Box>
      <ConfirmationDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={confirmAction || (() => {})}
        title="Confirm Action"
        content="Are you sure?"
      />
      <NotificationSnackbar alert={alert} onClose={() => setAlert({ ...alert, open: false })} />
    </LocalizationProvider>
  );
}
