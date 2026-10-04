import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export interface DatePickerInputProps {
  label: string;
  value: any;
  onChange: (value: any) => void;
  disabled?: boolean;
  name?: string;
}

export default function DatePickerInput({
  label,
  value,
  onChange,
  disabled,
}: DatePickerInputProps) {
  return (
    <DatePicker
      label={label}
      value={value}
      onChange={onChange}
      disabled={disabled}
      slotProps={{
        textField: {
          fullWidth: true,
          variant: "standard",
          required: true,
          sx: {
            "& .MuiOutlinedInput-notchedOutline": { border: "none" },
          },
        },
      }}
    />
  );
}
