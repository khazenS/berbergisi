// This is for shop is open or close 
import { createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import { socket } from "../../../helpers/socketio";
let initialState = {
    status:null,
    defineRequest:{
        isLoading:false,
        error:false
    },    
    changeRequest:{
        isLoading:false,
        error:false,
    },
    expiredError:false,
    value:0
}


export const changeStatus = createAsyncThunk('changeStatus',async (statusData)=>{
    const token = localStorage.getItem('adminAccessToken')
    const response = await axios.post(process.env.REACT_APP_SERVER_URL+'admin/change-status',{statusData},{headers:{'Authorization': `Bearer ${token}`}})
    return response.data
})

export const defineStatus = createAsyncThunk('defineStatus', async ()=>{
    const response = await axios.get(process.env.REACT_APP_SERVER_URL+'public/shopStatus')
    return response.data
})


export const shopStatusSlice = createSlice({
    name:'shopStatusSlice',
    initialState,
    reducers:{
        resetShopStatusExpiredError : (state) => {
            state.expiredError = false
        }
    },
    extraReducers: (builder) =>{
        //defineStatus processes
        builder.addCase(defineStatus.pending, (state)=>{
            state.defineRequest.isLoading = true
            state.defineRequest.error = false
        })
        builder.addCase(defineStatus.fulfilled, (state,action)=>{
            state.status = action.payload.shopStatus
            state.defineRequest.isLoading =false
        })
        builder.addCase(defineStatus.rejected,(state)=>{
            state.defineRequest.error = true
            state.defineRequest.isLoading = false
        })

        //changeStatus processes
        builder.addCase(changeStatus.pending, (state)=>{
            state.changeRequest.isLoading = true
            state.changeRequest.error = false
        })
        builder.addCase(changeStatus.fulfilled, (state,action)=>{
            if(action.payload.status === false && action.payload.errorType === 'admin access token'){
                state.expiredError = true
            }else{
               state.status = action.payload.newStatus
               socket.emit('changeStatus', {status: state.status , lastDayStats : action.payload.lastDayStats });
            }
            state.changeRequest.isLoading =false
            
        })
        builder.addCase(changeStatus.rejected,(state)=>{
            state.changeRequest.error = true
            state.changeRequest.isLoading = false
        })
    }
})

export const {resetShopStatusExpiredError} = shopStatusSlice.actions
export default shopStatusSlice.reducer