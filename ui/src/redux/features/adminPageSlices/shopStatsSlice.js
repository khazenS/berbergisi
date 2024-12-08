import {  createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { decryptData } from "../../../helpers/cryptoProcess"

const initialState = {
    isLoading : false,
    error : false,
    stats : null,

    
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
        resetDaily : (state) => {
            state.stats.daily.dailyCounts.forEach( service => {
                service.count = 0
            });
            state.stats.daily.dailyIncome = 0
        },
        newFinishedCut : (state,action) => {
            state.stats.daily.dailyIncome += action.payload.income
            state.stats.weekly.weeklyIncome += action.payload.income
            state.stats.monthlyIncome += action.payload.income
            state.stats.yearlyIncome += action.payload.income

            state.stats.daily.dailyCounts.forEach( (service,i) => {
                if(service.name === action.payload.serviceName) {
                    state.stats.daily.dailyCounts[i].count += 1
                    state.stats.daily.dailyCounts[0].count += (action.payload.comingWith - 1)
                }
            })
            state.stats.weekly.weeklyCounts.forEach( (service,i) => {
                if(service.name === action.payload.serviceName){
                   state.stats.weekly.weeklyCounts[i].count += 1 
                   state.stats.weekly.weeklyCounts[0].count += (action.payload.comingWith - 1)
                } 
            })
        },
        increaseAmountStats : (state,action) => {
            state.stats.daily.dailyIncome += action.payload
            state.stats.weekly.weeklyIncome += action.payload
            state.stats.monthlyIncome += action.payload
            state.stats.yearlyIncome += action.payload
        },
        decreaseAmountStats : (state,action) => {
            state.stats.daily.dailyIncome -= action.payload
            state.stats.weekly.weeklyIncome -= action.payload
            state.stats.monthlyIncome -= action.payload
            state.stats.yearlyIncome -= action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getStats.pending, (state) => {
            state.isLoading = true
            state.error = false
        })
        builder.addCase(getStats.fulfilled, (state,action) => {
            const decryptedData = decryptData(action.payload.stats)
            state.stats = decryptedData
            state.isLoading = false
        })
        builder.addCase(getStats.rejected, (state) => {
            state.isLoading = false
            state.error = true
        } )
    }
})


export const {resetDaily,newFinishedCut,increaseAmountStats,decreaseAmountStats} = shopStatsSlice.actions
export default shopStatsSlice.reducer