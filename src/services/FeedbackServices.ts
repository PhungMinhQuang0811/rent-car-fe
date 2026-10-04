import axios from "axios";
import {
  ApiResponse,
  FeedbackDetailResponse,
  FeedbackResponse,
  PageResponse,
  PaginationParams,
  RatingOverview,
} from "../types";

const BASE_URL = `${process.env.REACT_APP_BASE_URL}/feedback`;

export interface SendFeedbackParams {
  bookingId: string;
  rating: number;
  comment: string;
}

export interface FeedbackSearchParams extends PaginationParams {
  ratingFilter?: number;
}

export const getFeedbackByBookingId = async (
  bookingId: string
): Promise<ApiResponse<FeedbackDetailResponse>> => {
  try {
    const response = await axios.get<ApiResponse<FeedbackDetailResponse>>(
      `${BASE_URL}/customer/view-ratings/${bookingId}`,
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

export const sendFeedback = async ({
  bookingId,
  rating,
  comment,
}: SendFeedbackParams): Promise<ApiResponse<string>> => {
  try {
    const response = await axios.post<ApiResponse<string>>(
      `${BASE_URL}/customer/give-rating`,
      {
        bookingId,
        rating,
        comment,
      },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error submitting feedback:", error);
    throw error;
  }
};

export const getFeedbackByCarOwner = async (
  searchParams: FeedbackSearchParams
): Promise<ApiResponse<PageResponse<FeedbackResponse>>> => {
  try {
    const response = await axios.get<ApiResponse<PageResponse<FeedbackResponse>>>(
      `${BASE_URL}/car-owner/my-feedbacks`,
      {
        params: {
          page: searchParams.page || 0,
          size: searchParams.size || 10,
          ratingFilter: searchParams.ratingFilter || 0,
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

export const getFeedbackByCarId = async (
  carId: string
): Promise<ApiResponse<PageResponse<FeedbackResponse>>> => {
  try {
    const response = await axios.get<ApiResponse<PageResponse<FeedbackResponse>>>(
      `${BASE_URL}/car/${carId}`,
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

export const getAverageRating = async (): Promise<ApiResponse<RatingOverview>> => {
  try {
    const response = await axios.get<ApiResponse<RatingOverview>>(
      `${BASE_URL}/car-owner/rating`,
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

export const getFeedbackByCustomer = async (
  searchParams: PaginationParams
): Promise<ApiResponse<PageResponse<FeedbackResponse>>> => {
  try {
    const response = await axios.get<ApiResponse<PageResponse<FeedbackResponse>>>(
      `${BASE_URL}/customer/view-feedbacks`,
      {
        params: {
          page: searchParams.page || 0,
          size: searchParams.size || 10,
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
