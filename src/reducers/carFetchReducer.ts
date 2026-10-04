import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "axios";
import { getFileFromDB, getAllKeysFromDB } from "../Helper/indexedDBHelper";
import { RootState } from "../redux/store";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const fetchCarById = createAsyncThunk(
  "cars/fetchCarById",
  async (carId: string | number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/car/car-owner/${carId}`, {
        withCredentials: true,
      });

      if (!response.data) {
        return rejectWithValue("No data received.");
      }

      return response.data;
    } catch (error: any) {
      toast.error(`Fetch Car Failed!`, {
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
        error.response?.data || error.message || "Network error"
      );
    }
  }
);

export const updateCar = createAsyncThunk(
  "cars/updateCar",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const carData = (state.carFetch as any).carData.data;

      const formData = new FormData();

      Object.entries(carData).forEach(([key, value]) => {
        if (
          ![
            "carImageFront",
            "carImageBack",
            "carImageLeft",
            "carImageRight",
            "registrationPaper",
            "insurance",
            "certificateOfInspection",
          ].includes(key)
        ) {
          formData.append(key, value as any);
        }
      });

      const existingKeys = await getAllKeysFromDB();

      const imageKeys = [
        "carImageFront",
        "carImageBack",
        "carImageLeft",
        "carImageRight",
        "registrationPaper",
        "insurance",
        "certificateOfInspection",
      ];

      for (const key of imageKeys) {
        if (existingKeys.includes(key)) {
          const file = await getFileFromDB(key);
          if (file) {
            formData.append(key, file);
          }
        }
      }

      const response = await axios.put(
        `${BASE_URL}/car/car-owner/edit-car/${carData.id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(`Update Car Successful!`, {
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
      toast.error(`Update Car failed!`, {
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
        error.response?.data?.message ||
          error.message ||
          "Failed to update car data"
      );
    }
  }
);

export const getCarDetail = createAsyncThunk(
  "cars/getCarDetail",
  async (
    {
      carId,
      pickUpTime,
      dropOffTime,
    }: { carId: string | number; pickUpTime: string; dropOffTime: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(`${BASE_URL}/car/customer/car-detail`, {
        params: { carId, pickUpTime, dropOffTime },
        withCredentials: true,
      });

      return response.data;
    } catch (error: any) {
      toast.error(`Fetch car failed!`, {
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
        error.response?.data?.message || "Fetch car failed."
      );
    }
  }
);

export const getBookingListOperator = createAsyncThunk(
  "carFetch/getBookingListOperator",
  async (
    {
      page,
      size,
      sort,
      status,
    }: { page: number; size: number; sort?: string; status?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/booking/operator/all-bookings`,
        {
          params: { page, size, sort, status },
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error: any) {
      toast.error(`Fetch car failed!`, {
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
        error.response?.data?.message || "Fetch car failed."
      );
    }
  }
);

export const confirmDeposit = createAsyncThunk(
  "carFetch/confirmDeposit",
  async (bookingNumber: string, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/booking/operator/confirm-deposit/${bookingNumber}`,
        {},
        { withCredentials: true }
      );
      toast.success(`Confirm Booking successfully!`, {
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
      const errorMessage = error.response?.data || "Cancel booking failed.";
      toast.error(`Failed to confirm booking. Please try again!`, {
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

      return rejectWithValue(errorMessage);
    }
  }
);

export const rejectDeposit = createAsyncThunk(
  "carFetch/rejectDeposit",
  async (bookingNumber: string, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/booking/operator/reject-deposit/${bookingNumber}`,
        {},
        { withCredentials: true }
      );
      toast.success(`Canceled Booking successfully!`, {
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
      const errorMessage = error.response?.data || "Cancel booking failed.";
      toast.error(`Failed to cancel booking. Please try again!`, {
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

      return rejectWithValue(errorMessage);
    }
  }
);

export interface CarFetchSliceState {
  carData: any;
  status: "idle" | "loading" | "succeeded" | "failed";
  errors: Record<string, string>;
  bookings?: any;
}

const initialState: CarFetchSliceState = {
  carData: {},
  status: "idle",
  errors: {
    mileage: "",
    fuelConsumption: "",
    addressCityProvince: "",
    addressDistrict: "",
    addressWard: "",
    addressHouseNumberStreet: "",
    description: "",
    basePrice: "",
    deposit: "",
    specify: "",
    carImageFront: "",
    carImageBack: "",
    carImageLeft: "",
    carImageRight: "",
  },
};

export const carFetchSlice = createSlice({
  name: "carFetch",
  initialState,
  reducers: {
    checkErrors: (state) => {
      const hasError = Object.values(state.errors).some(
        (error) => error !== ""
      );
      if (hasError) {
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

        return;
      }
      state.errors = {};
    },

    setFetchedCarData: (state, action: PayloadAction<any>) => {
      state.carData = {
        ...state.carData,
        ...action.payload,
      };
    },

    setCar: (state, action: PayloadAction<any>) => {
      state.carData.data = {
        ...state.carData.data,
        ...action.payload,
      };
    },

    setErrors: (state, action: PayloadAction<Record<string, string>>) => {
      state.errors = {
        ...state.errors,
        ...action.payload,
      };
    },

    toggleFunction: (state, action: PayloadAction<string>) => {
      if (!state.carData.additionalFunctions) {
        state.carData.additionalFunctions = {};
      }
      state.carData.additionalFunctions = {
        ...state.carData.additionalFunctions,
        [action.payload]: !state.carData.additionalFunctions[action.payload],
      };
    },

    toggleUse: (state, action: PayloadAction<string>) => {
      if (!state.carData.termsOfUses) {
        state.carData.termsOfUses = {};
      }
      state.carData.termsOfUses = {
        ...state.carData.termsOfUses,
        [action.payload]: !state.carData.termsOfUses[action.payload],
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCarById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCarById.fulfilled, (state, action) => {
        state.status = "succeeded";
        const additionalFunctionKeys =
          action.payload?.data?.additionalFunction || "";
        const functionArray = additionalFunctionKeys
          .split(",")
          .map((item: string) => item.trim())
          .filter(Boolean);

        const defaultAdditionalFunctions: Record<string, boolean> = {
          Bluetooth: false,
          GPS: false,
          Camera: false,
          SunRoof: false,
          ChildLock: false,
          ChildSeat: false,
          DVD: false,
          USB: false,
        };

        const updatedAdditionalFunctions = Object.keys(
          defaultAdditionalFunctions
        ).reduce(
          (acc, key) => {
            acc[key] = functionArray.includes(key);
            return acc;
          },
          { ...defaultAdditionalFunctions }
        );

        state.carData = {
          ...action.payload,
          addressCityProvince: "",
          addressDistrict: "",
          addressWard: "",
          addressHouseNumberStreet: "",
          additionalFunctions: updatedAdditionalFunctions,
          termsOfUses: {
            noSmoking: false,
            noPet: false,
            noFoodInCar: false,
          },
          termsOfOther: false,
          specify: "",
        };
      })
      .addCase(fetchCarById.rejected, (state, action) => {
        state.status = "failed";
        state.errors = { general: action.error.message || "Failed" };
      });

    builder
      .addCase(getCarDetail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCarDetail.fulfilled, (state, action) => {
        state.status = "succeeded";

        const additionalFunctionKeys =
          action.payload?.data?.additionalFunction || "";
        const termsOfOthers = action.payload?.data?.termOfUse || "";

        const functionArray = additionalFunctionKeys
          .split(",")
          .map((item: string) => item.trim())
          .filter(Boolean);

        const termsOfOtherArray = termsOfOthers
          .split(",")
          .map((item: string) => item.trim())
          .filter(Boolean);

        const defaultAdditionalFunctions: Record<string, boolean> = {
          Bluetooth: false,
          GPS: false,
          Camera: false,
          SunRoof: false,
          ChildLock: false,
          ChildSeat: false,
          DVD: false,
          USB: false,
        };

        const defaultTermsOfUses: Record<string, boolean> = {
          noSmoking: false,
          noPet: false,
          noFoodInCar: false,
          other: false,
        };

        const validKeys = ["noSmoking", "noPet", "noFoodInCar"];

        const updatedTermsOfOther = Object.keys(defaultTermsOfUses).reduce(
          (acc, key) => {
            acc[key] = termsOfOtherArray.includes(key);
            return acc;
          },
          {
            ...defaultTermsOfUses,
          }
        );

        updatedTermsOfOther.other = termsOfOtherArray.some(
          (key: string) => !validKeys.includes(key)
        );

        const updatedAdditionalFunctions = Object.keys(
          defaultAdditionalFunctions
        ).reduce(
          (acc, key) => {
            acc[key] = functionArray.includes(key);
            return acc;
          },
          { ...defaultAdditionalFunctions }
        );

        state.carData = {
          ...action.payload,
          additionalFunctions: updatedAdditionalFunctions,
          termsOfUses: updatedTermsOfOther,
          other:
            termsOfOtherArray
              .filter((key: string) => !validKeys.includes(key))
              .join(", ") || "",
        };
      })
      .addCase(getCarDetail.rejected, (state, action) => {
        state.status = "failed";
        state.errors = { general: action.error.message || "Failed" };
      });

    builder.addCase(getBookingListOperator.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getBookingListOperator.fulfilled, (state, action) => {
      state.status = "idle";
      state.bookings = action.payload;
    });
    builder.addCase(getBookingListOperator.rejected, (state, action) => {
      state.status = "failed";
      state.errors = { general: action.error.message || "Failed" };
    });

    builder.addCase(confirmDeposit.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(confirmDeposit.fulfilled, (state) => {
      state.status = "idle";
    });
    builder.addCase(confirmDeposit.rejected, (state, action) => {
      state.status = "failed";
      state.errors = { general: action.error.message || "Failed" };
    });

    builder.addCase(rejectDeposit.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(rejectDeposit.fulfilled, (state) => {
      state.status = "idle";
    });
    builder.addCase(rejectDeposit.rejected, (state, action) => {
      state.status = "failed";
      state.errors = { general: action.error.message || "Failed" };
    });
  },
});

export const {
  setFetchedCarData,
  setErrors,
  setCar,
  toggleFunction,
  toggleUse,
  checkErrors,
} = carFetchSlice.actions;

export default carFetchSlice.reducer;
