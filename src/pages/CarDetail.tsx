import React from "react";
import {
  Breadcrumbs,
  Link,
  Typography,
  Grid,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCarDetail } from "../services/CarServices";
import { CarOverView } from "../components/CarList/CarOverView";
import { BasicInformation } from "../components/CarDetails/BasicInformation";
import { DetailsComponent } from "../components/CarDetails/DetailsComponent";
import { TermofUse } from "../components/CarDetails/TermofUse";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { setRentalTime } from "../reducers/RentalTimeReducer";
import FeedbackList from "../components/CarDetails/FeedbackList";
import { getFeedbackByCarId } from "../services/FeedbackServices";
import dayjs from "dayjs";
import LoadingComponent from "../components/common/LoadingComponent";

const CarDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [CarData, setCarData] = useState<any>(null);
  const [feedbackList, setFeedbackList] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);

  const pickUpTime = useAppSelector((state) => state.rental.pickUpTime);
  const dropOffTime = useAppSelector((state) => state.rental.dropOffTime);
  const dispatch = useAppDispatch();

  const handleRentalTimeChange = (newPickUpTime: any, newDropOffTime: any) => {
    const pTime = dayjs(newPickUpTime);
    const dTime = dayjs(newDropOffTime);
    dispatch(
      setRentalTime({ pickUpTime: pTime.toISOString(), dropOffTime: dTime.toISOString() })
    );
  };

  useEffect(() => {
    async function fetchCarData() {
      if (!id || !pickUpTime || !dropOffTime) return;

      const formData = { carId: id, pickUpTime, dropOffTime };
      try {
        setLoading(true);
        const response = await getCarDetail(formData);
        const updatedCarData = {
          ...response.data,
          status: "AVAILABLE",
        };
        setCarData(updatedCarData);
      } catch (error) {
        console.error("Failed to fetch car data:", error);
      } finally {
        setLoading(false);
      }
      document.title = "Car Detail";
    }
    fetchCarData();
  }, [id, pickUpTime, dropOffTime]);

  useEffect(() => {
    async function getListFeedback() {
      if (!id) return;
      try {
        const response = await getFeedbackByCarId(id);
        const fbData = response.data as any;
        setFeedbackList(fbData?.length === 0 ? null : fbData);
      } catch (error) {
        console.error("Failed to fetch feedback data:", error);
      }
    }
    getListFeedback();
  }, [id]);

  useEffect(() => {
    document.title = "Car Detail";
  }, []);

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div>
      <Header />

      <Breadcrumbs sx={{ mx: "auto", maxWidth: "1200px", py: 1, px: 2 }}>
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Link underline="hover" color="inherit" href="/">
          Search Results
        </Link>
        <Typography color="text.primary">Car Detail</Typography>
      </Breadcrumbs>

      <div className="page-content" style={{ marginBottom: "40px" }}>
        <Grid container sx={{ maxWidth: "1200px", mx: "auto", mt: 2 }}>
          <CarOverView
            CarData={CarData}
            large={true}
            onRentalTimeChange={handleRentalTimeChange}
          />
        </Grid>

        <Box sx={{ maxWidth: "1200px", mx: "auto", mt: 4 }}>
          <Tabs
            value={tabIndex}
            onChange={(_event, newValue) => setTabIndex(newValue)}
          >
            <Tab label="Basic Information" />
            <Tab label="Details" />
            <Tab label="Term of use" />
            <Tab label="Feedback List" />
          </Tabs>

          <Box
            className="border-box"
            sx={{
              padding: 2,
              textAlign: "left",
              m: 0,
            }}
          >
            {tabIndex === 0 && <BasicInformation CarData={CarData} />}
            {tabIndex === 1 && <DetailsComponent CarData={CarData} />}
            {tabIndex === 2 && <TermofUse CarData={CarData} />}
            {tabIndex === 3 &&
              (feedbackList && feedbackList.length > 0 ? (
                <FeedbackList
                  feedbackList={feedbackList}
                  img={CarData?.carImageFront}
                />
              ) : (
                <Box
                  sx={{
                    textAlign: "center",
                    alignItems: "center",
                    p: 4,
                    bgcolor: "#f9f9f9",
                    borderRadius: "8px",
                    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                    height: "250px",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ textAlign: "center", mt: 2 }}
                  >
                    No feedback available.
                  </Typography>
                  <img
                    src="https://img.icons8.com/?size=100&id=SfQftXEz2mXG&format=png&color=05ce80"
                    alt="No feedback"
                    width="200"
                    height="200"
                  />
                </Box>
              ))}
          </Box>
        </Box>
      </div>

      <Footer />
    </div>
  );
};

export default CarDetail;
