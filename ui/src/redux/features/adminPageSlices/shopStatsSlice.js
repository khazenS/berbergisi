import {  createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { decryptData } from "../../../helpers/cryptoProcess"

const initialState = {
    dailyStats:{
        isLoading:false,
        dataIsReady:false,
        error:false,
        counts:[],
        dailyIncome:0
    },
    weeklyStats:{
        isLoading:false,
        dataIsReady:false,
        error:false,
        counts:[],
        weeklyIncome:0        
    },
    monthlyStats:
    {
        isLoading:false,
        dataIsReady:false,
        error:false,
        counts:[]
    }
}

export const getDailyStats = createAsyncThunk('getDailyStats', async () => {
    const localToken = localStorage.getItem('adminAccessToken')
    const response = await axios.get(process.env.REACT_APP_SERVER_URL+'admin/get-daily-stats',{headers:{'Authorization': `Bearer ${localToken}`}})
    return response.data 
})

export const getWeeklyStats = createAsyncThunk('getWeeklyStats', async () => {
    const localToken = localStorage.getItem('adminAccessToken')
    const response = await axios.get(process.env.REACT_APP_SERVER_URL+'admin/get-weekly-stats',{headers:{'Authorization': `Bearer ${localToken}`}})
    return response.data 
})

export const getMonthlyStats = createAsyncThunk('getMonthlyStats', async () => {
    const localToken = localStorage.getItem('adminAccessToken')
    const response = await axios.get(process.env.REACT_APP_SERVER_URL+'admin/get-monthly-stats',{headers:{'Authorization': `Bearer ${localToken}`}})
    return response.data 
})

export const shopStatsSlice = createSlice({
    name:'shopStatsSlice',
    initialState,
    reducers:{
        resetDaily : (state) => {
            state.dailyStats.counts = []
            state.dailyStats.dailyIncome = 0
        },
        newFinishedCut : (state,action) => {
            state.dailyStats.dailyIncome += action.payload.income
            state.dailyStats.counts.forEach( (service,i) => {
                if(service.name === action.payload.serviceName) {
                    state.dailyStats.counts[i].count += 1
                    state.dailyStats.counts[0].count += (action.payload.comingWith - 1)
                    state.dailyStats.counts[i].income += action.payload.serviceIncome
                    state.dailyStats.counts[0].income += (action.payload.income - action.payload.serviceIncome)
                }
            })
            const lastIndex = state.weeklyStats.counts.length - 1
            state.weeklyStats.counts[lastIndex].income += action.payload.income
            state.weeklyStats.weeklyIncome += action.payload.income
            state.monthlyStats.counts.forEach( (service,i) => {
                service.income += action.payload.income
            })
        },
        increaseAmountStats : (state,action) => {
            state.dailyStats.dailyIncome += action.payload
            const lastIndex = state.weeklyStats.counts.length - 1
            state.weeklyStats.counts[lastIndex].income += action.payload
            state.weeklyStats.weeklyIncome += action.payload
            state.monthlyStats.counts.forEach( (service,i) => {
                service.income += action.payload
            })

        },
        decreaseAmountStats : (state,action) => {
            state.dailyStats.dailyIncome -= action.payload
            const lastIndex = state.weeklyStats.counts.length - 1
            state.weeklyStats.counts[lastIndex].income -= action.payload
            state.weeklyStats.weeklyIncome -= action.payload
            state.monthlyStats.counts.forEach( (service,i) => {
                service.income -= action.payload
            })
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getDailyStats.pending, (state) => {
            state.dailyStats.isLoading = true
            state.dailyStats.error = false
        })
        builder.addCase(getDailyStats.fulfilled, (state,action) => {
            console.log(action.payload)
            state.dailyStats.counts = action.payload.dailyCounts
            state.dailyStats.dailyIncome = action.payload.dailyIncome
            state.dailyStats.dataIsReady = true
            state.dailyStats.isLoading = false
        })
        builder.addCase(getDailyStats.rejected, (state) => {
            state.dailyStats.isLoading = false
            state.dailyStats.error = true
            console.error('Error on getDailyStats()')
        })
        builder.addCase(getWeeklyStats.pending, (state) => {
            state.weeklyStats.isLoading = true
            state.weeklyStats.error = false
        })
        builder.addCase(getWeeklyStats.fulfilled, (state,action) => {
            console.log(action.payload)
            state.weeklyStats.counts = action.payload.weeklyCounts
            state.weeklyStats.weeklyIncome = action.payload.totalIncome
            state.weeklyStats.dataIsReady = true
            state.weeklyStats.isLoading = false
        })
        builder.addCase(getWeeklyStats.rejected, (state) => {
            state.weeklyStats.isLoading = false
            state.weeklyStats.error = true
            console.error('Error on getWeeklyStats()')
        })
        builder.addCase(getMonthlyStats.pending, (state) => {
            state.monthlyStats.isLoading = true
            state.monthlyStats.error = false
        })
        builder.addCase(getMonthlyStats.fulfilled, (state,action) => {
            state.monthlyStats.counts = action.payload.counts
            state.monthlyStats.dataIsReady = true
            state.monthlyStats.isLoading = false
        })
        builder.addCase(getMonthlyStats.rejected, (state) => {
            state.monthlyStats.isLoading = false
            state.monthlyStats.error = true
            console.error('Error on getMonthlyStats()')
        })
    }
})


export const {resetDaily,newFinishedCut,increaseAmountStats,decreaseAmountStats} = shopStatsSlice.actions
export default shopStatsSlice.reducer