import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const initialState = {
    isLoading : false,
    error : false,
    servicePrice:0,
    showMessage: '',
    expiredError : false,
    shopData : {
        showMessage : null
    },
    costumShopOpening : {
        isLoading:false,
        date: null,
        error:false
    },
    services : []
}

export const getShop = createAsyncThunk('getShop', async () => {
    const localToken = localStorage.getItem('adminAccessToken')
    const response = await axios.get(process.env.REACT_APP_SERVER_URL+'admin/get-shop-settings',{headers:{'Authorization': `Bearer ${localToken}`}})
    return response.data
})


export const deleteMessage = createAsyncThunk('deleteMessage', async () => {
    const localToken = localStorage.getItem('adminAccessToken')
    const response = await axios.delete(process.env.REACT_APP_SERVER_URL+'admin/delete-message',{headers:{'Authorization': `Bearer ${localToken}`}})
    return response.data
})

export const addMessage = createAsyncThunk('addMessage', async (message) => {
    const localToken = localStorage.getItem('adminAccessToken')
    const response = await axios.post(process.env.REACT_APP_SERVER_URL+'admin/add-message',{
        message
    },{headers:{'Authorization': `Bearer ${localToken}`}})

    return response.data
})

export const addService = createAsyncThunk('addService', async (service) => {
    const localToken = localStorage.getItem('adminAccessToken')
    const response = await axios.post(process.env.REACT_APP_SERVER_URL+'admin/add-service',{
        name:service.name,
        estimatedTime:service.estimatedTime,
        amount:service.amount
    },{headers:{'Authorization': `Bearer ${localToken}`}})

    return response.data
})

export const deleteService = createAsyncThunk('deleteService', async (id) => {
    const localToken = localStorage.getItem('adminAccessToken')
    const response = await axios.post(process.env.REACT_APP_SERVER_URL+'admin/delete-service',{
        serviceID:id
    },{headers:{'Authorization': `Bearer ${localToken}`}})

    return response.data
})


export const setTimeCostumOpen = createAsyncThunk('setTimeCostumOpen', async (date) => {
    const localToken = localStorage.getItem('adminAccessToken')
    const response = await axios.post(process.env.REACT_APP_SERVER_URL+'admin/set-time',{
        date
    },{headers:{'Authorization': `Bearer ${localToken}`}})

    return response.data
})

export const cancelCostumOpen = createAsyncThunk('cancelCostumOpen', async () => {
    const localToken = localStorage.getItem('adminAccessToken')
    const response = await axios.delete(process.env.REACT_APP_SERVER_URL+'admin/cancel-costum-open',{headers:{'Authorization': `Bearer ${localToken}`}})
    return response.data
})




export const shopSettingsSlice = createSlice({
    name:'shopSettingsSlice',
    initialState,
    reducers: {
        resetShopSettingsExpiredError : (state) => {
            state.expiredError = false
        },
        updateShowMessage : (state,action) => {
            state.showMessage = action.payload
        },
        resetOtoDate : (state) => {
            state.costumShopOpening.date = null
        }
    },
    extraReducers : (builder) => {
        // get shop actions
        builder.addCase(getShop.pending,(state) => {
            state.isLoading = true
            state.error = false
        })
        builder.addCase(getShop.fulfilled,(state,action) => {
            if(action.payload.status === true){
                state.shopData.showMessage = action.payload.showMessage
                state.costumShopOpening.date = action.payload.costumFormattedOpeningDate
                state.services = action.payload.services
            }
            state.isLoading = false
        })
        builder.addCase(getShop.rejected,(state) => {
            state.error = true
            console.error('Error on getShop')
        })
        // delete message actions 
        builder.addCase(deleteMessage.pending,(state) => {
            state.isLoading = true
            state.error = false
        })
        builder.addCase(deleteMessage.fulfilled,(state,action) => {
            if(action.payload.status === true){
                state.shopData.showMessage = null
            }else{
                state.expiredError = true
            }
            state.isLoading = false
        })
        builder.addCase(deleteMessage.rejected,(state) => {
            state.error = true
            console.error('Error on deleteMessage')
        })
        // add message actions
        builder.addCase(addMessage.pending,(state) => {
            state.isLoading = true
            state.error = false
        })
        builder.addCase(addMessage.fulfilled, (state,action) => {
            if(action.payload.status === true){
                state.shopData.showMessage = action.payload.message
            }else{
                state.expiredError = true
            }
            state.isLoading = false
        })
        builder.addCase(addMessage.rejected,(state) => {
            state.error = true
            console.error('Error on addMessage')
        })

        builder.addCase(setTimeCostumOpen.pending,(state) => {
            state.costumShopOpening.isLoading=true
            state.costumShopOpening.error = false
        })
        builder.addCase(setTimeCostumOpen.fulfilled,(state,action) => {
            if(action.payload.status === true){
                state.costumShopOpening.date = action.payload.formattedDate
            }else{
                state.expiredError = true
            }
            state.costumShopOpening.isLoading = false
        })
        builder.addCase(setTimeCostumOpen.rejected,(state) => {
            state.costumShopOpening.error = true
            console.log('Error on setTimeCostumOpen()')
        })

        builder.addCase(cancelCostumOpen.pending,(state) => {
            state.costumShopOpening.isLoading = true
            state.costumShopOpening.error = false
        })
        builder.addCase(cancelCostumOpen.fulfilled,(state,action) => {
            if(action.payload.status === true){
                state.costumShopOpening.date = null
            }else{
                state.expiredError = true
            }
            state.costumShopOpening.isLoading = false
        })
        builder.addCase(cancelCostumOpen.rejected,(state) => {
            state.costumShopOpening.error = true
            console.log('Error on cancelCostumOpen()')
        })
        // Add service processes
        builder.addCase(addService.pending, (state) => {
            state.isLoading= true
            state.error = false
        })
        builder.addCase(addService.fulfilled,(state,action) => {
            if(action.payload.status === true){
                state.services.push(action.payload.newService)
            }else{
                state.expiredError = true
            }
            state.isLoading = false
        })
        builder.addCase(addService.rejected,(state) => {
            state.error = true
            console.log("Error on addServices()!!")
        })
        // Delete service processes
        builder.addCase(deleteService.pending, (state) => {
            state.isLoading= true
            state.error = false
        })
        builder.addCase(deleteService.fulfilled,(state,action) => {
            if(action.payload.status === true){
                state.services = action.payload.newServices
            }else{
                state.expiredError = true
            }
            state.isLoading = false
        })
        builder.addCase(deleteService.rejected,(state) => {
            state.error = true
            console.log("Error on deleteService()!!")
        })
    }
})

export const {updateServicePrice,resetServicePrice,resetShopSettingsExpiredError,resetOtoDate,updateShowMessage} = shopSettingsSlice.actions
export default shopSettingsSlice.reducer