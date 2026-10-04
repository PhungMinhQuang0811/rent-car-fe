import axios from "axios";
import { ApiResponse, Booking, EBookingStatus, PageResponse, PaginationParams } from "../types";

const BOOK_URL = `${process.env.REACT_APP_BASE_URL}/booking`;

export interface BookingSearchParams extends PaginationParams {
  status?: EBookingStatus | null;
}

export const getMyBookings = async (
  searchParams: BookingSearchParams
): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.get<ApiResponse<any>>(
      `${BOOK_URL}/customer/my-bookings`,
      {
        params: {
          page: searchParams.page || 0,
          size: searchParams.size || 10,
          sort: searchParams.sort || "updatedAt,DESC",
          status: searchParams.status || null,
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

export const getMyRentals = async (
  searchParams: BookingSearchParams
): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.get<ApiResponse<any>>(
      `${BOOK_URL}/car-owner/rentals`,
      {
        params: {
          page: searchParams.page || 0,
          size: searchParams.size || 10,
          sort: searchParams.sort || "updatedAt,DESC",
          status: searchParams.status || null,
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

export const getRentalsDetail = async (id: string): Promise<ApiResponse<any>> => {
  try {
    const requestUrl = `${BOOK_URL}/car-owner/${id}`;
    const response = await axios.get<ApiResponse<any>>(requestUrl, {
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

export const confirmBooking = async (
  bookingNumber: string
): Promise<ApiResponse<Booking>> => {
  try {
    const response = await axios.put<ApiResponse<Booking>>(
      `${BOOK_URL}/car-owner/${bookingNumber}/confirm`,
      {},
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error confirming booking:", error);
    throw error;
  }
};
