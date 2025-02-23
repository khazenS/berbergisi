import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

let initialState = {
    isLoading : false,
    adminDatas : {
        username : null,
        password : null
    },
    error : false,
    isLogin:false,
    expiredError:false,
    wrongInputs:false,
    totalReqError:false
}

//Admin Login request to server
export const adminLogin = createAsyncThunk('adminLogin', async (adminDatas) => {
    const response = await axios.post(process.env.REACT_APP_SERVER_URL+'public/admin-login',{
        username:adminDatas.username,
        password:adminDatas.password
    })

    return response.data
})

export const controlAdminAccessToken = createAsyncThunk('controlAdminAccessToken',async () => {
    const token = localStorage.getItem('adminAccessToken')
    const response = await axios.get(process.env.REACT_APP_SERVER_URL+'admin/controlAdminAccessToken',{headers:{'Authorization': `Bearer ${token}`}})
    return response.data
})

export const adminLoginSlice = createSlice({
    name:'adminLoginSlice',
    initialState,
    reducers: {
        updateUsername: (state,action) => {
            state.adminDatas.username = action.payload
            state.wrongInputs = false
        },
        updatePassword: (state,action) => {
            state.adminDatas.password = action.payload
            state.wrongInputs = false
        },
        resetAdminDatas : (state) => {
            state.adminDatas.username = null
            state.adminDatas.password = null
        },
        resetExpiredError : (state) => {
            state.expiredError = false
        },
        resetTotalReqError : (state) => {
            state.totalReqError = false
        }
    },
    extraReducers : (builder) => {
        // adminLogin processes
        builder.addCase(adminLogin.pending, (state)=>{
            state.isLoading = true
            state.error = false
        })
        builder.addCase(adminLogin.fulfilled, (state,action) => {
            if(action.payload.request_error == true) state.totalReqError = true
            else{
                if(action.payload.status === true){
                    localStorage.setItem('adminAccessToken',action.payload.adminAccessToken)
                    state.isLogin = true
                }else{
                    state.wrongInputs = true
                }                
            }
        })
        builder.addCase(adminLogin.rejected,(state) => {
            state.error = true
            console.log('Error adminLogin')
        })
        // Token control processes
        builder.addCase(controlAdminAccessToken.pending, (state)=>{
            state.isLoading = true
        })
        builder.addCase(controlAdminAccessToken.fulfilled, (state,action)=>{
            if(action.payload.status === false && action.payload.errorType === "admin access token"){
                state.expiredError = true
            }
            state.isLoading = false
            state.isLogin = false
            
        })
        builder.addCase(controlAdminAccessToken.rejected, (state) => {
            state.error = true
            console.error('Error on controlAccessToken')
        })
    }
})

export const {updatePassword,updateUsername,resetExpiredError,resetAdminDatas,resetTotalReqError} = adminLoginSlice.actions
export default adminLoginSlice.reducer