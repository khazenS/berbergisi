import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { getFCMToken } from "../../../helpers/firebase"

const initialState = {
    notificationPermission : {
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

export const updateFCMToken = createAsyncThunk('updateFCMToken',async (_,{rejectWithValue}) => {
    let fcm_token
    try{
        fcm_token = await getFCMToken()        
    }catch{
        fcm_token = null
    }

    const token = localStorage.getItem('adminAccessToken')
    const response = await axios.post(process.env.REACT_APP_SERVER_URL+'admin/update-fcm-token',{
        fcm_token
    },{headers:{'Authorization': `Bearer ${token}`}})
    return response.data        
})

export const send_message = createAsyncThunk('send-message',async () => {
    const response = await axios.get('http://localhost:3001/api/public/send-message')
    return response.data
})

export const notificationSlice = createSlice({
    name:'notificationSlice',
    initialState,
    reducers:{
        changeNotificationPermission : (state,action) => {
            state.notificationPermission.value = false
            state.fcmToken.value = null
        },
        resetNotificationExpiredError : (state) => {
            state.expiredError = false
        }
    },
    extraReducers: (builder) => {
        builder.addCase(updateFCMToken.pending,(state) => {
            state.isLoading = true
            state.error = false
        })
        builder.addCase(updateFCMToken.fulfilled, (state,action) => {
            if(action.payload.status === false){
                state.expiredError = true
            }
            state.isLoading = false
        })
        builder.addCase(updateFCMToken.rejected,(state,action) => {
            state.isLoading = false
            state.error = true
            console.error('Error on updateFCMToken(). ' + action.payload)
        })
    }
})

export const { changeNotificationPermission , resetNotificationExpiredError} = notificationSlice.actions
export default notificationSlice.reducer