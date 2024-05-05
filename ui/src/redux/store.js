import { configureStore } from '@reduxjs/toolkit'
import registerReducer from "../redux/features/mainPageSlices/registerSlice.js"

export default configureStore({
  reducer: {
    register: registerReducer,
  },
})