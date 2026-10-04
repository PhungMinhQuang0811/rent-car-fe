import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { useSearchParams, Link as RouterLink } from "react-router-dom";
import { useEffect, useState } from "react";
import ListCard from "../components/common/ListCard";
import {
  Breadcrumbs,
  Link as MuiLink,
  Typography,
  Box,
  FormControl,
  MenuItem,
  TextField,
  CircularProgress,
  Grid,
  Button,
  Divider,
} from "@mui/material";
import Pagination from "../components/common/Pagination";
import {
  getBookingListOperator,
  confirmDeposit,
  rejectDeposit,
} from "../reducers/carFetchReducer";
import { useAppDispatch } from "../redux/hooks";
import Swal from "sweetalert2";

export const BookingList: React.FC = () => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [totalElement, setTotalElement] = useState(0);
  const [bookingData, setBookingData] = useState<any[] | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const [page, setPage] = useState<number>(
    parseInt(searchParams.get("page") || "1", 10)
  );
  const [pageSize, setPageSize] = useState<number>(
    parseInt(searchParams.get("size") || "10", 10)
  );
  const [statusFilter, setStatusFilter] = useState<string>(
    searchParams.get("status") || "ALL"
  );

  // total page
  const [totalPages, setTotalPages] = useState<number>(1);

  // sort mapping
  const sortMapping: Record<string, string> = {
    "updatedAt,DESC": "newest",
    "updatedAt,ASC": "oldest",
    "basePrice,DESC": "priceHigh",
    "basePrice,ASC": "priceLow",
  };

  // sort status
  const statusOptions = [
    "ALL",
    "CANCELLED",
    "CONFIRMED",
    "PENDING_PAYMENT",
    "PENDING_DEPOSIT",
    "WAITING_CONFIRMED",
    "IN_PROGRESS",
    "COMPLETED",
    "WAITING_CONFIRMED_RETURN_CAR",
  ];

  // sort query
  const getSortQuery = (option: string) =>
    ({
      newest: "updatedAt,DESC",
      oldest: "updatedAt,ASC",
      priceHigh: "basePrice,DESC",
      priceLow: "basePrice,ASC",
    }[option] || "updatedAt,DESC");

  const validStatuses = new Set(statusOptions.slice(1));
  const [sortOption, setSortOption] = useState<string>(
    sortMapping[searchParams.get("sort") || ""] || "newest"
  );

  useEffect(() => {
    document.title = "Booking List";
  }, []);

  // function to handle page change
  useEffect(() => {
    const params: Record<string, string> = {
      page: String(page),
      size: String(pageSize),
      sort: getSortQuery(sortOption),
    };

    if (validStatuses.has(statusFilter)) {
      params.status = statusFilter;
    }

    setSearchParams(params);
  }, [sortOption, page, pageSize, statusFilter, setSearchParams]);

  const fetchMyBookings = async () => {
    try {
      const response = await dispatch(
        getBookingListOperator({
          page: (page - 1) || 0,
          size: pageSize || 10,
          sort: getSortQuery(sortOption) || "updatedAt,DESC",
          status: statusFilter === "ALL" ? null : statusFilter,
        })
      ).unwrap();
      setBookingData(response.data?.bookings?.content || []);
      setTotalElement(response.data?.totalOnGoingBookings || 0);
      setTotalPages(response.data?.bookings?.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch booking data:", error);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, [page, pageSize, sortOption, statusFilter]);

  return (
    <div>
      <Header />
      <Breadcrumbs sx={{ mx: "auto", maxWidth: "1200px", py: 1, px: 2 }}>
        <MuiLink underline="hover" color="inherit" component={RouterLink} to="/">
          Home
        </MuiLink>
        <Typography color="text.primary">Booking List</Typography>
      </Breadcrumbs>
      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
          mt: 4,
        }}
      >
        <Typography variant="h4" fontWeight="bold" sx={{ textAlign: "center" }}>
          My Booking
        </Typography>
      </Box>
      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
          my: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="subtitle1">
          You have{" "}
          <span style={{ color: "#05ce80", fontWeight: "bold" }}>
            {totalElement} on-going
          </span>{" "}
          bookings!
        </Typography>
        <Box>
          <FormControl sx={{ minWidth: "200px" }} variant="outlined">
            <TextField
              select
              id="sort-select"
              label="Sort By"
              value={sortOption}
              onChange={(e) => {
                setSortOption(e.target.value);
                setPage(1);
              }}
              fullWidth
            >
              <MenuItem value="newest">Newest to Oldest</MenuItem>
              <MenuItem value="oldest">Oldest to Newest</MenuItem>
              <MenuItem value="priceHigh">Price: High to Low</MenuItem>
              <MenuItem value="priceLow">Price: Low to High</MenuItem>
            </TextField>
          </FormControl>
          <FormControl sx={{ minWidth: "200px", ml: 2 }} variant="outlined">
            <TextField
              select
              label="Status Filter"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              fullWidth
            >
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Box>
      </Box>
      <Grid
        container
        direction="column"
        spacing={3}
        sx={{
          maxWidth: "1200px",
          mx: "auto",
          my: 2,
          border: "1px solid #ccc",
          borderRadius: "6px",
          boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.3)",
        }}
      >
        {bookingData &&
          bookingData.map((booking) => (
            <Grid
              className="booking-item"
              data-booking-id={booking.bookingNumber || ""}
              data-status={booking.status || ""}
              data-baseprice={booking.basePrice || ""}
              item
              xs={12}
              md={12}
              key={booking.bookingNumber}
              sx={{
                maxWidth: "1200px",
                mx: "auto",
                mt: 4,
              }}
            >
              <Grid container spacing={10} alignItems="stretch">
                <Grid item xs={8.5}>
                  <ListCard BookingData={booking} />
                </Grid>
                <Grid
                  item
                  xs={3.5}
                  container
                  direction="column"
                  spacing={2}
                  gap={2}
                  alignItems="flex-end"
                  sx={{
                    height: "100%",
                    justifyContent: "space-between",
                    marginTop: "40px",
                  }}
                >
                  {booking.status === "PENDING_DEPOSIT" &&
                    booking.paymentType !== "WALLET" && (
                      <>
                        <Button
                          variant="contained"
                          disabled={loading}
                          sx={{
                            backgroundColor: "#05ce80",
                            color: "white",
                            "&:hover": { backgroundColor: "green" },
                            width: "100%",
                            paddingY: 1.2,
                            paddingX: 2,
                            height: "auto",
                          }}
                          onClick={async () => {
                            const result = await Swal.fire({
                              title: "Are you sure?",
                              text: "Do you really want to confirm this booking?",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonText: "Yes, confirm it!",
                              cancelButtonText: "No, keep it",
                            });

                            if (result.isConfirmed) {
                              try {
                                setLoading(true);
                                await dispatch(
                                  confirmDeposit(booking.bookingNumber)
                                ).unwrap();
                                fetchMyBookings();
                              } catch (error) {
                                console.error("Error confirming booking:", error);
                              } finally {
                                setLoading(false);
                              }
                            }
                          }}
                        >
                          {loading ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            "Confirm"
                          )}
                        </Button>
                        <Button
                          variant="contained"
                          disabled={loading}
                          sx={{
                            backgroundColor: "red",
                            color: "white",
                            "&:hover": { backgroundColor: "darkred" },
                            width: "100%",
                            paddingY: 1.2,
                            paddingX: 2,
                            height: "auto",
                          }}
                          onClick={async () => {
                            const result = await Swal.fire({
                              title: "Are you sure?",
                              text: "Do you really want to reject this booking?",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonText: "Yes, reject it!",
                              cancelButtonText: "No, keep it",
                            });

                            if (result.isConfirmed) {
                              try {
                                setLoading(true);
                                await dispatch(
                                  rejectDeposit(booking.bookingNumber)
                                ).unwrap();
                                fetchMyBookings();
                              } catch (error) {
                                console.error("Error rejecting booking:", error);
                              } finally {
                                setLoading(false);
                              }
                            }
                          }}
                        >
                          {loading ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            "Reject"
                          )}
                        </Button>
                      </>
                    )}
                </Grid>
              </Grid>
              <Divider sx={{ mt: 2 }} />
            </Grid>
          ))}
      </Grid>
      {/* Pagination */}
      <Pagination
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

export default BookingList;
