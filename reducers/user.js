import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    token: null,
    username: null,
    motherName: null,
    _id: null,
    babies: [],
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.value.token = action.payload.token;
      state.value.username = action.payload.username;
      state.value.motherName = action.payload.motherName;
      state.value._id = action.payload._id;
    },
    logout: (state) => {
      state.value.token = null;
      state.value.username = null;
      state.value.motherName = null;
      state.value._id = null;
      state.value.babies = [];
    },
    setBabies: (state, action) => {
      state.value.babies = action.payload;
    },
  },
});

export const { login, logout, setBabies, addBaby, removeBaby } =
  userSlice.actions;
export default userSlice.reducer;
