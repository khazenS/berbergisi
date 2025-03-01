import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const initialState = {
    subscription : {
        isLoading : false,
        error:false,
        value:null
    },
    fcmToken : {
        isLoading : false,
        error : false,
        value : null
    },
    expiredError:false
}

export const subscribeUserToNotification = createAsyncThunk('subscribeUserToNotification',async (_,{rejectWithValue}) => {
    const adminAccessToken = localStorage.getItem('adminAccessToken')
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly:true,
        applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC
    })
    const response = await axios.post(process.env.REACT_APP_SERVER_URL+'admin/subscribe-notification',{
        subscription
    },{headers:{'Authorization': `Bearer ${adminAccessToken}`}})   
    return response.data
})


export const notificationSlice = createSlice({
    name:'notificationSlice',
    initialState,
    reducers:{
        resetNotificationExpiredError : (state) => {
            state.expiredError = false
        }
    },
    extraReducers: (builder) => {
        builder.addCase(subscribeUserToNotification.pending,(state) => {
            state.subscription.isLoading = true
            state.subscription.error = false
        })
        builder.addCase(subscribeUserToNotification.fulfilled, (state,action) => {
            if(action.payload.status === false){
                state.expiredError = true
            }
            console.log(action.payload)
            state.subscription.isLoading = false
        })
        builder.addCase(subscribeUserToNotification.rejected, (state,action) => {
            state.subscription.isLoading = false
            state.subscription.error = true
            console.error('Error on subscribeUserToNotification(). ' + action.payload)
        }
        )
    }
})

export const { resetNotificationExpiredError} = notificationSlice.actions
export default notificationSlice.reducer