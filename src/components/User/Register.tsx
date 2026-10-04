import * as Mui from "@mui/material";
import * as Icons from "@mui/icons-material";
import React, { useState } from "react";
import normalForm from "../../styles/FormStyles";
import Checkbox from "@mui/material/Checkbox";
import { checkUniqueEmail, registerUser } from "../../services/UserServices";

export interface RegisterProps {
  isCarOwner?: boolean;
  onRegisterSucess: () => void;
  setAlert: (alert: { open: boolean; message: string; severity: "success" | "error" | "info" | "warning" }) => void;
}

const Register: React.FC<RegisterProps> = ({ isCarOwner = false, onRegisterSucess, setAlert }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    isCustomer: isCarOwner ? "false" : "true",
    terms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateInputs = (name: string, value: any) => {
    let errMsg = "";
    if (!value) {
      errMsg = "This field is required";
    } else {
      switch (name) {
        case "fullName":
          break;
        case "email":
          errMsg = !/\S+@\S+\.\S+/.test(value) ? "Invalid email format" : "";
          break;
        case "phoneNumber":
          errMsg = !/^0\d{9}$/.test(value) ? "Phone must be 10 digits" : "";
          break;
        case "password":
          errMsg = !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{9,}$/.test(value)
            ? "Invalid password format"
            : "";
          break;
        case "confirmPassword":
          errMsg =
            value !== formData.password
              ? "Password and Confirm password don’t match. Please try again."
              : "";
          break;
        default:
          break;
      }
    }
    setErrors((prevs) => ({
      ...prevs,
      [name]: errMsg,
    }));
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (name === "email") {
      let errMsg = "";

      if (!/\S+@\S+\.\S+/.test(value)) {
        errMsg = "Invalid email format";
      } else {
        try {
          const response = await checkUniqueEmail({ email: value });
          if (response?.code === 2003) {
            errMsg = response.message;
          }
        } catch (error) {
          console.error("Email check failed", error);
        }
      }

      setErrors((prevErrors) => ({
        ...prevErrors,
        email: errMsg,
      }));
      return;
    }

    validateInputs(name, newValue);
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseUp = (event: React.MouseEvent) => {
    event.preventDefault();
  };
  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasEmptyField = Object.keys(formData).some((key) => {
      if (!(formData as any)[key]) {
        setErrors((prevs) => ({
          ...prevs,
          [key]: "This field is required",
        }));
        setAlert({ open: true, message: "All fields are required.", severity: "error" });
        return true;
      }
      return false;
    });

    if (hasEmptyField) return;

    if (formData.password !== formData.confirmPassword) {
      setAlert({ open: true, message: "Password not match", severity: "error" });
      return;
    }

    try {
      const response = await registerUser(formData as any);
      setAlert({ open: true, message: response.message, severity: "success" });
      onRegisterSucess();
    } catch (error: any) {
      setAlert({ open: true, message: `${error.message || "Registration failed"}`, severity: "error" });
    }
  };

  return (
    <>
      <Mui.Box component="form" sx={normalForm}>
        <Mui.Typography
          variant="h5"
          textAlign={"center"}
          sx={{ color: "#05ce80" }}
        >
          NOT A MEMBER YET?
        </Mui.Typography>
        <Mui.Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "start",
          }}
        >
          <Mui.TextField
            id="register-fullName"
            name="fullName"
            variant="standard"
            label="Your name"
            error={!!errors.fullName}
            helperText={errors.fullName}
            value={formData.fullName}
            onChange={handleChange}
            fullWidth
            required
          />
          <Mui.TextField
            id="register-email"
            name="email"
            variant="standard"
            label="Your email address"
            error={!!errors.email}
            helperText={errors.email}
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
          />
          <Mui.TextField
            id="register-phoneNumber"
            name="phoneNumber"
            variant="standard"
            label="Your phone number"
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber}
            value={formData.phoneNumber}
            onChange={handleChange}
            fullWidth
            required
          />
          <Mui.TextField
            id="register-password"
            name="password"
            variant="standard"
            label="Pick a password"
            error={!!errors.password}
            helperText={errors.password}
            value={formData.password}
            onChange={handleChange}
            type={showPassword ? "text" : "password"}
            fullWidth
            required
            InputProps={{
              endAdornment: (
                <Mui.InputAdornment position="end">
                  <Mui.IconButton
                    onClick={handleClickShowPassword}
                    onMouseUp={handleMouseUp}
                    onMouseDown={handleMouseDown}
                  >
                    {showPassword ? (
                      <Icons.VisibilityOff />
                    ) : (
                      <Icons.Visibility />
                    )}
                  </Mui.IconButton>
                </Mui.InputAdornment>
              ),
            }}
          />
          <Mui.FormHelperText id="outlined-weight-helper-text">
            Use at least one letter, one number, and seven characters
          </Mui.FormHelperText>
          <Mui.TextField
            id="register-confirmPassword"
            name="confirmPassword"
            variant="standard"
            label="Confirm password"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            value={formData.confirmPassword}
            onChange={handleChange}
            fullWidth
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <Mui.InputAdornment position="end">
                  <Mui.IconButton
                    onClick={handleClickShowPassword}
                    onMouseUp={handleMouseUp}
                    onMouseDown={handleMouseDown}
                  >
                    {showPassword ? (
                      <Icons.VisibilityOff />
                    ) : (
                      <Icons.Visibility />
                    )}
                  </Mui.IconButton>
                </Mui.InputAdornment>
              ),
            }}
          />
          <Mui.FormControl component="fieldset" error={!!errors.isCustomer}>
            <Mui.RadioGroup
              id="register-isCustomer"
              row
              name="isCustomer"
              value={formData.isCustomer}
              sx={{ display: "flex", justifyContent: "stretch" }}
              onChange={handleChange}
            >
              <Mui.FormControlLabel
                id="register-isCustomer-true"
                value="true"
                label="I want to rent a car"
                control={<Mui.Radio />}
              />
              <Mui.FormControlLabel
                id="register-isCustomer-false"
                value="false"
                label="I am a car owner"
                control={<Mui.Radio />}
                sx={{ ml: 5 }}
              />
            </Mui.RadioGroup>
            {errors.isCustomer && (
              <Mui.FormHelperText>{errors.isCustomer}</Mui.FormHelperText>
            )}
          </Mui.FormControl>

          <Mui.FormControl component="fieldset" error={!!errors.terms}>
            <Mui.FormControlLabel
              id="register-terms"
              control={<Checkbox />}
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
              label={
                <>
                  I have read and agree with the{" "}
                  <Mui.Link href="#">Terms and Conditions</Mui.Link>
                </>
              }
            />
            {errors.terms && (
              <Mui.FormHelperText>{errors.terms}</Mui.FormHelperText>
            )}
          </Mui.FormControl>

          <Mui.Box
            sx={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <Mui.Button
              id="register-submit"
              onClick={handleSubmit}
              variant="outlined"
              sx={{
                width: "150px",
                borderRadius: 2,
                borderColor: "black",
                color: "black",
                fontWeight: 500,
                textTransform: "none",
                transition: "all 0.3s",
                "&:hover": {
                  borderColor: "#05ce80",
                  color: "#05ce80",
                },
              }}
            >
              REGISTER
            </Mui.Button>
          </Mui.Box>
        </Mui.Box>
      </Mui.Box>
    </>
  );
};

export default Register;
