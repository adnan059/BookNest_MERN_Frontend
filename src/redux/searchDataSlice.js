import { createSlice } from "@reduxjs/toolkit";

const searchDataSlice = createSlice({
  name: "searchData",
  initialState: {
    searchedData: [],
    loading: false,
    searchQueries: {
      city: "",
      dates: [],
      options: {
        adult: 1,
        children: 0,
        room: 1,
      },
    },
  },
  reducers: {
    storeData: (state, action) => {
      state.searchedData = action.payload.data;
    },
    updateLoading: (state, action) => {
      state.loading = action.payload.loading;
    },
    updateSearchQueries: (state, action) => {
      state.searchQueries.city = action.payload.destination;
      state.searchQueries.dates = action.payload.dateRange;
      state.searchQueries.options = action.payload.options;
    },
  },
});

export const { storeData, updateLoading, updateSearchQueries } =
  searchDataSlice.actions;

export default searchDataSlice.reducer;
