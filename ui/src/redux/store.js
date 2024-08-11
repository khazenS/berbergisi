import { configureStore } from '@reduxjs/toolkit'
import registerReducer from "../redux/features/mainPageSlices/registerSlice.js"
import shopStatusReducer from './features/adminPageSlices/shopStatusSlice.js'
import dailyBookingReducer from "../redux/features/mainPageSlices/dailyBookingSlice.js"
import adminLoginSlice from './features/adminPageSlices/adminLoginSlice.js'
export default configureStore({
  reducer: {
    register: registerReducer,
    shopStatus: shopStatusReducer,
    booking: dailyBookingReducer,
    adminLogin : adminLoginSlice
  },
})