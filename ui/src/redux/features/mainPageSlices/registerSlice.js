import { createSlice, current } from "@reduxjs/toolkit";
import registerControl from "../../../helpers/registerControl.js";

let initialState = {
    values:{
        name:"",
        phoneNumber:"",
        cutValue:"cut",
        comingWithValue:"one",
        errors:[],
    }

}

export const registerSlice = createSlice({
    name:'registerSlice',
    initialState,
    reducers:{
        setRegisterState: (state,action) => {
            state = current(state)
            let newState = { ...state }
            let { name, value } = action.payload
            if(name === "phoneNumber"){value = Number(value)}
            const updatedValues = { ...newState.values, [name] : value , errors:[]  }
            registerControl(updatedValues)
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