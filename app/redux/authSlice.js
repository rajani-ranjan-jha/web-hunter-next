import { createSlice } from '@reduxjs/toolkit'


const AdminSlice = createSlice({
  name: 'admin',

  initialState:{
    status : false,
    name: ''
  },

  reducers: {
    setAdminStatus: (state, action) => {
      state.status = action.payload
      },
    setUserData: (state, action) => {
      state.name = action.payload
      },
      

  }
})

// Action creators are generated for each case reducer function
export const { setAdminStatus, setUserData } = AdminSlice.actions //exporting the reducer functions

export default  AdminSlice.reducer //exporting the reducers
