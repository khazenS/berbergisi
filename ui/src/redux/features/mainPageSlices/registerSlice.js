import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'
import { encryptData } from "../../../helpers/cryptoProcess.js";

let initialState = {
    values:{
        name:"",
        phoneNumber:"",
        serviceID:null,
        comingWithValue:1,
        errors: []
    },
    queueToken:{
        token:null,
        isLoading:false
    },
    registerReqError:false,
    registerErrMessage:'',
    totalReqError:false,
    errors:false
}

export const registerUser = createAsyncThunk('registerUser', async (values)=>{
    const data = {
        name : values.name,
        phoneNumber : values.phoneNumber,
        serviceID:values.serviceID,
        comingWithValue: values.comingWithValue,
        isVerified: values.token ? true : false,
        token: values.token ? values.token : null
    }   
    const response = await axios.post(process.env.REACT_APP_SERVER_URL+'public/register-user',{
        type:'crypted',
        data: encryptData(data)
    })
    return response.data

})

export const checkQueueToken = createAsyncThunk('checkQueueToken', async (token) => {
    const response = await axios.post(process.env.REACT_APP_SERVER_URL+'public/check-queue-token',{
        queueToken: token
    })

    return response.data
})

export const cancelQue = createAsyncThunk('cancelQue', async (token) => {
    const response = await axios.post(process.env.REACT_APP_SERVER_URL+'public/cancel-queue',{
       queueToken: token
    })
    return response.data
})


export const registerSlice = createSlice({
    name:'registerSlice',
    initialState,
    reducers:{
        updateRegisterState: (state, action) => {
            const { nameType, value } = action.payload;
            state.values[nameType] = (nameType !== 'name') ? Number(value) : value;
        },
        resetQueueToken : (state) => {
            state.queueToken.token = null
        },
        resetReqError : (state) => {
            state.registerReqError = false
            state.registerErrMessage = ''
        },
        setServiceID: (state,action) => {
            state.values.serviceID = action.payload
        },
        resgisterResetTRE: (state,action) => {
            state.totalReqError = false
        }

    },
    extraReducers: (builder) => {
        // registerUser processes
        builder.addCase(registerUser.pending, (state)=>{
            state.errors = false
        })
        builder.addCase(registerUser.fulfilled, (state,action)=>{
            if(action.payload.status == false){
                state.registerErrMessage = action.payload.message
                state.registerReqError = true
            } 
            else{
                state.values.serviceID = null
                state.values.comingWithValue = 1

                state.queueToken.token = action.payload.queueToken
                localStorage.setItem('queueToken',action.payload.queueToken)                  
            }
        })
        builder.addCase(registerUser.rejected, (state) => {
            console.log('registerUser error alert!')
            state.errors = true
        })
        // checkQueueToken processes
        builder.addCase(checkQueueToken.pending , (state) => {
            state.queueToken.isLoading = true
            state.errors = false
        })
        builder.addCase(checkQueueToken.fulfilled , (state,action) => {
            if(action.payload.request_error && action.payload.reqErrorType == 'total') state.totalReqError = true
            else{
                if(action.payload.status === true){
                    state.queueToken.token = action.payload.queueToken
                }
                state.queueToken.isLoading = false
            }
            
            
        })
        builder.addCase(checkQueueToken.rejected , (state) => {
            state.errors = true
            console.log('checkQueueToken was rejected.')
        })

        // cancelQue processes
        builder.addCase(cancelQue.pending,(state) => {
            state.errors = false
        })
        builder.addCase(cancelQue.fulfilled,(state,action) =>{
            if(action.payload.request_error && action.payload.reqErrorType == 'total') state.totalReqError = true
            else{
                state.queueToken.token = null
                localStorage.removeItem('queueToken')                
            }
        })
        builder.addCase(cancelQue.rejected,(state) => {
            state.errors = true
            console.log('Error at cancelQue part')
        })
    }
})

export const {updateRegisterState,resetQueueToken,resetReqError,setServiceID,resgisterResetTRE} = registerSlice.actions
export default registerSlice.reducer