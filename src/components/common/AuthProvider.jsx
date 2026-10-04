import axios from "axios";
import { useLayoutEffect, useState, useEffect, useRef } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import {logoutUser} from "../../services/UserServices";

const AuthContext = createContext(undefined);

export const useAuth = () => {
    const authContext = useContext(AuthContext);
    if (!authContext) {
        throw new Error("useAuth must be used within a AuthProvider");
    }
    return authContext;
};


const AuthProvider = ({children}) =>{

    const [code,setCode] = useState();

    const nav = useNavigate();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const alertShownRef = useRef(false);

    axios.defaults.withCredentials = true;
    let csrfToken = localStorage.getItem("csrfToken");
    useLayoutEffect(() => {
        const csrfInterceptor = axios.interceptors.request.use((config) => {
            csrfToken = localStorage.getItem("csrfToken");
            console.log(document.cookie);
            console.log("Setting CSRF Token:", csrfToken);
            if (csrfToken) {
                config.headers["X-CSRF-TOKEN"] = csrfToken;
            } else {
                console.warn("No CSRF token found in local storage!");
            }
            return config;
        });

        return () => {
            axios.interceptors.request.eject(csrfInterceptor);
        };
    }, [csrfToken]);
    useLayoutEffect(()=>{
        const refreshInterceptor = axios.interceptors.response.use(
            (response) => response,
            async(error)=>{
                // save error.config(as a configuration object) to retry request later
                const originalRequest = error.config;
                if (originalRequest._retry) {
                    return Promise.reject(error);
                }
                if(error.response?.status === 401 && error.response?.data.code===4003){
                    if(isRefreshing){
                        return Promise.reject(error)
                    }
                    setIsRefreshing(true);
                    originalRequest._retry=true;
                    try{
                        // call to refresh Refresh token
                        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/auth/refresh-token`,{
                            withCredentials: true,
                        });
                        console.log('Through cookie refresh')
                        console.log("csrf response",response);
                        localStorage.setItem("csrfToken",response.data.data);
                        //marked as retried
                        setIsRefreshing(false);
                        //retry failed request
                        return axios(originalRequest);
                    }catch(refreshError){
                        setIsRefreshing(false);
                        console.log("Request refresh token failed: ",refreshError);
                        if (!alertShownRef.current) { // Show alert only once
                            alertShownRef.current = true;
                            alert("This account is offline too long! Please try to login again.");
                            await logoutUser();
                            setTimeout(() => {
                                alertShownRef.current = false; // Reset after navigation
                                nav("/");
                            }, 0);
                        }
                        return Promise.reject(refreshError)
                    }

                }
                // if not 401, reject error
                return Promise.reject(error)
            }
        )
        return ()=>{
            axios.interceptors.response.eject(refreshInterceptor);
        }
    },[nav, isRefreshing]);
    return (
        <AuthContext.Provider>
            {children}
        </AuthContext.Provider>
    )
};
export default AuthProvider;
