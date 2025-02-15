import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const initialState = {
    isLoading : false,
    error : false,
    message : null,
    totalReqError:false
}

export const getMessage = createAsyncThunk('getMessage', async () => {
    const response = await axios.get(process.env.REACT_APP_SERVER_URL+'public/get-message')
    return response.data
})

export const showMessageSlice = createSlice({
    name : 'showMessageSlice',
    initialState,
    reducers: {
        updateMessage : (state,action) => {
            state.message = action.payload
        },
        messageResetTRE: (state,action) => {
            state.totalReqError = false
        }
    },
    extraReducers : (builder) => {
        builder.addCase(getMessage.pending , (state) => {
            state.isLoading = true
            state.error = false
        })
        builder.addCase(getMessage.fulfilled , (state,action) => {
            if(action.payload.request_error && action.payload.reqErrorType == 'total'){
                state.totalReqError = true
            }else{
                state.message = action.payload.message
                state.isLoading = false                
            }
        })
        builder.addCase(getMessage.rejected , (state) => {
            state.error = true
            state.isLoading = false
        })
    }
})

export const {updateMessage,messageResetTRE} = showMessageSlice.actions
export default showMessageSlice.reducer