import axios from "axios";
import dayjs from "dayjs";
import {
  ApiResponse,
  ListTransactionResponse,
  TransactionResponse,
  VNPayParams,
} from "../types";

const BASE_URL = `${process.env.REACT_APP_BASE_URL}/transaction`;

export interface TopUpForm {
  amount: number;
  [key: string]: any;
}

export interface WithdrawForm {
  amount: number;
  [key: string]: any;
}

export const fetchAllTransactions = async (): Promise<ApiResponse<ListTransactionResponse> | null> => {
  try {
    const response = await axios.get<ApiResponse<ListTransactionResponse>>(
      `${BASE_URL}/transaction-list?all=true`,
      {
        withCredentials: true,
      }
    );
    console.log("Fetched transactions:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return null;
  }
};

export const fetchTransactionsByDate = async (
  fromDate: any,
  toDate: any
): Promise<ApiResponse<ListTransactionResponse> | null> => {
  try {
    const response = await axios.get<ApiResponse<ListTransactionResponse>>(
      `${BASE_URL}/transaction-list`,
      {
        params: {
          from: dayjs(fromDate).format("YYYY-MM-DDTHH:mm:ss"),
          to: dayjs(toDate).format("YYYY-MM-DDTHH:mm:ss"),
        },
        withCredentials: true,
      }
    );

    console.log("Fetched transactions by date:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions by date:", error);
    return null;
  }
};

export const fetchResponseFromVNPay = async (vnpParams: VNPayParams): Promise<any> => {
  if (!vnpParams.vnp_TxnRef) return null;
  try {
    const response = await axios.get(`${BASE_URL}/${vnpParams.vnp_TxnRef}/status`, {
      params: vnpParams,
      withCredentials: true,
    });
    console.log(response);
    return response;
  } catch (error) {
    alert("Error transaction with VNPay: " + error);
    return null;
  }
};

export const topup = async (formTopUp: TopUpForm): Promise<ApiResponse<any> | null> => {
  try {
    const response = await axios.post<ApiResponse<any>>(`${BASE_URL}/top-up`, formTopUp, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error top-up", error);
    return null;
  }
};

export const withdrawFunction = async (formWithdraw: WithdrawForm): Promise<any> => {
  try {
    const response = await axios.post(`${BASE_URL}/withdraw`, formWithdraw, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.error("Error withdraw", error);
    throw error;
  }
};
