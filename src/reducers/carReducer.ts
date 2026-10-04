import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getFileFromDB } from "../Helper/indexedDBHelper";
import { toast } from "react-toastify";
import axios from "axios";
import { RootState } from "../redux/store";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const addNewCar = createAsyncThunk(
  "cars/addNewCar",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const carData = state.cars.carData;

      const formData = new FormData();

      // list key to pick from carData
      const fileKeys = [
        "carImageFront",
        "carImageBack",
        "carImageLeft",
        "carImageRight",
        "registrationPaper",
        "insurance",
        "certificateOfInspection",
      ];

      Object.entries(carData).forEach(([key, value]) => {
        if (!fileKeys.includes(key)) {
          formData.append(key, value as any);
        }
      });

      // get file from IndexedDB and append
      for (const key of fileKeys) {
        const file = await getFileFromDB(key);
        if (file) {
          formData.append(key, file);
        }
      }

      // Gửi request
      const response = await axios.post(
        `${BASE_URL}/car/car-owner/add-car`,
        formData,
        {
          withCredentials: true,
        }
      );
      toast.success(`Add Car Successful!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          fontWeight: "bold",
          marginTop: "100px",
          border: "2px solid #05ce80",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#e6f9f2",
          color: "#0a6847",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 16px",
          fontSize: "16px",
        },
      });

      return response.data;
    } catch (error: any) {
      toast.error(`Add Car Failed! license plate already exists`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          fontWeight: "bold",
          marginTop: "100px",
          border: "2px solid #05ce80",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#e6f9f2",
          color: "#0a6847",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 16px",
          fontSize: "16px",
        },
      });

      return rejectWithValue(
        error.response?.data?.message || "Add car failed."
      );
    }
  }
);

export const fetchInforProfile = createAsyncThunk(
  "cars/fetchInforProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/user/edit-profile`, {
        withCredentials: true,
      });

      return response.data;
    } catch (error: any) {
      toast.error(`Fetch Profile Failed!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          fontWeight: "bold",
          marginTop: "100px",
          border: "2px solid #05ce80",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#e6f9f2",
          color: "#0a6847",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 16px",
          fontSize: "16px",
        },
      });

      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile."
      );
    }
  }
);

const toggleBoolean = (state: any, key: string) => {
  if (Object.prototype.hasOwnProperty.call(state, key)) {
    state[key] = !state[key];
  }
};

export interface CarDataState {
  licensePlate: string;
  brand: string;
  selectedBrand: string;
  color: string;
  model: string;
  modelList: string[];
  productionYear: number | string;
  numberOfSeats: number | string;
  automatic: boolean;
  gasoline: boolean;
  registrationPaper: string;
  certificateOfInspection: string;
  insurance: string;
  mileage: number | string;
  fuelConsumption: number | string;
  selectedCityProvince: string;
  selectedDistrict: string;
  addressCityProvince: string;
  addressDistrict: string;
  addressWard: string;
  addressHouseNumberStreet: string;
  address: string;
  description: string;
  additionalFunctions: Record<string, boolean>;
  additionalFunction: string;
  carImageFront: string;
  carImageBack: string;
  carImageLeft: string;
  carImageRight: string;
  basePrice: number | string;
  deposit: number | string;
  termsOfUses: Record<string, boolean>;
  termsOfOther: boolean;
  termOfUse: string;
  specify: string;
  [key: string]: any;
}

export interface CarsSliceState {
  cars: any[];
  status: "idle" | "loading" | "failed" | "readyToSubmit";
  step: number;
  carData: CarDataState;
  errors: Record<string, string>;
  automatic?: boolean;
}

const initialState: CarsSliceState = {
  cars: [],
  status: "idle",
  step: 1,
  carData: {
    licensePlate: "",
    brand: "",
    selectedBrand: "",
    color: "",
    model: "",
    modelList: [],
    productionYear: "",
    numberOfSeats: "",
    automatic: true,
    gasoline: true,
    registrationPaper: "",
    certificateOfInspection: "",
    insurance: "",

    mileage: "",
    fuelConsumption: "",
    selectedCityProvince: "",
    selectedDistrict: "",

    addressCityProvince: "",
    addressDistrict: "",
    addressWard: "",
    addressHouseNumberStreet: "",

    address: "",

    description: "",
    additionalFunctions: {
      Bluetooth: false,
      GPS: false,
      Camera: false,
      SunRoof: false,
      ChildLock: false,
      ChildSeat: false,
      DVD: false,
      USB: false,
    },
    additionalFunction: "",

    carImageFront: "",
    carImageBack: "",
    carImageLeft: "",
    carImageRight: "",

    basePrice: "",
    deposit: "",
    termsOfUses: {
      noSmoking: false,
      noPet: false,
      noFoodInCar: false,
    },
    termsOfOther: false,
    termOfUse: "",
    specify: "",
  },
  errors: {},
};

export const carsSlice = createSlice({
  name: "cars",
  initialState,
  reducers: {
    setCarData: (state, action: PayloadAction<Partial<CarDataState>>) => {
      state.carData = {
        ...state.carData,
        ...action.payload,
      };
    },

    setErrors: (state, action: PayloadAction<Record<string, string>>) => {
      state.errors = {
        ...state.errors,
        ...action.payload,
      };
    },

    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload;
    },

    resetCarForm: (state) => {
      state.errors = {};
      state.carData = initialState.carData;
    },

    handleNext: (state) => {
      let newErrors: Record<string, string> = {};
      const regex = /^\d{2}[A-Z]-\d{3}\.\d{2}$/;

      if (state.step === 1) {
        if (
          !state.carData.licensePlate?.trim() ||
          !regex.test(state.carData.licensePlate)
        ) {
          newErrors.licensePlate = "Invalid format! Example: 49F-123.56";
        }
        if (!state.carData.color) {
          newErrors.color = "Color is required.";
        }
        if (!state.carData.brand) {
          newErrors.brand = "Brand name is required.";
        }
        if (!state.carData.model) {
          newErrors.model = "Model is required.";
        }
        if (
          !state.carData.productionYear ||
          Number(state.carData.productionYear) > 2030 ||
          Number(state.carData.productionYear) < 1990
        ) {
          newErrors.productionYear =
            "Please enter production year from 1990 to 2030";
        }
        if (
          !state.carData.numberOfSeats ||
          (Number(state.carData.numberOfSeats) !== 4 &&
            Number(state.carData.numberOfSeats) !== 5 &&
            Number(state.carData.numberOfSeats) !== 7)
        ) {
          newErrors.numberOfSeats = "Please enter 4, 5, or 7 seats.";
        }

        // Kiểm tra file (chỉ lưu tên file trong Redux)
        if (!state.carData.registrationPaper?.trim()) {
          newErrors.registrationPaper = "Registration paper is required.";
        }
        if (!state.carData.certificateOfInspection?.trim()) {
          newErrors.certificateOfInspection =
            "Certificate of inspection is required.";
        }
        if (!state.carData.insurance?.trim()) {
          newErrors.insurance = "Insurance is required.";
        }
      }

      if (state.step === 2) {
        if (!state.carData.mileage) {
          newErrors.mileage = "Mileage is required.";
        }
        if (!state.carData.fuelConsumption) {
          newErrors.fuelConsumption = "Fuel consumption is required.";
        }
        if (!state.carData.addressCityProvince) {
          newErrors.addressCityProvince = "Address city province is required.";
        }
        if (!state.carData.addressDistrict) {
          newErrors.addressDistrict = "Address district is required.";
        }
        if (!state.carData.addressWard) {
          newErrors.addressWard = "Address ward is required.";
        }
        if (!state.carData.addressHouseNumberStreet) {
          newErrors.addressHouseNumberStreet =
            "Address house number street is required.";
        }
        if (!state.carData.description) {
          newErrors.description = "Description is required.";
        }

        // Kiểm tra file
        if (!state.carData.carImageFront?.trim()) {
          newErrors.carImageFront = "Image front is required.";
        }
        if (!state.carData.carImageBack?.trim()) {
          newErrors.carImageBack = "Image back is required.";
        }
        if (!state.carData.carImageLeft?.trim()) {
          newErrors.carImageLeft = "Image left is required.";
        }
        if (!state.carData.carImageRight?.trim()) {
          newErrors.carImageRight = "Image right is required.";
        }
      }

      if (state.step === 3) {
        if (!state.carData.basePrice) {
          newErrors.basePrice = "Base price is required.";
        }
        if (!state.carData.deposit) {
          newErrors.deposit = "Deposit is required.";
        }
        if (state.carData.termsOfOther && !state.carData.specify) {
          newErrors.specify = "Specify is required.";
        }
      }

      state.errors = newErrors;

      if (Object.keys(newErrors).length > 0) {
        toast.error(`Please fulfill all the fields!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          style: {
            fontWeight: "bold",
            border: "2px solid #05ce80",
            borderRadius: "8px",
            marginTop: "100px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#e6f9f2",
            color: "#0a6847",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 16px",
            fontSize: "16px",
          },
        });
        return;
      }

      if (state.step < 4) {
        state.step += 1;
        if (state.step === 2) {
          toast.success(`Next Step! Basic was filled!`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            style: {
              fontWeight: "bold",
              border: "2px solid #05ce80",
              borderRadius: "8px",
              marginTop: "100px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#e6f9f2",
              color: "#0a6847",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 16px",
              fontSize: "16px",
            },
          });
        }
        if (state.step === 3) {
          toast.success(`Next Step! Details was filled!`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            style: {
              fontWeight: "bold",
              border: "2px solid #05ce80",
              borderRadius: "8px",
              marginTop: "100px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#e6f9f2",
              color: "#0a6847",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 16px",
              fontSize: "16px",
            },
          });
        }
        if (state.step === 4) {
          toast.success(`Next Step! Pricing was filled!`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            style: {
              fontWeight: "bold",
              border: "2px solid #05ce80",
              borderRadius: "8px",
              marginTop: "100px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#e6f9f2",
              color: "#0a6847",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 16px",
              fontSize: "16px",
            },
          });
        }
      } else {
        state.status = "readyToSubmit";
      }
    },

    toggleFunction: (state, action: PayloadAction<string>) => {
      state.carData.additionalFunctions = {
        ...state.carData.additionalFunctions,
        [action.payload]: !state.carData.additionalFunctions[action.payload],
      };
    },

    toggleUse: (state, action: PayloadAction<string>) => {
      state.carData.termsOfUses = {
        ...state.carData.termsOfUses,
        [action.payload]: !state.carData.termsOfUses[action.payload],
      };
    },

    toggleTransmission: (state) => {
      state.automatic = !state.automatic;
    },

    toggleProperty: (state, action: PayloadAction<string>) => {
      toggleBoolean(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addNewCar.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(addNewCar.fulfilled, (state, action) => {
      state.status = "idle";
      state.cars.push(action.payload);
    });
    builder.addCase(addNewCar.rejected, (state, action) => {
      state.status = "failed";
      state.errors = { general: action.error.message || "Add car failed" };
    });

    builder.addCase(fetchInforProfile.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchInforProfile.fulfilled, (state, action) => {
      state.status = "idle";
      state.carData = action.payload;
    });
    builder.addCase(fetchInforProfile.rejected, (state, action) => {
      state.status = "failed";
      state.errors = { general: action.error.message || "Failed to fetch profile" };
    });
  },
});

export const {
  setCarData,
  setErrors,
  setStep,
  handleNext,
  resetCarForm,
  toggleFunction,
  toggleProperty,
  toggleUse,
} = carsSlice.actions;

export default carsSlice.reducer;
