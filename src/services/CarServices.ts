import axios from "axios";
import { ApiResponse, Car, CarSearchParams, PageResponse } from "../types";

const CAR_URL = `${process.env.REACT_APP_BASE_URL}/car`;

export interface CarDetailParams {
  id?: string;
  [key: string]: any;
}

export interface CarDocumentsResponse {
  registrationPaperUri?: string;
  certificateOfInspectionUri?: string;
  carInsuranceUri?: string;
  [key: string]: any;
}

export const getCarDetail = async (
  formData: CarDetailParams
): Promise<ApiResponse<Car>> => {
  try {
    const requestUrl = `${CAR_URL}/customer/car-detail`;
    const response = await axios.get<ApiResponse<Car>>(requestUrl, {
      params: formData,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.error("Response data:", error.response?.data);
    alert(error.response?.data?.message || "Get data failed");
    throw error;
  }
};

export const getSearchResult = async (
  searchParams: CarSearchParams
): Promise<ApiResponse<PageResponse<Car>>> => {
  try {
    const response = await axios.get<ApiResponse<PageResponse<Car>>>(
      `${CAR_URL}/customer/search-car`,
      {
        params: {
          address: searchParams.address,
          pickUpTime: searchParams.pickUpTime,
          dropOffTime: searchParams.dropOffTime,
          page: searchParams.page || 0,
          size: searchParams.size || 10,
          sort: searchParams.sort || "productionYear,DESC",
        },
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error:", error);
    alert(error.response?.data?.message || "Get search results failed");
    throw error;
  }
};

export const getCarDetailbyCarOwner = async (
  id: string
): Promise<ApiResponse<Car>> => {
  try {
    const requestUrl = `${CAR_URL}/car-owner/${id}`;
    const response = await axios.get<ApiResponse<Car>>(requestUrl, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.error("Response data:", error.response?.data);
    alert(error.response?.data?.message || "Get data failed");
    throw error;
  }
};

export const getMyCars = async (
  searchParams: CarSearchParams
): Promise<ApiResponse<PageResponse<Car>>> => {
  try {
    const response = await axios.get<ApiResponse<PageResponse<Car>>>(
      `${CAR_URL}/car-owner/my-cars`,
      {
        params: {
          page: searchParams.page || 0,
          size: searchParams.size || 10,
          sort: searchParams.sort || "productionYear,DESC",
        },
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error);
    alert(error.response?.data?.message || "Get data failed");
    throw error;
  }
};

export const getAllCars = async (
  searchParams: CarSearchParams
): Promise<ApiResponse<PageResponse<Car>>> => {
  try {
    const response = await axios.get<ApiResponse<PageResponse<Car>>>(
      `${CAR_URL}/operator/list`,
      {
        params: {
          page: searchParams.page || 0,
          size: searchParams.size || 10,
          sort: searchParams.sort || "updatedAt,DESC",
          ...(searchParams.status && { status: searchParams.status }),
        },
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error);
    alert(error.response?.data?.message || "Get data failed");
    throw error;
  }
};

export const getCarDocuments = async (
  id: string
): Promise<ApiResponse<CarDocumentsResponse>> => {
  try {
    const response = await axios.get<ApiResponse<CarDocumentsResponse>>(
      `${CAR_URL}/operator/documents/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error);
    alert(error.response?.data?.message || "Get data failed");
    throw error;
  }
};

export const verifyCar = async (id: string): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.put<ApiResponse<any>>(
      `${CAR_URL}/operator/verify/${id}`,
      {},
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error verify Status:", error);
    throw error;
  }
};
