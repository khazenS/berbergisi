import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import registerControl from "../../../helpers/registerControl.js";
import axios from 'axios'
import { encryptData } from "../../../helpers/cryptoProcess.js";
let initialState = {
    values:{
        name:"",
        phoneNumber:"",
        cutValue:"cut",
        comingWithValue:"one",
        errors: []
    }
}

export const registerUser = createAsyncThunk('registerUser', async (state)=>{
    const response = await axios.post('http://localhost:3001/api/public/register-user',{
        type:'crypted',
        data: encryptData(state)
    })
    return response.data

})


export const registerSlice = createSlice({
    name:'registerSlice',
    initialState,
    reducers:{
        updateRegisterState: (state,action) => {
            state = current(state)
            let newState = { ...state }
            let name = action.payload.nameType
            let value = action.payload.value
            if(name === "phoneNumber"){value = Number(value)}
            const updatedValues = { ...newState.values, [name] : value , errors:[]  }
            return {
                ...newState,
                values:{
                    ...updatedValues
                }
            }
        },
        controlForFetch: (state) =>{
            state = current(state)
            let newState = { ...state }
            let updatedValues = { ...state.values }
            const newErrors = registerControl(updatedValues) 

            return {
                ...newState,
                values:{
                    ...updatedValues,
                    errors:newErrors
                }
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state)=>{
            state.isLoading=true
        })
        builder.addCase(registerUser.fulfilled, (state)=>{
            state.isLoading=false
        })
    }
})

export const {updateRegisterState,controlForFetch} = registerSlice.actions

export default registerSlice.reducer