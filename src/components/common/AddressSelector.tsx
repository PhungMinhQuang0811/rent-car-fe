import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Grid, TextField, Typography, Autocomplete } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { setAddress } from "../../reducers/RentalTimeReducer";
import { RootState } from "../../redux/store";

const removeVietnameseTones = (str: string) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

interface DropdownProps {
  label: string;
  name: string;
  value?: string;
  onChange: (event: { target: { name: string; value: string } }) => void;
  options: string[];
  disabled?: boolean;
  error?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  disabled,
  error,
}) => (
  <div>
    <Autocomplete
      options={options}
      value={value || null}
      onChange={(_event, newValue) => {
        onChange({ target: { name, value: newValue || "" } });
      }}
      disableClearable
      disabled={disabled}
      filterOptions={(opts, { inputValue }) => {
        const normalizedInput = removeVietnameseTones(
          inputValue.toLowerCase().trim()
        );
        const hasTone = inputValue !== normalizedInput;

        return opts.filter((option) => {
          const normalizedOption = removeVietnameseTones(option.toLowerCase());

          if (hasTone) {
            return option.toLowerCase().includes(inputValue.toLowerCase());
          }
          return normalizedOption.includes(normalizedInput);
        });
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={!!error}
          helperText={error}
          fullWidth
          sx={{ bgcolor: "white", borderRadius: "4px" }}
        />
      )}
    />
  </div>
);

interface HouseNumberInputProps {
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: string;
}

const HouseNumberInput: React.FC<HouseNumberInputProps> = ({
  value,
  onChange,
  disabled,
  error,
}) => (
  <TextField
    fullWidth
    label="House Number & Street"
    name="houseNumberStreet"
    value={value || ""}
    onChange={onChange}
    disabled={disabled}
    required
    error={!!error}
    helperText={error}
    sx={{ bgcolor: "white" }}
  />
);

export interface AddressSelectorProps {
  formData?: any;
  setFormData?: React.Dispatch<React.SetStateAction<any>>;
  errorMsg?: any;
  setErrorMsg?: React.Dispatch<React.SetStateAction<any>>;
  handleChange?: (e: any) => void;
  isSearch?: boolean;
  useRedux?: boolean;
  onlyView?: boolean;
  disabled?: boolean;
  includeHouseNumber?: boolean;
}

export default function AddressSelector({
  formData = {},
  setFormData,
  errorMsg = {},
  setErrorMsg,
  handleChange,
  isSearch = false,
  useRedux = false,
  onlyView = false,
}: AddressSelectorProps) {
  const dispatch = useDispatch();
  const reduxAddress = useSelector((state: RootState) => state.rental.address);
  const address = useRedux ? reduxAddress : formData;

  const [addressData, setAddressData] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get(`${process.env.PUBLIC_URL}/database.json`)
      .then((res) => setAddressData(res.data.Address_list || []))
      .catch((err) => console.error("Error loading address data:", err));
  }, []);

  const cities = useMemo(
    () => [...new Set(addressData.map((item) => item.City_Province))],
    [addressData]
  );

  const districts = useMemo(
    () =>
      address.cityProvince
        ? [
            ...new Set(
              addressData
                .filter((item) => item.City_Province === address.cityProvince)
                .map((item) => item.Disctrict)
            ),
          ]
        : [],
    [address.cityProvince, addressData]
  );

  const wards = useMemo(
    () =>
      address.district
        ? addressData
            .filter((item) => item.Disctrict === address.district)
            .map((item) => item.Ward)
        : [],
    [address.district, addressData]
  );

  const validateField = (name: string, value: string) => {
    if (!value || !value.trim()) {
      if (name === "cityProvince") return "Please select a city/province";
      return "";
    }
    return "";
  };

  const handleLocalChange = (e: any) => {
    const { name, value } = e.target;

    if (useRedux) {
      let updatedAddress = { ...reduxAddress, [name]: value };

      if (name === "cityProvince") {
        updatedAddress = {
          ...updatedAddress,
          district: "",
          ward: "",
          houseNumberStreet: "",
        };
      } else if (name === "district") {
        updatedAddress = {
          ...updatedAddress,
          ward: "",
          houseNumberStreet: "",
        };
      } else if (name === "ward") {
        updatedAddress = { ...updatedAddress, houseNumberStreet: "" };
      }
      dispatch(setAddress(updatedAddress));
    } else {
      if (handleChange) handleChange(e);
      if (setFormData) {
        setFormData((prev: any) => {
          let updatedForm = { ...prev, [name]: value };

          if (name === "cityProvince") {
            updatedForm = {
              ...updatedForm,
              district: "",
              ward: "",
              houseNumberStreet: "",
            };
          } else if (name === "district") {
            updatedForm = {
              ...updatedForm,
              ward: "",
              houseNumberStreet: "",
            };
          } else if (name === "ward") {
            updatedForm = { ...updatedForm, houseNumberStreet: "" };
          }

          return updatedForm;
        });
      }
    }

    if (setErrorMsg) {
      setErrorMsg((prevErrors: any) => {
        const validKeys = [
          "cityProvince",
          "district",
          "ward",
          "houseNumberStreet",
        ];
        if (!validKeys.includes(name)) return prevErrors;

        const error = validateField(name, value);
        if (error) {
          return { ...prevErrors, [name]: error };
        } else {
          const { [name]: _, ...newErrors } = prevErrors;
          return newErrors;
        }
      });
    }
  };

  return (
    <Grid container spacing={2}>
      {!isSearch && (
        <Grid item xs={12}>
          <Typography variant="h6">Address</Typography>
        </Grid>
      )}
      <Grid item xs={12} md={6}>
        <Dropdown
          label="City/Province"
          name="cityProvince"
          value={address.cityProvince}
          onChange={handleLocalChange}
          disabled={onlyView}
          options={cities}
          error={errorMsg.cityProvince}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Dropdown
          label="District"
          name="district"
          value={address.district}
          onChange={handleLocalChange}
          options={districts}
          disabled={!address.cityProvince || onlyView}
          error={errorMsg.district}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Dropdown
          label="Ward"
          name="ward"
          value={address.ward}
          onChange={handleLocalChange}
          options={wards}
          disabled={!address.district || onlyView}
          error={errorMsg.ward}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        {!isSearch && (
          <HouseNumberInput
            value={address.houseNumberStreet}
            onChange={handleLocalChange}
            disabled={!address.ward || onlyView}
            error={errorMsg.houseNumberStreet}
          />
        )}
      </Grid>
    </Grid>
  );
}
