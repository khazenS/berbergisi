import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { decryptData } from "../../../helpers/cryptoProcess"


let initialState = {
    dailyQueue : null,
    isLoading : true,
    error : false,
    expiredError:false
}

export const getDailyBookingAdmin = createAsyncThunk('getDailyBookingAdmin',async () => {
    const token = localStorage.getItem('adminAccessToken')
    const response = await axios.get(process.env.REACT_APP_SERVER_URL+'admin/get-dailyBooking',{headers:{'Authorization': `Bearer ${token}`}})
    
    return response.data
})

export const removeUserFromAdminQue = createAsyncThunk('removeUserFromAdminQue',async (userBookingID) => {
    const token = localStorage.getItem('adminAccessToken')
    const response = await axios.delete(process.env.REACT_APP_SERVER_URL+`admin/delete-user-admin-que/${userBookingID}`,{headers:{'Authorization': `Bearer ${token}`}})
    return response.data
}) 


export const cutFinished = createAsyncThunk('cutFinished', async (userBookingID) => {
    const localToken = localStorage.getItem('adminAccessToken')
    const response = await axios.put(process.env.REACT_APP_SERVER_URL+`admin/finish-cut/${userBookingID}`,{},{headers:{'Authorization': `Bearer ${localToken}`}})
    return response.data
})

export const upMoveReq = createAsyncThunk('upMoveReq', async (index) => {
    const localToken = localStorage.getItem('adminAccessToken')
    const response = await axios.put(process.env.REACT_APP_SERVER_URL+'admin/up-move',{
        index
    },{headers:{'Authorization': `Bearer ${localToken}`}})

    return response.data
})

export const downMoveReq = createAsyncThunk('downMoveReq', async (index) => {
    const localToken = localStorage.getItem('adminAccessToken')
    const response = await axios.put(process.env.REACT_APP_SERVER_URL+'admin/down-move',{
        index
    },{headers:{'Authorization': `Bearer ${localToken}`}})

    return response.data
})


export const adminDayBookingSlice = createSlice({
    name:'adminDayBookingSlice',
    initialState,
    reducers:{
        resetDailyQueue: (state) => {
            state.dailyQueue = null
        },
        addNewUser: (state,action) => {
            state.dailyQueue.push({
                name:action.payload.name,
                service:action.payload.service,
                phoneNumber:action.payload.phoneNumber,
                comingWith:action.payload.comingWith,
                userBookingID:action.payload.userBookingID,
                shownDate:action.payload.shownDate,
                isVerified: action.payload.isVerified
            })
        },
        cancelUserFromAdminQue : (state,action) => {
            state.dailyQueue = state.dailyQueue.filter( user => user.userBookingID !== action.payload)
        },
        resetCancelExpiredError: (state) => {
            state.expiredError = false
        }
    },
    extraReducers : (builder) => {
        // getDailyBookingAdmin processes
        builder.addCase(getDailyBookingAdmin.pending,(state) => {
            state.isLoading = true
            state.error = false
        })
        builder.addCase(getDailyBookingAdmin.fulfilled, (state,action) => {
            state.dailyQueue = decryptData(action.payload.dailyQue)
            state.isLoading=false
        })
        builder.addCase(getDailyBookingAdmin.rejected,(state) => {
            state.error = true
            console.log('Error on getDailyBookingAdmin()')
        })


        // removeUserFromAdminQue processes
        builder.addCase(removeUserFromAdminQue.pending,(state) => {
            state.isLoading = true
            state.error = false
        })
        builder.addCase(removeUserFromAdminQue.fulfilled,(state,action) => {
           if(action.payload.status === true){
                state.dailyQueue = state.dailyQueue.filter( user => user.userBookingID !== action.payload.userBookingID)
            }else{
                state.expiredError = true
           }
            state.isLoading = false
        })
        builder.addCase(removeUserFromAdminQue.rejected,(state) => {
            state.error = true
            state.isLoading = false
        })


        // cutFinished processes
        builder.addCase(cutFinished.pending, (state) => {
            state.isLoading = true
            state.error = false
        })
        builder.addCase(cutFinished.fulfilled, (state,action) => {
            if(action.payload.status === true){
                state.dailyQueue = state.dailyQueue.filter( user => user.userBookingID !== action.payload.userBookingID)
            }else{
                state.expiredError = true
            }
            state.isLoading = false
        })
        builder.addCase(cutFinished.rejected, (state) => {
            state.error = true
            state.isLoading = false
            console.log('Error on cutFinished')
        })


        // up move request processes
        builder.addCase(upMoveReq.pending, (state) => {
            state.isLoading = true
            state.error=false
        })
        builder.addCase(upMoveReq.fulfilled, (state,action) => {
            if(action.payload.status === true){
                const currentIndex = action.payload.index
                const temp = state.dailyQueue[currentIndex - 1]
    
                state.dailyQueue[currentIndex - 1] = state.dailyQueue[currentIndex]
                state.dailyQueue[currentIndex] = temp
            }else{
                state.expiredError = true
            }
            state.isLoading = false
        })
        builder.addCase(upMoveReq.rejected, (state) => {
            state.error =  true
            console.log('Error on upMoveReq')
        }) 

        
        // down move request processes
        builder.addCase(downMoveReq.pending, (state) => {
            state.isLoading = true
            state.error=false
        })
        builder.addCase(downMoveReq.fulfilled, (state,action) => {
            if(action.payload.status === true){
                const currentIndex = action.payload.index
                const temp = state.dailyQueue[currentIndex + 1]
    
                state.dailyQueue[currentIndex + 1] = state.dailyQueue[currentIndex]
                state.dailyQueue[currentIndex] = temp
            }else{
                state.expiredError = true
            }
            state.isLoading = false
        })
        builder.addCase(downMoveReq.rejected, (state) => {
            state.error =  true
            console.log('Error on downMoveReq')
        }) 
    }
})

export const {resetDailyQueue,addNewUser,cancelUserFromAdminQue,resetCancelExpiredError} = adminDayBookingSlice.actions
export default adminDayBookingSlice.reducer