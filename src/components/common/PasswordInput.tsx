import React from "react";
import { TextField, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export interface PasswordInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  showPassword?: boolean;
  onTogglePassword: (name: string) => void;
  error?: boolean;
  helperText?: React.ReactNode;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  showPassword,
  onTogglePassword,
  error,
  helperText,
}) => (
  <TextField
    fullWidth
    label={label}
    name={name}
    onBlur={onBlur}
    variant="standard"
    type={showPassword ? "text" : "password"}
    value={value}
    onChange={onChange}
    required
    error={error}
    helperText={helperText}
    InputProps={{
      endAdornment: (
        <IconButton onClick={() => onTogglePassword(name)}>
          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
        </IconButton>
      ),
    }}
  />
);

export default PasswordInput;
