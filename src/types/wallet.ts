export type ETransactionType =
  | "TOP_UP"
  | "WITHDRAW"
  | "PAY_DEPOSIT"
  | "RECEIVE_DEPOSIT"
  | "REFUND_DEPOSIT"
  | "OFFSET_FINAL_PAYMENT";

export type ETransactionStatus = "PENDING" | "PROCESSING" | "SUCCESS" | "FAILED";

export interface TransactionResponse {
  createdAt: string;
  type: ETransactionType;
  bookingNo?: string;
  carName?: string;
  amount: number;
  message?: string;
  status: ETransactionStatus;
}

export interface ListTransactionResponse {
  transactions?: TransactionResponse[];
  listTransactionResponse?: any[];
  currentBalance?: number;
  balance?: number;
}

export interface WalletResponse {
  id: string;
  balance: number;
}

export interface VNPayParams {
  vnp_TxnRef?: string;
  vnp_Amount?: string;
  vnp_ResponseCode?: string;
  vnp_TransactionNo?: string;
  [key: string]: any;
}
