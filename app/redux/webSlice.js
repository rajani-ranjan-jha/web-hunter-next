import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const loadWebData = createAsyncThunk(
  "web/loadWebData",
  async (_, { rejectWithValue }) => {
    try {
      const req = await fetch(`/api/web`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const res = await req.json();
      if (!res || !res.data) {
        console.log("No data found from the server!");
        return rejectWithValue("No data found");
      }
      console.log("REDUX:: got the data", res.data.length);
      return res.data;
    } catch (error) {
      console.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

const webSlice = createSlice({
  name: "web",

  initialState: {
    webData: [],
    loading: false,
    error: null,
  },

  reducers: {
    setWebData: (state, action) => {
      state.webData = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loadWebData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadWebData.fulfilled, (state, action) => {
        state.webData = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(loadWebData.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { setWebData, setLoading, setError } = webSlice.actions;

export default webSlice.reducer;
