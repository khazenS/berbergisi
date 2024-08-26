import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { decryptData } from "../../../helpers/cryptoProcess"
import { socket } from "../../../helpers/socketio"

const initialState = {
    isLoading : false,
    error : false,
    fastName : '',
    expiredError:false,
    changeAmount:0
}

export const registerFastUser = createAsyncThunk('registerFastUser', async (name) => {
    const localToken = localStorage.getItem('adminAccessToken')
    const response = await axios.post(process.env.REACT_APP_SERVER_URL+'admin/fast-register',{
        name:name
    },{headers:{'Authorization': `Bearer ${localToken}`}})
    return response.data
})

export const increaseAmount = createAsyncThunk('increaseAmount',async (amount) => {
    const localToken = localStorage.getItem('adminAccessToken')
    const response = await axios.post(process.env.REACT_APP_SERVER_URL+'admin/increase-amount',{
        amount
    },{headers:{'Authorization': `Bearer ${localToken}`}})

    return response.data
})

export const decreaseAmount = createAsyncThunk('decreaseAmount',async (amount) => {
    const localToken = localStorage.getItem('adminAccessToken')
    const response = await axios.post(process.env.REACT_APP_SERVER_URL+'admin/decrease-amount',{
        amount
    },{headers:{'Authorization': `Bearer ${localToken}`}})

    return response.data
})

export const fastOpsSlice = createSlice({
    name:'fastOpsSlice',
    initialState,
    reducers : {
        updateFastName : (state,action) => {
            state.fastName = action.payload
        },
        updateAmount : (state,action) => {
            state.changeAmount = action.payload
        },
        resetFastOpsExpiredError : (state) => {
            state.expiredError = false
        }
    },
    extraReducers : (builder) => {
        // registerFastUser processes
        builder.addCase(registerFastUser.pending, (state) => {
            state.isLoading = true
            state.error = false
        })
        builder.addCase(registerFastUser.fulfilled, (state,action) => {
            if(action.payload.status === true){ 
                socket.emit('fastUser-register',{fastUserDatas: decryptData(action.payload.fastUserDatas)})
            }else{ 
                console.log('expired error') 
                state.expiredError = true 
            }
            state.isLoading = false
        })
        builder.addCase(registerFastUser.rejected, (state) => {
            state.error = true
            console.log('Error on registerFastUser()')
        })
        // increaseAmoount processes
        builder.addCase(increaseAmount.pending,(state) => {
            state.isLoading = true
            state.error = false
        })
        builder.addCase(increaseAmount.fulfilled,(state,action) => {
            if(action.payload.status === true){
                console.log('increased amount!')
            }else{
                state.expiredError = true
            }
            state.isLoading = true
        })
        builder.addCase(increaseAmount.rejected,(state) => {
            state.error = true
            console.log('Error on increaseAmount')
        })
        // decreaseAmount processes
        builder.addCase(decreaseAmount.pending,(state) => {
            state.isLoading = true
            state.error = false
        })
        builder.addCase(decreaseAmount.fulfilled,(state,action) => {
            if(action.payload.status === true){
                console.log('decreased amount!')
            }else{
                state.expiredError = true
            }
            state.isLoading = true
        })
        builder.addCase(decreaseAmount.rejected,(state) => {
            state.error = true
            console.log('Error on decreaseAmount')
        })
    }
})

export const {updateFastName,updateAmount,resetFastOpsExpiredError} = fastOpsSlice.actions
export default fastOpsSlice.reducer