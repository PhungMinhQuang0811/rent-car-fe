import React, { useEffect, useState } from "react";
import Layout from "../components/common/Layout";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import HomePageCarOwner from "./HomePageCarOwner";
import HomePageGuest from "./HomePageGuest";
import HomePageCustomer from "./HomePageCustomer";
import ViewListAllCar from "./ViewListAllCar";

const HomePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("t");
  const roleParam = searchParams.get("role");

  const storedRole = localStorage.getItem("role");
  let roleToUse = storedRole || roleParam || "GUEST";
  const [, setOpenLogin] = useState(false);
  const handleOpenLogin = () => setOpenLogin(true);
  const handleCloseLogin = () => setOpenLogin(false);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const nav = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        return;
      }
      try {
        const res = await axios.get(
          `${BASE_URL}/user/verify-email?t=${token}`
        );
        alert(res.data?.message || "Email verified");
        setTimeout(() => {
          nav("/", { replace: true });
        }, 1000);
      } catch (error) {
        alert("Verification failed. Your link may have expired.");
        setTimeout(() => {
          nav("/", { replace: true });
        }, 1000);
      }
    };
    verifyEmail();
  }, [token, BASE_URL, nav]);

  useEffect(() => {
    document.title = "Home Page";
  }, []);

  return (
    <>
      {roleToUse !== "OPERATOR" && (
        <Layout>
          {roleToUse === "GUEST" && <HomePageGuest />}
          {roleToUse === "CAR_OWNER" && <HomePageCarOwner />}
          {roleToUse === "CUSTOMER" && <HomePageCustomer />}
        </Layout>
      )}
      {roleToUse === "OPERATOR" && <ViewListAllCar />}
    </>
  );
};

export default HomePage;
