import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'
import { decryptData } from "../../../helpers/cryptoProcess";
let initialState  = {
    shopStatus: null,
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

// Get shop status
export const getShopStatus = createAsyncThunk('getShopStatus', async () => {
    const response = await axios.get(process.env.REACT_APP_SERVER_URL+'public/getShopStatus')
    return response.data
})


export const dailyBookingSlice = createSlice({
    name: 'dailyBookingSlice',
    initialState,
    reducers:{
        newUserToQue : (state,action) => {
            state.dailyQueue.push({
                name:action.payload.name,
                cutType:action.payload.cutType,
                comingWith:action.payload.comingWith,
                userBookingID:action.payload.userBookingID,
                phoneNumber:action.payload.phoneNumber
            })
        },
        resetDailyQueue : (state) => {
            state.dailyQueue = null
        },
        removeUserFromQue : (state,action) => {
            state.dailyQueue = state.dailyQueue.filter( user => user.userBookingID !== action.payload)
        },
        upMove : (state,action) => {
            const currentIndex = action.payload
            const temp = state.dailyQueue[currentIndex - 1]

            state.dailyQueue[currentIndex - 1] = state.dailyQueue[currentIndex]
            state.dailyQueue[currentIndex] = temp
        },
        downMove : (state,action) => {
            const currentIndex = action.payload
            const temp = state.dailyQueue[currentIndex + 1]

            state.dailyQueue[currentIndex + 1] = state.dailyQueue[currentIndex]
            state.dailyQueue[currentIndex] = temp
        }
    },
    extraReducers: (builder) => {
        // Actions of getShopStatus
        builder.addCase(getShopStatus.pending,(state) => {
            state.isLoading = true
            state.error = false
        })
        builder.addCase(getShopStatus.fulfilled,(state,action) => {
            state.shopStatus = action.payload.shopStatus
            state.isLoading = false
        })
        builder.addCase(getShopStatus.rejected,(state) => {
            state.error = true
            console.error('Error on getShopStatus')
        })
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
    }
})

export const {newUserToQue,resetDailyQueue,removeUserFromQue,upMove,downMove} = dailyBookingSlice.actions
export default dailyBookingSlice.reducer