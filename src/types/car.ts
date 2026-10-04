export type ECarStatus = "NOT_VERIFIED" | "VERIFIED" | "STOPPED";

export interface Car {
  id: string;
  brand: string;
  model: string;
  licensePlate: string;
  color: string;
  numberOfSeats: number;
  productionYear: number;
  mileage: number;
  fuelConsumption: number;
  basePrice: number;
  deposit: number;
  cityProvince: string;
  district: string;
  ward: string;
  houseNumberStreet: string;
  description?: string;
  additionalFunction?: string;
  termOfUse?: string;
  isAutomatic: boolean;
  isGasoline: boolean;
  status: ECarStatus;
  frontPhotoUri?: string;
  backPhotoUri?: string;
  leftPhotoUri?: string;
  rightPhotoUri?: string;
  registrationPaperUri?: string;
  certificateOfInspectionUri?: string;
  carInsuranceUri?: string;
  rating?: number;
  numberOfTrips?: number;
}

export type CarResponse = Car & { [key: string]: any };

export interface CarSearchParams {
  address?: string;
  pickUpTime?: string;
  dropOffTime?: string;
  page?: number;
  size?: number;
  sort?: string;
  status?: ECarStatus;
}
