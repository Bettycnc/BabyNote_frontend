import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    token: null,
    username: null,
    _id: null,
    babyId:null,
  },
};

export const userProSlice = createSlice({
  name: "userPro",
  initialState,
  reducers: {
    login: (state, action) => {
      state.value.token = action.payload.token;
      state.value.username = action.payload.username;
      state.value._id = action.payload._id;
    },
    logout: (state) => {
      state.value.token = null;
      state.value.username = null;
      state.value.babyId= null;
      state.value._id = null
    },
    selectedBaby: (state, action) => {
      state.value.babyId = action.payload.babyId
    }
  },
});

export const { login, logout, selectedBaby } = userProSlice.actions;
export default userProSlice.reducer;
