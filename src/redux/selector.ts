import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./store";

export const selectCars = createSelector(
  (state: RootState) => state.cars,
  (carsState) => carsState.cars
);
