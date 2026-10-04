export type ERole = "CUSTOMER" | "CAR_OWNER" | "OPERATOR" | "ADMIN";

export interface UserResponse {
  fullName: string;
  email: string;
  phoneNumber: string;
  role: ERole;
}

export interface LoginResponse {
  userRole: ERole;
  fullName: string;
  csrfToken: string;
}

export interface EditProfileResponse {
  fullName: string;
  dob: string;
  phoneNumber: string;
  nationalId: string;
  drivingLicenseUrl: string;
  cityProvince: string;
  district: string;
  ward: string;
  houseNumberStreet: string;
  email: string;
}

export interface AccountRegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: ERole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface EditPasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserProfile {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  nationalId?: string;
  dob?: string;
  cityProvince?: string;
  district?: string;
  ward?: string;
  houseNumberStreet?: string;
  drivingLicenseUrl?: string;
}
