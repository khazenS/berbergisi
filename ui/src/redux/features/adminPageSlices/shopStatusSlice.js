// This is for shop is open or close 
import { createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
let initialState = {
    status:null,
    defineRequest:{
        isLoading:null,
        error:false
    },    
    changeRequest:{
        isLoading:null,
        error:false,
    },
    expiredError:false
    
}

export const controlAdminAccessToken = createAsyncThunk('controlAdminAccessToken',async () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWRtaW4iLCJleHBpcmVzVGltZSI6IjF3IiwiaWF0IjoxNzIyNTkxNzc2LCJleHAiOjE3MjMxOTY1NzZ9._da5AUZ8dD_QHrOtdihSsPG0-oey9dyry0-0ByHZv40'
    const response = await axios.get(process.env.REACT_APP_SERVER_URL+'admin/controlAdminAccessToken',{headers:{'Authorization': `Bearer ${token}`}})
    return response.data
})

export const changeStatus = createAsyncThunk('changeStatus',async (statusData)=>{
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWRtaW4iLCJleHBpcmVzVGltZSI6IjF3IiwiaWF0IjoxNzIyNTkxNzc2LCJleHAiOjE3MjMxOTY1NzZ9._da5AUZ8dD_QHrOtdihSsPG0-oey9dyry0-0ByHZv40'
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
    reducers:{},
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
            state.changeRequest.expiredError = false
            state.changeRequest.isLoading = true
            state.changeRequest.error = false
        })
        builder.addCase(changeStatus.fulfilled, (state,action)=>{
            state.status = action.payload.newStatus
            if(action.payload.status === false){
                state.expiredError = true
            }
            state.changeRequest.isLoading =false
        })
        builder.addCase(changeStatus.rejected,(state)=>{
            state.changeRequest.error = true
            state.changeRequest.isLoading = false
        })

        // Token control processes 
        builder.addCase(controlAdminAccessToken.pending, (state)=>{
            state.expiredError = false
            state.defineRequest.isLoading = true
        })
        builder.addCase(controlAdminAccessToken.fulfilled, (state,action)=>{
            if(action.payload.status === false && action.payload.message === "Token is not valid or expired!"){
                state.expiredError = true
            }
            state.defineRequest.isLoading =false
        })
    }
})

export default shopStatusSlice.reducer