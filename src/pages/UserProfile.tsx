import React, { useEffect, useState } from "react";
import { getUserProfile } from "../services/UserServices";
import PersonalInformation from "../components/User/PersonalInfomation";
import SecurityChangePassword from "../components/User/ChangePassword";
import {
  Breadcrumbs,
  Link,
  Typography,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import Layout from "../components/common/Layout";
import LoadingComponent from "../components/common/LoadingComponent";
import { UserProfile } from "../types/user";

export default function UserProfilePage() {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    document.title = "User Profile";
  }, []);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await getUserProfile();
        setUserData(response.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, []);

  if (loading) return <LoadingComponent />;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Layout>
      <Breadcrumbs sx={{ mx: "auto", maxWidth: "1200px", py: 1, px: 2, my: 2 }}>
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Typography color="text.primary">My Profile</Typography>
      </Breadcrumbs>

      <Box sx={{ width: "100%", maxWidth: "1200px", mx: "auto", mb: 5 }}>
        {/* Tabs */}
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          aria-label="user profile tabs"
        >
          <Tab id="tab-user-info" label="User Info" />
          <Tab id="tab-change-password" label="Change Password" />
        </Tabs>

        {/* Tab Content*/}
        <Box
          sx={{
            display: selectedTab === 0 ? "block" : "none",
            border: "1px solid #ccc",
            padding: 2,
            textAlign: "left",
            borderRadius: 1,
            m: 0,
          }}
        >
          <PersonalInformation initialData={userData} />
        </Box>

        <Box
          sx={{
            display: selectedTab === 1 ? "block" : "none",
            border: "1px solid #ccc",
            padding: 2,
            textAlign: "left",
            borderRadius: 1,
          }}
        >
          <SecurityChangePassword />
        </Box>
      </Box>
    </Layout>
  );
}
