import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'
import { decryptData } from "../../../helpers/cryptoProcess";
let initialState  = {
    isLoading : false,
    dailyQueue : null,
    dayBookingID : null,
    error:false
}

// Create or get daily booking for show it
export const getBooking = createAsyncThunk('getBooking',async () => {
    const response = await axios.get(process.env.REACT_APP_SERVER_URL+'public/get-dailyBooking')
    return response.data
})

// Closing daily booking on database 
export const closeDayBooking = createAsyncThunk('closeDayBooking', async () => {
    const response = await axios.get(process.env.REACT_APP_SERVER_URL+'public/close-dailyBooking')
    return response.data
})

export const dailyBookingSlice = createSlice({
    name: 'dailyBookingSlice',
    initialState,
    reducers:{
        increaseQueue : (state,action) => {
            console.log(action.payload)
            state.dailyQueue.push(1)
        }
    },
    extraReducers: (builder) => {
        // processes getBooking()
        builder.addCase(getBooking.pending , (state) => {
            state.error = false
            state.isLoading = true
        })
        builder.addCase(getBooking.fulfilled , (state,action) => {
            state.dailyQueue = decryptData(action.payload.dailyQue)
            state.dayBookingID = decryptData(action.payload.dayBookingID)
            state.isLoading = false
            
        })
        builder.addCase(getBooking.rejected , (state) => {
            state.error = true
            console.log('Rejedted from getBooking request!')
        })
        // processes closeDayBooking()
        builder.addCase(closeDayBooking.pending,(state) => {
            state.isLoading = true
        })
        builder.addCase(closeDayBooking.fulfilled,(state) => {
            state.isLoading = false
        })
        builder.addCase(closeDayBooking.rejected,(state) => {
            state.error = true
            console.log('Rejedted from closeDayBooking request!')
        })
    }
})

export const {increaseQueue} = dailyBookingSlice.actions
export default dailyBookingSlice.reducer