import axios from "axios";
import {
  AccountRegisterRequest,
  ApiResponse,
  EditPasswordRequest,
  EditProfileResponse,
  LoginRequest,
  LoginResponse,
  UserResponse,
} from "../types";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const registerUser = async (
  userData: AccountRegisterRequest
): Promise<ApiResponse<UserResponse>> => {
  try {
    const response = await fetch(`${BASE_URL}/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const checkUniqueEmail = async (email: { email: string }): Promise<any> => {
  try {
    const response = await fetch(`${BASE_URL}/user/check-unique-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(email),
    });
    return response.json();
  } catch (error) {
    console.error("Error checking email:", error);
    return null;
  }
};

export const login = async (
  userData: LoginRequest
): Promise<ApiResponse<LoginResponse>> => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      credentials: "include",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const forgotPasswordEmailFunction = async (email: string): Promise<any> => {
  try {
    const response = await axios.get(`${BASE_URL}/auth/forgot-password/${email}`, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.log("Error in email: ", error);
  }
};

export const forgotPasswordVerify = async (token: string): Promise<any> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/auth/forgot-password/verify?t=${token}`,
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.log("Error in change password: ", error);
  }
};

export const forgotPasswordChange = async (formChangePassword: any): Promise<any> => {
  try {
    const response = await axios.put(
      `${BASE_URL}/auth/forgot-password/change`,
      formChangePassword,
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getUserProfile = async (): Promise<ApiResponse<EditProfileResponse>> => {
  try {
    const response = await axios.get<ApiResponse<EditProfileResponse>>(
      `${BASE_URL}/user/edit-profile`,
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

export const updateUserProfile = async (formData: FormData): Promise<any> => {
  try {
    const response = await axios.put(`${BASE_URL}/user/edit-profile`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const updateUserPassword = async (
  formData: EditPasswordRequest
): Promise<ApiResponse<string>> => {
  try {
    const response = await axios.put<ApiResponse<string>>(
      `${BASE_URL}/user/edit-password`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await fetch(`${BASE_URL}/auth/logout`, {
      credentials: "include",
    });

    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("token");
    localStorage.removeItem("csrfToken");
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};
