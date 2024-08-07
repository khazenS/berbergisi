import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import registerControl from "../../../helpers/registerControl.js";
import axios from 'axios'
import { encryptData } from "../../../helpers/cryptoProcess.js";
import { decryptData } from "../../../helpers/cryptoProcess";
import { socket } from "../../../helpers/socketio.js";
let initialState = {
    values:{
        name:"",
        phoneNumber:"",
        cutValue:"cut",
        comingWithValue:1,
        errors: []
    },
    userDatas: null,
    queueToken:{
        token:null,
        isLoading:false
    },
    errors:false
}

export const registerUser = createAsyncThunk('registerUser', async (values)=>{
    const data = {
        name : values.name,
        phoneNumber : values.phoneNumber,
        cutType:values.cutValue,
        comingWithValue: values.comingWithValue
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

// This is for new user register or updating exist user with name and returning token
export const registerSlice = createSlice({
    name:'registerSlice',
    initialState,
    reducers:{
        updateRegisterState: (state, action) => {
            const { nameType, value } = action.payload;
            state.values[nameType] = (nameType === 'phoneNumber' || nameType === 'comingWithValue') ? Number(value) : value;
            state.values.errors = []; // errors'u boş bir array olarak resetlemek için
          },
          controlForFetch: (state) => {
            const newErrors = registerControl(state.values);
            state.values.errors = newErrors;
          },
          resetUserDatas : (state) => {
            state.userDatas = null
          },
          resetQueueToken : (state) => {
            state.queueToken.token = null
          }
    },
    extraReducers: (builder) => {
        // registerUser processes
        builder.addCase(registerUser.pending, (state)=>{
            state.errors = false
        })
        builder.addCase(registerUser.fulfilled, (state,action)=>{
            state.userDatas = decryptData(action.payload.userDatas)
            state.queueToken.token = action.payload.queueToken
            localStorage.setItem('queueToken',action.payload.queueToken)
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
            if(action.payload.status === true){
                state.queueToken.token = action.payload.queueToken
            }
            state.queueToken.isLoading = false
            
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
            if(action.payload.status === true){
                state.queueToken.token = null
                localStorage.removeItem('queueToken')
                socket.emit('cancel-que', action.payload.userBookingID)
            }else{
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

export const {updateRegisterState,controlForFetch,resetUserDatas,resetQueueToken} = registerSlice.actions

export default registerSlice.reducer