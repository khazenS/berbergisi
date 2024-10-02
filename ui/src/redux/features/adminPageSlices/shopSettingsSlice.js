import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { socket } from "../../../helpers/socketio"

const initialState = {
    isLoading : false,
    error : false,
    servicePrice:0,
    showMessage: '',
    expiredError : false,
    shopData : {
        cutPrice : null,
        cutBPrice : null,
        showMessage : null
    },
    costumShopOpening : {
        isLoading:false,
        date: null,
        error:false
    }
}

export const getShop = createAsyncThunk('getShop', async () => {
    const localToken = localStorage.getItem('adminAccessToken')
    const response = await axios.get(process.env.REACT_APP_SERVER_URL+'admin/get-shop-settings',{headers:{'Authorization': `Bearer ${localToken}`}})
    return response.data
})

export const updateServicePriceValue = createAsyncThunk('updateServicePriceValue', async (datas) => {
    const localToken = localStorage.getItem('adminAccessToken')
    const response = await axios.put(process.env.REACT_APP_SERVER_URL+'admin/update-service-price',{
        service : datas.service,
        value : datas.value
    },{headers:{'Authorization': `Bearer ${localToken}`}})
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
        updateServicePrice : (state,action) => {
            state.servicePrice = action.payload
        },
        resetServicePrice : (state) => {
            state.servicePrice = 0
        },
        resetShopSettingsExpiredError : (state) => {
            state.expiredError = false
        },
        setCutPrice : (state,action) => {
            state.shopData.cutPrice = action.payload
        },
        setCutBPrice : (state,action) => {
            state.shopData.cutBPrice = action.payload
        },
        updateShowMessage : (state,action) => {
            state.showMessage = action.payload
        },
        updateShopDataMessage : (state,action) => {
            state.shopData.showMessage = action.payload
        },
        resetOtoDate : (state) => {
            state.costumShopOpening.date = null
        }
    },
    extraReducers : (builder) => {
        // update service price process
        builder.addCase(updateServicePriceValue.pending, (state) => {
            state.isLoading = true
            state.error = false
        })
        builder.addCase(updateServicePriceValue.fulfilled,(state,action) => {
            if(action.payload.status === true){
                socket.emit('get-shopSettings',{cutPrice:action.payload.cutPrice,cutBPrice:action.payload.cutBPrice})
            }else{
                state.expiredError = true
            }
            state.isLoading = false
        })
        builder.addCase(updateServicePriceValue.rejected,(state) => {
            state.error = true
            console.error('Error on updateServicePriceValue')
        })
        // get shop actions
        builder.addCase(getShop.pending,(state) => {
            state.isLoading = true
            state.error = false
        })
        builder.addCase(getShop.fulfilled,(state,action) => {
            if(action.payload.status === true){
                state.shopData.cutPrice = action.payload.cutPrice
                state.shopData.cutBPrice = action.payload.cutBPrice
                state.shopData.showMessage = action.payload.showMessage
                state.costumShopOpening.date = action.payload.costumFormattedOpeningDate
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
                socket.emit('delete-message')
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
                socket.emit('get-message', action.payload.message)
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
                socket.emit('set-oto-opening-time' , {set:true,date:action.payload.date})
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
                socket.emit('set-oto-opening-time' , {set:false,date:null})
            }else{
                state.expiredError = true
            }
            state.costumShopOpening.isLoading = false
        })
        builder.addCase(cancelCostumOpen.rejected,(state) => {
            state.costumShopOpening.error = true
            console.log('Error on cancelCostumOpen()')
        })
    }
})

export const {updateServicePrice,resetServicePrice,resetShopSettingsExpiredError,resetOtoDate,setCutPrice,setCutBPrice,updateShowMessage,updateShopDataMessage} = shopSettingsSlice.actions
export default shopSettingsSlice.reducer