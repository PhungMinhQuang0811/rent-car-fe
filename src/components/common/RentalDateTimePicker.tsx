import React, { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dialog, Button, Stack, Typography, Grid, MenuItem, Select, Box, SelectChangeEvent } from "@mui/material";
import utc from "dayjs/plugin/utc";
import { CheckCircle, Warning } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setRentalTime } from "../../reducers/RentalTimeReducer";

dayjs.extend(utc);

interface RentalDatePickerProps {
    available?: boolean | null;
    onRentalTimeChange?: (pickUp: string, dropOff: string) => void;
}

const RentalDatePicker: React.FC<RentalDatePickerProps> = ({ available, onRentalTimeChange }) => {
    const dispatch = useAppDispatch();
    const [openPicker, setOpenPicker] = useState<boolean>(false);

    const today = dayjs().utc().startOf("day");
    const MIN_PICKUP_HOUR = 6;
    const MAX_PICKUP_HOUR = 22;
    const MIN_DROPOFF_HOUR = 6;
    const MAX_DROPOFF_HOUR = 22;

    const getMinPickUpTime = (): Dayjs => {
        const now = dayjs();
        let pickUp: Dayjs;

        // Round up if minutes or second > 0
        const adjustedNow = now.minute() > 0 || now.second() > 0 ? now.add(1, "hour").startOf("hour") : now;

        if (adjustedNow.hour() + 2 > MAX_PICKUP_HOUR) {
            // If now add two hours > 22h, minPickUp time start at 8am of next day
            pickUp = today.add(1, "day").hour(MIN_PICKUP_HOUR);
        } else {
            pickUp = adjustedNow.add(2, "hour");
            // If now add two hours < 8am, minPickUp time start at 8am of today
            if (pickUp.hour() < MIN_PICKUP_HOUR) {
                pickUp = pickUp.startOf("day").hour(MIN_PICKUP_HOUR);
            }
        }
        return pickUp;
    };

    const { pickUpTime, dropOffTime } = useAppSelector((state) => state.rental);
    const [tempPickUpDate, setTempPickUpDate] = useState<Dayjs>(dayjs.utc(pickUpTime));
    const [tempDropOffDate, setTempDropOffDate] = useState<Dayjs>(dayjs.utc(dropOffTime));
    const [pickUpHour, setPickUpHour] = useState<number>(tempPickUpDate.hour());
    const [dropOffHour, setDropOffHour] = useState<number>(tempDropOffDate.hour());

    const handleOpen = () => {
        setOpenPicker(true);
    };

    const handlePickUpChange = (newDate: Dayjs | null) => {
        if (!newDate || newDate.isBefore(today, "day")) return;

        setTempPickUpDate(() => {
            const updatedPickUp = newDate.hour(pickUpHour);
            let minDropOff = updatedPickUp.add(2, "hour");

            if (minDropOff.hour() >= 24) {
                minDropOff = minDropOff.startOf("day").hour(MIN_DROPOFF_HOUR);
            } else if (minDropOff.hour() > MAX_DROPOFF_HOUR) {
                minDropOff = minDropOff.add(1, "day").startOf("day").hour(MIN_DROPOFF_HOUR);
            }

            setTempDropOffDate((prevDropOff) => (prevDropOff.isBefore(minDropOff) ? minDropOff : prevDropOff));
            setDropOffHour(minDropOff.hour());

            return updatedPickUp;
        });
    };

    const handlePickUpHourChange = (event: SelectChangeEvent<number>) => {
        const hour = Number(event.target.value);
        const newtempPickUpDate = tempPickUpDate.hour(hour);
        let newtempDropOffDate = tempDropOffDate;

        if (newtempDropOffDate.isSame(newtempPickUpDate, "day") && newtempDropOffDate.hour() < hour + 2) {
            newtempDropOffDate = newtempPickUpDate.add(2, "hour");
        }

        if (newtempDropOffDate.hour() > MAX_DROPOFF_HOUR || newtempDropOffDate.hour() < MIN_DROPOFF_HOUR) {
            if (newtempDropOffDate.hour() === 0) {
                newtempDropOffDate = newtempDropOffDate.hour(MIN_DROPOFF_HOUR);
            } else {
                newtempDropOffDate = newtempDropOffDate.add(1, "day").startOf("day").hour(MIN_DROPOFF_HOUR);
            }
        }

        setPickUpHour(hour);
        setTempPickUpDate(newtempPickUpDate);
        setTempDropOffDate(newtempDropOffDate);
        setDropOffHour(newtempDropOffDate.hour());
    };

    const handleDropOffChange = (newDate: Dayjs | null) => {
        if (!newDate || newDate.isBefore(tempPickUpDate, "day")) return;
        let newHour = dropOffHour;
        let targetDate = newDate;

        if (targetDate.isAfter(tempPickUpDate, "day")) {
            newHour = Math.max(MIN_DROPOFF_HOUR, dropOffHour);
        } else {
            newHour = Math.max(pickUpHour + 2, dropOffHour);
        }

        if (newHour >= MAX_DROPOFF_HOUR) {
            targetDate = targetDate.add(1, "day").startOf("day").hour(MIN_DROPOFF_HOUR);
            newHour = MIN_DROPOFF_HOUR;
        } else if (newHour < MIN_DROPOFF_HOUR) {
            newHour = MIN_DROPOFF_HOUR;
            targetDate = targetDate.startOf("day").hour(newHour);
        }
        setTempDropOffDate(targetDate.hour(newHour));
        setDropOffHour(newHour);
    };

    const handleDropOffHourChange = (event: SelectChangeEvent<number>) => {
        const hour = Number(event.target.value);

        if (tempDropOffDate.isSame(tempPickUpDate, "day")) {
            if (hour <= pickUpHour + 1) return;
        }

        setDropOffHour(hour);
        setTempDropOffDate(tempDropOffDate.hour(hour));
    };

    const handleRentalTimeChange = (newPickUpTime: string, newDropOffTime: string) => {
        dispatch(setRentalTime({ pickUpTime: newPickUpTime, dropOffTime: newDropOffTime }));
        if (onRentalTimeChange) {
            onRentalTimeChange(newPickUpTime, newDropOffTime);
        }
    };

    const handleConfirm = () => {
        if (new Date(dropOffTime).getTime() - new Date(pickUpTime).getTime() < 2 * 60 * 60 * 1000) {
            alert("Drop-off date time must be at least 2 hours later than Pick-up date time, please try again.");
            return;
        }
        setOpenPicker(false);

        const formattedPickUp = tempPickUpDate.format("YYYY-MM-DDTHH:mm:ss[Z]");
        const formattedDropOff = tempDropOffDate.format("YYYY-MM-DDTHH:mm:ss[Z]");
        handleRentalTimeChange(formattedPickUp, formattedDropOff);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack spacing={2} alignItems="center">
                <Button
                    variant="outlined"
                    onClick={handleOpen}
                    sx={{
                        width: "100%",
                        py: 0,
                        minHeight: "60px",
                        backgroundColor: "white",
                        textTransform: "none",
                        borderColor: available === true ? "#05ce80" : available === false ? "red" : "transparent",
                        color: "black"
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                            backgroundColor: "#fff",
                            height: "100%"
                        }}
                    >
                        <Box sx={{ width: "45%" }}>
                            <Typography variant="body2" fontWeight="bold" sx={{ fontSize: "0.85rem", textAlign: "left" }}>
                                Pick-up Time
                            </Typography>
                            <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
                                <Typography variant="body2" fontWeight="bold" sx={{ fontSize: "0.75rem", marginRight: "8px" }}>
                                    {tempPickUpDate.format("DD/MM/YYYY")}
                                </Typography>
                                <Typography variant="body2" fontWeight="bold" sx={{ fontSize: "0.75rem" }}>
                                    {tempPickUpDate.format("HH:00")}
                                </Typography>
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                width: "1px",
                                backgroundColor: "#ccc",
                                alignSelf: "stretch",
                                margin: "0px 10px"
                            }}
                        />
                        <Box sx={{ width: "45%" }}>
                            <Typography variant="body2" fontWeight="bold" sx={{ fontSize: "0.85rem", textAlign: "left" }}>
                                Drop-off Time
                            </Typography>
                            <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
                                <Typography variant="body2" fontWeight="bold" sx={{ fontSize: "0.75rem", marginRight: "8px" }}>
                                    {tempDropOffDate.format("DD/MM/YYYY")}
                                </Typography>
                                <Typography variant="body2" fontWeight="bold" sx={{ fontSize: "0.75rem" }}>
                                    {tempDropOffDate.format("HH:00")}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Button>
                {/* Conditional Icon and Message */}
                {available !== undefined && available !== null ? (
                    available ? (
                        <Box sx={{ display: "flex", alignItems: "center", color: "#05ce80" }}>
                            <CheckCircle sx={{ marginRight: 1 }} />
                            <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
                                This car is available to rent now
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ display: "flex", alignItems: "center", color: "red" }}>
                            <Warning sx={{ marginRight: 1 }} />
                            <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
                                Car unavailable during this period. Please choose another car or adjust your schedule.
                            </Typography>
                        </Box>
                    )
                ) : null}
            </Stack>
            <Dialog open={openPicker} onClose={() => setOpenPicker(false)} maxWidth="md" fullWidth>
                <Stack spacing={1} sx={{ p: { xs: 2, sm: 2 } }}>
                    <Typography variant="h5" align="center">Rental Time</Typography>
                    <Typography sx={{ px: 3, color: "gray", fontSize: "0.9rem", textAlign: "center" }}>
                        Note: Drop-off date time must be at least 2 hours later than Pick-up date time
                    </Typography>
                    <Grid container sx={(theme) => ({
                        display: "flex",
                        flexWrap: "nowrap",
                        justifyContent: "space-between",
                        gap: 2,
                        px: 3,
                        [theme.breakpoints.down("sm")]: {
                            flexWrap: "wrap",
                            px: 1
                        }
                    })}>
                        {/* Pick-up picker column */}
                        <Grid item xs={12} sm={6} sx={{
                            flex: { xs: "1 1 100%", sm: "1 1 48%" },
                            minWidth: { xs: "100%", sm: "48%" },
                            display: "flex",
                            flexDirection: "column",
                            gap: 2
                        }}>
                            <Typography fontWeight="bold">Pick-up Date</Typography>
                            <DateCalendar
                                value={tempPickUpDate}
                                onChange={handlePickUpChange}
                                minDate={getMinPickUpTime()}
                                maxDate={today.add(60, "day").hour(22)}
                                sx={{ border: "1px solid #05ce80", borderRadius: "8px", width: { xs: "100%" }, mx: 0 }}
                            />
                            <Typography fontWeight="bold">Pick-up Time</Typography>
                            <Select<number>
                                value={pickUpHour}
                                onChange={handlePickUpHourChange}
                                sx={{ width: { xs: "100%" } }}
                            >
                                {Array.from({ length: MAX_DROPOFF_HOUR - MIN_DROPOFF_HOUR + 1 }, (_, i) => MIN_DROPOFF_HOUR + i)
                                    .filter((h) => (
                                        tempPickUpDate.isSame(today, "day")
                                            ? h >= getMinPickUpTime().hour()
                                            : h >= MIN_PICKUP_HOUR
                                    ))
                                    .map((h) => <MenuItem key={h} value={h}>{h}:00</MenuItem>)}
                            </Select>
                        </Grid>

                        {/* Drop-off picker column */}
                        <Grid item xs={12} sm={6} sx={{
                            flex: { xs: "1 1 100%", sm: "1 1 48%" },
                            minWidth: { xs: "100%", sm: "48%" },
                            display: "flex",
                            flexDirection: "column",
                            gap: 2
                        }}>
                            <Typography fontWeight="bold">Drop-off Date</Typography>
                            <DateCalendar
                                value={tempDropOffDate}
                                onChange={handleDropOffChange}
                                minDate={tempPickUpDate}
                                maxDate={tempPickUpDate.add(1, "month").hour(22)}
                                sx={{ border: "1px solid #05ce80", borderRadius: "8px", width: { xs: "100%" }, mx: 0 }}
                            />
                            <Typography fontWeight="bold">Drop-off Time</Typography>
                            <Select<number>
                                value={dropOffHour}
                                onChange={handleDropOffHourChange}
                                sx={{ width: { xs: "100%" } }}
                            >
                                {Array.from({ length: MAX_DROPOFF_HOUR - MIN_DROPOFF_HOUR + 1 }, (_, i) => MIN_DROPOFF_HOUR + i)
                                    .filter((h) => (
                                        tempDropOffDate.isSame(tempPickUpDate, "day")
                                            ? h >= pickUpHour + 2
                                            : h >= MIN_DROPOFF_HOUR
                                    ))
                                    .map((h) => <MenuItem key={h} value={h}>{h}:00</MenuItem>)}
                            </Select>
                        </Grid>
                    </Grid>
                    <Box sx={{ display: "flex", justifyContent: "space-between", px: 3 }}>
                        <Typography variant="subtitle1" fontWeight="bold">Pick-up Time</Typography>
                        <Typography variant="subtitle1" fontWeight="bold">{tempPickUpDate.format("DD/MM/YYYY HH:00")}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", px: 3 }}>
                        <Typography variant="subtitle1" fontWeight="bold">Drop-off Time</Typography>
                        <Typography variant="subtitle1" fontWeight="bold">{tempDropOffDate.format("DD/MM/YYYY HH:00")}</Typography>
                    </Box>
                    <Typography sx={{ px: 3 }} fontWeight="bold">
                        Rental Time: <span style={{ color: "#05ce80", fontWeight: "bold", fontSize: "20px" }}>{Math.ceil(tempDropOffDate.diff(tempPickUpDate, "hour") / 24)} day(s)</span>
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={handleConfirm}
                        sx={{ width: { xs: "80%", sm: "25%" }, fontSize: "1.1rem", alignSelf: "center", backgroundColor: "#05ce80" }}
                    >
                        Confirm
                    </Button>
                </Stack>
            </Dialog>
        </LocalizationProvider>
    );
};

export default RentalDatePicker;
