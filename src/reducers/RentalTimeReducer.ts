import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import dayjs, { Dayjs } from "dayjs";

const today = dayjs().startOf("day");

const MIN_PICKUP_HOUR = 6;
const MAX_PICKUP_HOUR = 22;
const MIN_DROPOFF_HOUR = 6;
const MAX_DROPOFF_HOUR = 22;

const getMinPickUpTime = (): Dayjs => {
  const now = dayjs();
  let pickUp: Dayjs;

  // Round up if minutes or second > 0
  const adjustedNow =
    now.minute() > 0 || now.second() > 0
      ? now.add(1, "hour").startOf("hour")
      : now;

  if (adjustedNow.hour() + 2 > MAX_PICKUP_HOUR) {
    pickUp = today.add(1, "day").hour(MIN_PICKUP_HOUR);
  } else {
    pickUp = adjustedNow.add(2, "hour");
    if (pickUp.hour() < MIN_PICKUP_HOUR) {
      pickUp = pickUp.startOf("day").hour(MIN_PICKUP_HOUR);
    }
  }
  return pickUp;
};

const getValidDropOffTime = (pickUpTime: Dayjs): Dayjs => {
  let dropOff = pickUpTime.add(2, "hour");

  if (dropOff.hour() > MAX_DROPOFF_HOUR) {
    dropOff = dropOff.startOf("day").add(1, "day").hour(MIN_DROPOFF_HOUR);
  } else if (dropOff.hour() < MIN_DROPOFF_HOUR) {
    dropOff = dropOff.startOf("day").add(1, "day").hour(MIN_DROPOFF_HOUR);
  }
  return dropOff;
};

export interface RentalAddress {
  cityProvince: string;
  district: string;
  ward: string;
  houseNumberStreet?: string;
}

export interface RentalState {
  pickUpTime: string;
  dropOffTime: string;
  address: RentalAddress;
}

const initialPickUpTime = getMinPickUpTime();
const initialDropOffTime = getValidDropOffTime(initialPickUpTime);

const initialState: RentalState = {
  pickUpTime: dayjs(initialPickUpTime).format("YYYY-MM-DDTHH:mm:ss[Z]"),
  dropOffTime: dayjs(initialDropOffTime).format("YYYY-MM-DDTHH:mm:ss[Z]"),
  address: {
    cityProvince: "",
    district: "",
    ward: "",
  },
};

const rentalSlice = createSlice({
  name: "rental",
  initialState,
  reducers: {
    setRentalTime: (
      state,
      action: PayloadAction<{ pickUpTime: string; dropOffTime: string }>
    ) => {
      const { pickUpTime, dropOffTime } = action.payload;
      state.pickUpTime = pickUpTime;
      state.dropOffTime = dropOffTime;
    },
    setAddress: (state, action: PayloadAction<RentalAddress>) => {
      state.address = action.payload;
    },
  },
});

export const { setRentalTime, setAddress } = rentalSlice.actions;
export default rentalSlice.reducer;
