import React, { useEffect, useState } from "react";
import Breadcrumb from "../components/common/Breadcrumb";
import Layout from "../components/common/Layout";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import icon from "../assets/walleticon.png";
import {
  DatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ModalClose, ModalDialog } from "@mui/joy";
import {
  fetchAllTransactions,
  fetchResponseFromVNPay,
  fetchTransactionsByDate,
  topup,
  withdrawFunction,
} from "../services/WalletServices";
import { useNavigate, useSearchParams } from "react-router-dom";
import NotificationSnackbar from "../components/common/NotificationSnackbar";

const listBreadcrumbData = [
  {
    name: "Home",
    link: "/home",
  },
  {
    name: "My Wallet",
    link: "/my-wallet",
  },
];

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "No.",
    flex: 0.5,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "amount",
    headerName: "Amount",
    flex: 1,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "type",
    headerName: "Transaction Type",
    flex: 1.25,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "createdAt",
    headerName: "Date Time",
    flex: 1.5,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "bookingNo",
    headerName: "Booking No.",
    flex: 1,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "carName",
    headerName: "Car Name",
    flex: 1,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "message",
    headerName: "Note",
    flex: 1,
    headerAlign: "left",
    align: "left",
  },
];

const MyWallet: React.FC = () => {
  const [alert, setAlert] = useState<{
    open: boolean;
    message: string;
    severity: "info" | "success" | "error" | "warning";
  }>({ open: false, message: "", severity: "success" });

  const [fromDate, setFromDate] = useState<Dayjs | null>(
    dayjs().subtract(1, "month").startOf("day")
  );
  const [toDate, setToDate] = useState<Dayjs | null>(dayjs().endOf("day"));
  const [errorDate, setErrorDate] = useState("");

  const [balance, setBalance] = useState<number | undefined>();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [searchParams] = useSearchParams();
  const nav = useNavigate();

  useEffect(() => {
    document.title = "My Wallet";
  }, []);

  const fetchTransactions = async () => {
    if (!fromDate || !toDate) return;
    try {
      const res = await fetchTransactionsByDate(fromDate, toDate);
      if (!res || !res.data) return;
      const transactionsWithId = (res.data.listTransactionResponse || [])
        .filter((item: any) => item.status === "SUCCESSFUL")
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .map((item: any, index: number) => ({
          ...item,
          id: index + 1,
          createdAt: item.createdAt
            ? new Date(item.createdAt).toLocaleString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hourCycle: "h23",
              })
            : "N/A",
          bookingNo: item.bookingNo || "N/A",
          carName: item.carName || "N/A",
          amount:
            item.amount != null
              ? `${
                  item.type !== "PAY_DEPOSIT" && item.type !== "WITHDRAW"
                    ? "+"
                    : "-"
                }${item.amount.toLocaleString()}`
              : "N/A",
          message: item.message || "N/A",
        }));
      setBalance(res.data.balance);
      setTransactions(transactionsWithId);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [refresh]);

  useEffect(() => {
    const vnpParams = Object.fromEntries(searchParams.entries());
    const txnRef = vnpParams.vnp_TxnRef;

    if (!txnRef) return;

    const fetchResponseVNPay = async () => {
      try {
        const response = await fetchResponseFromVNPay(vnpParams);
        console.log("VNPay Response:", response);
        if (response) {
          setTimeout(() => {
            fetchTransactions();
          }, 500);
          setAlert({
            open: true,
            message: `Top-up status: ${(response.data as any)?.data?.status}. Amount: ${(response.data as any)?.data?.amount}`,
            severity: "success",
          });
          setTimeout(() => {
            nav("/my-wallet", { replace: true });
          }, 1000);
        }
      } catch (error) {
        console.error("Error fetching VNPay response:", error);
      }
    };

    fetchResponseVNPay();
  }, [searchParams, nav]);

  useEffect(() => {
    if (!fromDate || !toDate) {
      setErrorDate("");
      return;
    }
    if (fromDate.isAfter(toDate)) {
      setErrorDate("the To date must be later than the From date.");
    } else {
      setErrorDate("");
    }
  }, [fromDate, toDate]);

  const handleSearchDate = async () => {
    if (!fromDate || !toDate) {
      setAlert({
        open: true,
        message: "Please select a valid date range.",
        severity: "error",
      });
      return;
    }
    fetchTransactions();
  };

  const [amountTopUp, setAmountTopUp] = useState<string | number>("");
  const [amountWithdraw, setAmountWithdraw] = useState<string | number>("");
  const [openTopUp, setOpenTopUp] = useState(false);

  const handleOpenTopUp = () => setOpenTopUp(true);
  const handleCloseTopUp = () => setOpenTopUp(false);

  const [openWithdraw, setOpenWithdraw] = useState(false);
  const handleOpenWithdraw = () => setOpenWithdraw(true);
  const handleCloseWithdraw = () => setOpenWithdraw(false);

  const handleSubmitTopUp = async () => {
    if (!amountTopUp || amountTopUp === "") {
      setAlert({
        open: true,
        message: "Please select an amount before proceeding with top-up.",
        severity: "error",
      });
      return;
    }

    if (Number(amountTopUp) <= 0) {
      setAlert({
        open: true,
        message: "Please select a valid amount for top-up.",
        severity: "error",
      });
      return;
    }

    const formTopUp = {
      type: "TOP_UP",
      bookingNumber: "",
      carName: "",
      amount: Number(amountTopUp),
      message: "",
    };

    try {
      const res = await topup(formTopUp);
      if (!res || !res.data) {
        setAlert({
          open: true,
          message: "Top-up request failed. Please try again.",
          severity: "error",
        });
        return;
      }
      handleCloseTopUp();
      const vnpUrl = (res.data as any)?.payment?.vnp_url || (res.data as any)?.vnp_url;
      if (vnpUrl) {
        window.open(vnpUrl);
      }
    } catch (error: any) {
      console.error("Top-up Error:", error);
      setAlert({
        open: true,
        message: `Top-up failed: ${error.response?.data?.message || "Please try again"}`,
        severity: "error",
      });
    }
    setRefresh((prev) => !prev);
  };

  const handleSubmitWithdraw = async () => {
    if (!amountWithdraw || Number(amountWithdraw) <= 0) {
      setAlert({
        open: true,
        message: "Please select a valid amount to withdraw.",
        severity: "error",
      });
      return;
    }
    const formWithdraw = {
      type: "WITHDRAW",
      bookingNumber: "",
      carName: "",
      amount: Number(amountWithdraw),
      message: "",
    };

    try {
      const res = await withdrawFunction(formWithdraw);
      if (!res || !res.data) return;
      setAlert({
        open: true,
        message: `Successfully withdraw ${(res.data as any)?.data?.amount?.toLocaleString()} VND`,
        severity: "success",
      });
    } catch (error: any) {
      console.error("Withdraw Error:", error);
      setAlert({
        open: true,
        message: `Withdraw error: ${error.response?.data?.message || "Unknown error"}`,
        severity: "error",
      });
    } finally {
      setTimeout(() => {
        handleCloseWithdraw();
      }, 2000);
    }

    setRefresh((prev) => !prev);
    fetchAllTransactions();
  };

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  return (
    <div>
      <Layout>
        <Container sx={{ marginInline: "150px" }}>
          <NotificationSnackbar
            alert={alert}
            onClose={() => setAlert({ ...alert, open: false })}
          />
          <Breadcrumb listData={listBreadcrumbData} />
          <Box display={"flex"} sx={{ marginBottom: 2 }}>
            <Box
              component="img"
              sx={{
                height: 50,
                width: 50,
              }}
              src={icon}
            />
            <Typography
              variant="h5"
              display={"flex-column"}
              alignContent={"center"}
            >
              My Wallet
            </Typography>
          </Box>

          <Box
            className="account-balance"
            display={"flex"}
            justifyContent={"space-between"}
            marginBottom={"20px"}
          >
            <Box
              sx={{
                backgroundColor: "whitesmoke",
                padding: 3,
                width: "42%",
                borderRadius: 2,
                border: "solid 2px ",
                borderColor: "#05ce80",
              }}
            >
              <Typography variant="h6" color="#333333" marginBottom={"10px"}>
                Your current balance:
              </Typography>
              <Box display={"flex"}>
                <Typography variant="h6" color="#333333" marginRight={"10px"}>
                  VND{" "}
                </Typography>
                <Typography variant="h4" color="#333333">
                  {balance != null ? balance.toLocaleString() : "0"}
                </Typography>
              </Box>
            </Box>
            <Box
              className="list-button"
              display={"flex flex-column"}
              justifyContent={"flex-end"}
              alignContent={"end"}
            >
              <Button
                sx={{
                  width: 150,
                  height: 50,
                  backgroundColor: "#05ce80",
                  marginInline: 2,
                  color: "white",
                  transition: " 0.3s",
                  "&:hover": {
                    backgroundColor: "white",
                    borderRadius: 2,
                    borderColor: "#05ce80",
                    color: "#05ce80",
                  },
                }}
                onClick={handleOpenTopUp}
              >
                Top-Up
              </Button>

              <Modal open={openTopUp} onClose={handleCloseTopUp}>
                <ModalDialog>
                  <ModalClose onClick={handleCloseTopUp} />
                  <Box textAlign={"center"}>
                    <Typography variant={"h6"}>Top-up</Typography>
                    <Typography variant={"body2"}>
                      Your current balance is{" "}
                      {balance != null ? balance.toLocaleString() : "0"} VND.
                    </Typography>
                    <br />
                    <Typography variant={"body2"}>
                      Please select the amount to top-up to your wallet.
                    </Typography>
                    <br />
                    <FormControl sx={{ marginTop: "10px", width: "50%" }}>
                      <InputLabel id="topup-amount-label">Amount</InputLabel>
                      <Select
                        labelId="topup-amount-label"
                        id="topup-amount-select"
                        value={amountTopUp}
                        label="Amount"
                        onChange={(e) => setAmountTopUp(e.target.value)}
                      >
                        <MenuItem value={2000000}>2,000,000 VND</MenuItem>
                        <MenuItem value={5000000}>5,000,000 VND</MenuItem>
                        <MenuItem value={10000000}>10,000,000 VND</MenuItem>
                      </Select>
                    </FormControl>
                    <Button
                      sx={{
                        width: 150,
                        height: 50,
                        borderRadius: 2,
                        border: "solid white",
                        backgroundColor: "#05ce80",
                        marginInline: 2,
                        color: "white",
                        transition: " 0.3s",
                        "&:hover": {
                          backgroundColor: "white",
                          borderRadius: 2,
                          borderColor: "#05ce80",
                          color: "#05ce80",
                        },
                      }}
                      onClick={handleSubmitTopUp}
                    >
                      Top-Up
                    </Button>
                  </Box>
                </ModalDialog>
              </Modal>
              <Button
                sx={{
                  width: 150,
                  height: 50,
                  borderRadius: 2,
                  border: "solid ",
                  borderColor: "#05ce80",
                  backgroundColor: "white",
                  marginInline: 2,
                  color: "#05ce80",
                  "&:hover": {
                    backgroundColor: "#05ce80",
                    borderColor: "#05ce80",
                    color: "white",
                  },
                }}
                onClick={handleOpenWithdraw}
              >
                Withdraw
              </Button>
              <Modal open={openWithdraw} onClose={handleCloseWithdraw}>
                <ModalDialog>
                  <ModalClose onClick={handleCloseWithdraw} />
                  <Box textAlign={"center"}>
                    <Typography variant={"h6"}>Withdraw</Typography>
                    <Typography variant={"body2"}>
                      Your current balance is{" "}
                      {balance != null ? balance.toLocaleString() : "0"} VND.
                    </Typography>
                    <br />
                    <Typography variant={"body2"}>
                      Please select the amount to withdraw from your wallet.
                    </Typography>
                    <br />
                    <FormControl sx={{ marginTop: "10px", width: "50%" }}>
                      <InputLabel id="withdraw-amount-label">Amount</InputLabel>
                      <Select
                        labelId="withdraw-amount-label"
                        id="withdraw-amount-select"
                        value={amountWithdraw}
                        label="Amount"
                        onChange={(e) => setAmountWithdraw(e.target.value)}
                      >
                        <MenuItem value={2000000}>2,000,000 VND</MenuItem>
                        <MenuItem value={5000000}>5,000,000 VND</MenuItem>
                        {balance != null && (
                          <MenuItem value={balance}>All balance</MenuItem>
                        )}
                      </Select>
                    </FormControl>
                    <br />
                    <Button
                      sx={{
                        width: 150,
                        height: 50,
                        borderRadius: 2,
                        border: "solid white",
                        backgroundColor: "#05ce80",
                        marginInline: 2,
                        color: "white",
                        transition: " 0.3s",
                        "&:hover": {
                          backgroundColor: "white",
                          borderRadius: 2,
                          borderColor: "#05ce80",
                          color: "#05ce80",
                        },
                      }}
                      onClick={handleSubmitWithdraw}
                    >
                      Withdraw
                    </Button>
                  </Box>
                </ModalDialog>
              </Modal>
            </Box>
          </Box>
          <Box
            sx={{
              backgroundColor: "whitesmoke",
              padding: 3,
              borderRadius: 2,
              border: "solid 2px ",
              borderColor: "#05ce80",
              marginBottom: "30px",
            }}
          >
            <Typography variant="h6" color="#333333" marginBottom={"10px"}>
              Your History of Transactions
            </Typography>
            <Box
              display={"flex"}
              justifyContent={"space-around"}
              marginBottom={"10px"}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box display={"flex"} sx={{ width: "42%" }}>
                  <Typography
                    variant="h6"
                    color="#333333"
                    marginBottom={"10px"}
                    display={"flex-column"}
                    alignContent={"center"}
                    marginRight={1}
                  >
                    From
                  </Typography>
                  <DatePicker
                    format="DD/MM/YYYY"
                    disableFuture
                    value={fromDate}
                    onChange={(newValue) => {
                      if (newValue) setFromDate(newValue.startOf("day"));
                    }}
                  />
                </Box>
                <Box display={"flex"} sx={{ width: "42%" }}>
                  <Typography
                    variant="h6"
                    color="#333333"
                    marginBottom={"10px"}
                    display={"flex-column"}
                    alignContent={"center"}
                    marginRight={1}
                  >
                    To
                  </Typography>
                  <DatePicker
                    format="DD/MM/YYYY"
                    disableFuture
                    value={toDate}
                    onChange={(newValue) => {
                      if (newValue) setToDate(newValue.endOf("day"));
                    }}
                  />
                </Box>
              </LocalizationProvider>
            </Box>
            {errorDate ? (
              <>
                <Box display={"flex"} justifyContent={"end"}>
                  <Typography
                    color="red"
                    fontSize={"15px"}
                    fontStyle={"italic"}
                  >
                    {errorDate}
                  </Typography>
                </Box>
                <Box display={"flex"} justifyContent={"end"}>
                  <Button
                    disabled
                    sx={{
                      width: 150,
                      height: 50,
                      borderRadius: 2,
                      border: "solid white",
                      backgroundColor: "#05ce80",
                      marginInline: 2,
                      color: "white",
                      transition: " 0.3s",
                      marginBottom: "10px",
                    }}
                  >
                    Search
                  </Button>
                </Box>
              </>
            ) : (
              <Box display={"flex"} justifyContent={"end"}>
                <Button
                  onClick={handleSearchDate}
                  sx={{
                    width: 150,
                    height: 50,
                    borderRadius: 2,
                    border: "solid white",
                    backgroundColor: "#05ce80",
                    marginInline: 2,
                    color: "white",
                    transition: " 0.3s",
                    marginBottom: "10px",
                    "&:hover": {
                      backgroundColor: "white",
                      borderRadius: 2,
                      borderColor: "#05ce80",
                      color: "#05ce80",
                    },
                  }}
                >
                  Search
                </Button>
              </Box>
            )}
            <Paper>
              <DataGrid
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                columns={columns}
                rows={transactions}
                disableRowSelectionOnClick
                pagination
                pageSizeOptions={[10, 15, 20, 25, 30]}
              />
            </Paper>
          </Box>
        </Container>
      </Layout>
    </div>
  );
};

export default MyWallet;
