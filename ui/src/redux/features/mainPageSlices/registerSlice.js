import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import registerControl from "../../../helpers/registerControl.js";
import axios from 'axios'
let initialState = {
    values:{
        name:"",
        phoneNumber:"",
        cutValue:"cut",
        comingWithValue:"one",
        errors:[],
    }

}

export const registerUser = createAsyncThunk('registerUser', async ()=>{
    const response = axios.post()
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
    }
})

export const {setRegisterState,controlForFetch} = registerSlice.actions

export default registerSlice.reducer