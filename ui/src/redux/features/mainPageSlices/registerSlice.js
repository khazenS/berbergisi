import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import registerControl from "../../../helpers/registerControl.js";
import axios from 'axios'
import { encryptData } from "../../../helpers/cryptoProcess.js";
let initialState = {
    values:{
        name:"",
        phoneNumber:"",
        cutValue:"cut",
        comingWithValue:"",
        errors: []
    }
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
          }
    },
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state)=>{
            state.isLoading=true
        })
        builder.addCase(registerUser.fulfilled, (state,action)=>{
            state.isLoading=false
        })
    }
})

export const {updateRegisterState,controlForFetch} = registerSlice.actions

export default registerSlice.reducer