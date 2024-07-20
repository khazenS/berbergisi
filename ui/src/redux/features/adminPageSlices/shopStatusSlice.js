// This is for shop is open or close 
import { createAsyncThunk, createSlice, current} from "@reduxjs/toolkit";
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
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWRtaW4iLCJleHBpcmVzVGltZSI6IjF3IiwiaWF0IjoxNzIxMjE0NjI0LCJleHAiOjE3MjE4MTk0MjR9.e5NnX7BTWEJuUwgqhW9M7c3zNl-4kKpZ0bsCsB30vm4'
    const response = await axios.get('http://192.168.1.47:3001/api/admin/controlAdminAccessToken',{headers:{'Authorization': `Bearer ${token}`}})
    return response.data
})

export const changeStatus = createAsyncThunk('changeStatus',async (statusData)=>{
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWRtaW4iLCJleHBpcmVzVGltZSI6IjF3IiwiaWF0IjoxNzIxMjE0NjI0LCJleHAiOjE3MjE4MTk0MjR9.e5NnX7BTWEJuUwgqhW9M7c3zNl-4kKpZ0bsCsB30vm4'
    const response = await axios.post('http://192.168.1.47:3001/api/admin/change-status',{statusData},{headers:{'Authorization': `Bearer ${token}`}})
    return response.data
})

export const defineStatus = createAsyncThunk('defineStatus', async ()=>{
    const response = await axios.get('http://192.168.1.47:3001/api/public/shopStatus')
    return response.data
})


export const shopStatusSlice = createSlice({
    name:'shopStatusSlice',
    initialState,
    reducers:{
        changeStatusReducer: (state)=>{
            state = current(state)
            let newState = { ...state }
            let newStatus = state.status === true ? false : true
            return {
                ...newState, 
                'status' : newStatus
            }
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
            state.changeRequest.expiredError = false
            state.changeRequest.isLoading = true
            state.changeRequest.error = false
        })
        builder.addCase(changeStatus.fulfilled, (state,action)=>{
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
            if(action.payload.status === false){
                state.expiredError = true
            }
            state.defineRequest.isLoading =false
        })
    }
})

export const {changeStatusReducer} = shopStatusSlice.actions
export default shopStatusSlice.reducer