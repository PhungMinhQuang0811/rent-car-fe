import axios, { InternalAxiosRequestConfig } from "axios";
import React, { useLayoutEffect, useState, useRef, useContext, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/UserServices";

interface AuthContextType {
  code?: any;
  setCode?: React.Dispatch<React.SetStateAction<any>>;
}

const AuthContext = createContext<AuthContextType>({});

export const useAuth = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return authContext;
};

export interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [code, setCode] = useState<any>();

  const nav = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const alertShownRef = useRef(false);

  axios.defaults.withCredentials = true;

  useLayoutEffect(() => {
    const csrfInterceptor = axios.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const csrfToken = localStorage.getItem("csrfToken");
        if (csrfToken) {
          config.headers["X-CSRF-TOKEN"] = csrfToken;
        } else {
          console.warn("No CSRF token found in local storage!");
        }
        return config;
      }
    );

    return () => {
      axios.interceptors.request.eject(csrfInterceptor);
    };
  }, []);

  useLayoutEffect(() => {
    const refreshInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (originalRequest._retry) {
          return Promise.reject(error);
        }
        if (
          error.response?.status === 401 &&
          error.response?.data?.code === 4003
        ) {
          if (isRefreshing) {
            return Promise.reject(error);
          }
          setIsRefreshing(true);
          originalRequest._retry = true;
          try {
            const response = await axios.get(
              `${process.env.REACT_APP_BASE_URL}/auth/refresh-token`,
              {
                withCredentials: true,
              }
            );
            localStorage.setItem("csrfToken", response.data.data);
            setIsRefreshing(false);
            return axios(originalRequest);
          } catch (refreshError) {
            setIsRefreshing(false);
            console.log("Request refresh token failed: ", refreshError);
            if (!alertShownRef.current) {
              alertShownRef.current = true;
              alert(
                "This account is offline too long! Please try to login again."
              );
              await logoutUser();
              setTimeout(() => {
                alertShownRef.current = false;
                nav("/");
              }, 0);
            }
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axios.interceptors.response.eject(refreshInterceptor);
    };
  }, [nav, isRefreshing]);

  return (
    <AuthContext.Provider value={{ code, setCode }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
