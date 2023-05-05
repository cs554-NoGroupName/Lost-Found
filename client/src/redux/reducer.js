import { createSlice } from "@reduxjs/toolkit";
// import { toast } from "react-toastify";

export const loginReducer = createSlice({
  name: "userData",
  initialState: {
    userData: {},
  },
  reducers: {
    setLogin: (state, action) => {
      const { data } = action.payload;
      return { ...state, userData: data };
    },
  },
});

export const { setLogin } = loginReducer.actions;

export default loginReducer.reducer;
