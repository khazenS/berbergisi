// This is for shop is open or close 
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
let initialState = {
    status:null,
    defineRequest:{
        isLoading:null,
        error:false
    },    
    changeRequest:{
        isLoading:null,
        error:false
    }
    
}

export const changeStatus = createAsyncThunk('changeStatus',async (statusData,adminAccessToken)=>{
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWRtaW4iLCJleHBpcmVzVGltZSI6IjF3IiwiaWF0IjoxNzIwNjgzNjMyLCJleHAiOjE3MjEyODg0MzJ9.0LOPDbwM1yXxR1CFP3VnN63DzsrB79CaVQTbkmCUWBY'
    const response = await axios.post('http://localhost:3001/api/admin/change-status',statusData,{headers:{'Authorization': `Bearer ${token}`}})
    return response.data
})

export const defineStatus = createAsyncThunk('defineStatus', async ()=>{
    const response = await axios.get('http://localhost:3001/api/public/shopStatus')
    return response.data
})


export const shopStatusSlice = createSlice({
    name:'shopStatusSlice',
    initialState,
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
            //change process
            if(state.status === true){state.status = false}
            else{state.status = true}
            state.changeRequest.isLoading =false
        })
        builder.addCase(changeStatus.rejected,(state)=>{
            state.changeRequest.error = true
            state.changeRequest.isLoading = false
        })
    }
})

export default shopStatusSlice.reducer