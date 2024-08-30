import {  createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { decryptData } from "../../../helpers/cryptoProcess"
const initialState = {
    isLoading : false,
    error : false,
    shopStats: {
        status: false,
        daily : {
            income : null,
            cutCount: null,
            cutBCount: null
        },
        weekly : {
            income : null,
            cutCount: null,
            cutBCount: null
        },
        monthlyIncome: null,
        yearlyIncome : null
    }
    
}

export const getStats = createAsyncThunk('getStats',async () => {
    const localToken = localStorage.getItem('adminAccessToken')
    const response = await axios.get(process.env.REACT_APP_SERVER_URL+'admin/get-stats',{headers:{'Authorization': `Bearer ${localToken}`}})
    return response.data
})

export const shopStatsSlice = createSlice({
    name:'shopStatsSlice',
    initialState,
    reducers:{
        closeShopAction : (state,action) => {
            state.shopStats.daily.income = 0
            state.shopStats.daily.cutCount = 0
            state.shopStats.daily.cutBCount = 0

            state.shopStats.weekly.income -= action.payload.income
            state.shopStats.weekly.cutCount -= action.payload.cutCount
            state.shopStats.weekly.cutBCount -= action.payload.cutBCount
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getStats.pending, (state) => {
            state.isLoading = true
            state.error = false
        })
        builder.addCase(getStats.fulfilled, (state,action) => {
            const decryptedData = decryptData(action.payload.stats)
            state.shopStats.daily.income = decryptedData.daily.income
            state.shopStats.daily.cutCount = decryptedData.daily.cutCount
            state.shopStats.daily.cutBCount = decryptedData.daily.cutBCount

            state.shopStats.weekly.income = decryptedData.weekly.income
            state.shopStats.weekly.cutCount = decryptedData.weekly.cutCount
            state.shopStats.weekly.cutBCount = decryptedData.weekly.cutBCount

            state.shopStats.monthlyIncome = decryptedData.monthlyIncome
            state.shopStats.yearlyIncome = decryptedData.yearlyIncome
            state.shopStats.status = action.payload.status
            state.isLoading = false
        })
        builder.addCase(getStats.rejected, (state) => {
            state.isLoading = false
            state.error = true
        } )
    }
})


export const {closeShopAction} = shopStatsSlice.actions
export default shopStatsSlice.reducer