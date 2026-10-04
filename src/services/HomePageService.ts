import axios from "axios";
import { ApiResponse, FeedbackResponse } from "../types";

const BASE_URL = `${process.env.REACT_APP_BASE_URL}/homepage`;

export interface TopCity {
  cityProvince: string;
  numberOfCars: number;
  image?: string;
}

export const getFeedback = async (): Promise<ApiResponse<FeedbackResponse[]>> => {
  try {
    const response = await axios.get<ApiResponse<FeedbackResponse[]>>(`${BASE_URL}/feedbacks`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error:", error);
    alert(error.response?.data?.message || "Get data failed");
    throw error;
  }
};

export const getTop6City = async (): Promise<ApiResponse<TopCity[]>> => {
  try {
    const response = await axios.get<ApiResponse<TopCity[]>>(`${BASE_URL}/city`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error:", error);
    alert(error.response?.data?.message || "Get data failed");
    throw error;
  }
};
