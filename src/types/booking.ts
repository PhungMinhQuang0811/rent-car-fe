import { Car } from "./car";

export type EBookingStatus =
  | "PENDING_DEPOSIT"
  | "WAITING_CONFIRMED"
  | "CONFIRMED"
  | "CANCELLED"
  | "IN_PROGRESS"
  | "PENDING_PAYMENT"
  | "COMPLETED"
  | "WAITING_CONFIRMED_RETURN_CAR";

export type EPaymentType = "WALLET" | "CASH" | "BANK_TRANSFER";

export interface Booking {
  bookingNumber: string;
  car: Car;
  pickUpLocation: string;
  pickUpTime: string;
  dropOffTime: string;
  basePrice: number;
  deposit: number;
  paymentType: EPaymentType;
  status: EBookingStatus;
  createdAt: string;
  updatedAt: string;
  driverFullName: string;
  driverPhoneNumber: string;
  driverNationalId: string;
  driverDob: string;
  driverEmail: string;
  driverDrivingLicenseUri: string;
  driverCityProvince: string;
  driverDistrict: string;
  driverWard: string;
  driverHouseNumberStreet: string;
}
