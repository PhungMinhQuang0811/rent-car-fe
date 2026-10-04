import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useState } from "react";
import Slider, { CustomArrowProps } from "react-slick";
import { Box, Typography, Card, CardMedia } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

const ArrowButton = styled("div")({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 2,
  width: "45px",
  height: "45px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  "& svg": {
    color: "#05ce80",
    fontSize: "30px",
  },
});

const PrevArrow: React.FC<CustomArrowProps> = (props) => {
  const { onClick } = props;
  return (
    <ArrowButton style={{ left: "-25px" }} onClick={onClick}>
      <ArrowBackIos fontSize="small" />
    </ArrowButton>
  );
};

const NextArrow: React.FC<CustomArrowProps> = (props) => {
  const { onClick } = props;
  return (
    <ArrowButton style={{ right: "-25px" }} onClick={onClick}>
      <ArrowForwardIos fontSize="small" />
    </ArrowButton>
  );
};

const StyledSlider = styled(Slider)({
  ".slick-track": {
    display: "flex",
    gap: "20px",
  },
  ".slick-slide": {
    padding: "0 10px",
  },
});

export interface CityData {
  cityProvince: string;
  image?: string;
  carCount?: number;
  numberOfCars?: number;
  [key: string]: any;
}

export interface WhereToFindUsProps {
  citiesData: CityData[];
}

const WhereToFindUs: React.FC<WhereToFindUsProps> = ({ citiesData = [] }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Box
      sx={{
        maxWidth: { xs: "90%", sm: "95%", md: "1200px" },
        mx: "auto",
        mt: 4,
      }}
    >
      <Typography variant="h4" fontWeight="bold" mb={3} textAlign="center">
        Where to find us?
      </Typography>
      <StyledSlider {...settings}>
        {citiesData.map((city, index) => {
          const count = city.carCount || city.numberOfCars || 0;
          return (
            <Box key={index}>
              <Card
                className="slick-card"
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "12px",
                  boxShadow: 3,
                  transition: "transform 0.3s ease-in-out",
                  transform: hoveredIndex === index ? "scale(1.05)" : "scale(1)",
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <CardMedia
                  component="img"
                  height="270"
                  image={city.image}
                  alt={city.cityProvince}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: "80px",
                    bgcolor: "rgba(0, 0, 0, 0.6)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    transition: "transform 0.3s ease-in-out",
                    transform: hoveredIndex === index ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" color="white">
                    {city.cityProvince}
                  </Typography>
                  <Typography variant="body2" color="white">
                    {Math.floor(count / 10) * 10}+ cars
                  </Typography>
                </Box>
              </Card>
            </Box>
          );
        })}
      </StyledSlider>
    </Box>
  );
};

export default WhereToFindUs;
