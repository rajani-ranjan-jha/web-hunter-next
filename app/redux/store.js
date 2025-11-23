import { configureStore } from '@reduxjs/toolkit'
import AdminReducer from './authSlice'
import WebReducer from './webSlice'

export const store = configureStore({
  reducer: {
    admin: AdminReducer,
    web: WebReducer
  },
})
