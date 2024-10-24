import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: { user: null, token: null },
  reducers: {
    registerAction: (state, action) => {
      state.user = action.payload.others;
      state.token = action.payload.token;
    },
    loginAction: (state, action) => {
      state.user = action.payload.others;
      state.token = action.payload.token;
    },
    logoutAction: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { registerAction, loginAction, logoutAction } = userSlice.actions;

export default userSlice.reducer;
