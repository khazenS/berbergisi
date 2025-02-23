import { configureStore } from '@reduxjs/toolkit'
import registerReducer from "../redux/features/mainPageSlices/registerSlice.js"
import shopStatusReducer from './features/adminPageSlices/shopStatusSlice.js'
import dailyBookingReducer from "../redux/features/mainPageSlices/dailyBookingSlice.js"
import adminLoginSlice from './features/adminPageSlices/adminLoginSlice.js'
import adminDailyBookingSlice from './features/adminPageSlices/adminDailyBookingSlice.js'
import fastOpsSlice from './features/adminPageSlices/fastOpsSlice.js'
import shopSettingsSlice from './features/adminPageSlices/shopSettingsSlice.js'
import showMessageSlice from './features/mainPageSlices/showMessageSlice.js'
import shopStatsSlice from './features/adminPageSlices/shopStatsSlice.js'
import notificationSlice from './features/adminPageSlices/notificationSlice.js'
export default configureStore({
  reducer: {
    register: registerReducer,
    shopStatus: shopStatusReducer,
    booking: dailyBookingReducer,
    adminLogin : adminLoginSlice,
    adminBooking : adminDailyBookingSlice,
    fastOps : fastOpsSlice,
    shopSettings: shopSettingsSlice,
    showMessage : showMessageSlice,
    shopStats:shopStatsSlice,
    notification:notificationSlice
  },
})