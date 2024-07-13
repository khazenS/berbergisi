import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import registerControl from "../../../helpers/registerControl.js";
import axios from 'axios'
let initialState = {
    values:{
        name:"",
        phoneNumber:"",
        cutValue:"cut",
        comingWithValue:"one",
        errors:[]
    }
}

export const registerUser = createAsyncThunk('registerUser', async ()=>{
    const response = await axios.get('http://localhost:3001/api/public')
    return response.data
})


export const registerSlice = createSlice({
    name:'registerSlice',
    initialState,
    reducers:{
        setRegisterState: (state,action) => {
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
        builder.addCase(registerUser.pending, (state,action)=>{
            state.isLoading=true
        })
        builder.addCase(registerUser.fulfilled, (state,action)=>{
            state.isLoading=false
            state.data = action.payload
        })
    }
})

export const {setRegisterState,controlForFetch} = registerSlice.actions

export default registerSlice.reducer