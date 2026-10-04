import React, { useState, useEffect } from "react";
import { Breadcrumbs, Link, Typography, Box } from "@mui/material";
import Header from "../components/common/Header";
import SearchForm from "../components/SearchCar/SearchForm";
import { useSearchParams } from "react-router-dom";
import { getSearchResult } from "../services/CarServices";
import SearchResults from "../components/CarList/SearchResult";
import dayjs from "dayjs";
import PaginationComponent from "../components/common/Pagination";
import Footer from "../components/common/Footer";
import utc from "dayjs/plugin/utc";
import LoadingComponent from "../components/common/LoadingComponent";
import { CarResponse } from "../types/car";

dayjs.extend(utc);

export const SearchResult: React.FC = () => {
  const [errorMsg, setErrorMsg] = useState<{ [key: string]: string }>({});
  const [totalElement, setTotalElement] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchParams] = useSearchParams();
  const [cars, setCars] = useState<CarResponse[]>([]);
  const [page, setPage] = useState<number>(
    parseInt(searchParams.get("page") || "1") || 1
  );
  const [pageSize, setPageSize] = useState<number>(
    parseInt(searchParams.get("size") || "10") || 10
  );
  const [totalPages, setTotalPages] = useState<number>(1);
  const [sortOption, setSortOption] = useState<string>("newest");
  const address = searchParams.get("address") || "";
  const pickUpTime = searchParams.get("pickUpTime") || "";
  const dropOffTime = searchParams.get("dropOffTime") || "";

  const getSortQuery = (option: string): string =>
    ({
      newest: "productionYear,DESC",
      oldest: "productionYear,ASC",
      priceHigh: "basePrice,DESC",
      priceLow: "basePrice,ASC",
    }[option] || "productionYear,DESC");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {
          address,
          pickUpTime: pickUpTime
            ? dayjs(pickUpTime).utc().format("YYYY-MM-DDTHH:mm:ss")
            : "",
          dropOffTime: dropOffTime
            ? dayjs(dropOffTime).utc().format("YYYY-MM-DDTHH:mm:ss")
            : "",
          page: page - 1,
          size: pageSize,
          sort: getSortQuery(sortOption),
        };
        const response = await getSearchResult(params);
        const updatedCars = (response.data?.content || []).map((car: any) => ({
          ...car,
          status: "AVAILABLE",
        }));
        setCars(updatedCars || []);
        setTotalPages(response.data?.totalPages || 1);
        setTotalElement(response.data?.totalElements || 0);
      } catch (error) {
        setErrorMsg({ message: "Failed to load search results." });
      } finally {
        setLoading(false);
      }
      document.title = "Search Results";
    };
    fetchData();
  }, [address, pickUpTime, dropOffTime, page, pageSize, sortOption]);

  useEffect(() => {
    document.title = "Search Result";
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
        <Typography color="text.primary">Search Results</Typography>
      </Breadcrumbs>

      <SearchForm
        errorMsg={errorMsg}
        setErrorMsg={setErrorMsg}
        searchParams={searchParams}
      />
      <SearchResults
        CarData={cars}
        totalElement={totalElement}
        setSortOption={setSortOption}
        sortOption={sortOption}
        setPage={setPage}
      />
      <PaginationComponent
        page={page - 1}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage + 1)}
        pageSize={pageSize}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />
      <Box sx={{ mt: 4 }}>
        <Footer />
      </Box>
    </div>
  );
};

export default SearchResult;
