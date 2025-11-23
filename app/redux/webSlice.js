import { createSlice } from '@reduxjs/toolkit'

const webSlice = createSlice({
  name: 'web',

  initialState: {
    webData: [],
    loading: false,
    error: null
  },

  reducers: {
    setWebData: (state, action) => {
      state.webData = action.payload
      state.loading = false
      state.error = null
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
      state.loading = false
    }
  }
})

export const { setWebData, setLoading, setError } = webSlice.actions

export default webSlice.reducer
