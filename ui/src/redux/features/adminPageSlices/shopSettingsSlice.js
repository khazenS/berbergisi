import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { socket } from "../../../helpers/socketio"

const initialState = {
    isLoading : false,
    error : false,
    raisePrice : 0,
    discountPrice : 0,
    showMessage: '',
    expiredError : false,
    shopData : {
        cutPrice : null,
        cutBPrice : null,
        showMessage : null
    }
}

export const getShop = createAsyncThunk('getShop', async () => {
    const localToken = localStorage.getItem('adminAccessToken')
    const response = await axios.get(process.env.REACT_APP_SERVER_URL+'admin/get-shop-settings',{headers:{'Authorization': `Bearer ${localToken}`}})
    return response.data
})

export const raiseService = createAsyncThunk('raiseService', async (datas) => {
    const localToken = localStorage.getItem('adminAccessToken')
    const response = await axios.put(process.env.REACT_APP_SERVER_URL+'admin/raise-price',{
        service : datas.service,
        raisePrice : datas.raisePrice
    },{headers:{'Authorization': `Bearer ${localToken}`}})
    return response.data
})

export const discountService = createAsyncThunk('discountService', async (datas) => {
    const localToken = localStorage.getItem('adminAccessToken')
    const response = await axios.put(process.env.REACT_APP_SERVER_URL+'admin/discount-price',{
        service : datas.service,
        discountPrice : datas.discountPrice
    },{headers:{'Authorization': `Bearer ${localToken}`}})
    return response.data
})

export const deleteMessage = createAsyncThunk('deleteMessage', async () => {
    const localToken = localStorage.getItem('adminAccessToken')
    const response = await axios.delete(process.env.REACT_APP_SERVER_URL+'admin/delete-message',{headers:{'Authorization': `Bearer ${localToken}`}})
    return response.data
})

export const addMessage = createAsyncThunk('', async (message) => {
    const localToken = localStorage.getItem('adminAccessToken')
    const response = await axios.post(process.env.REACT_APP_SERVER_URL+'admin/add-message',{
        message
    },{headers:{'Authorization': `Bearer ${localToken}`}})

    return response.data
})
export const shopSettingsSlice = createSlice({
    name:'shopSettingsSlice',
    initialState,
    reducers: {
        updateRaisePriceValue : (state,action) => {
            state.raisePrice = action.payload
        },
        resetRaisePrice : (state) => {
            state.raisePrice = 0
        },
        updateDiscountPriceValue : (state,action) => {
            state.discountPrice = action.payload
        },
        resetDiscountPrice : (state) => {
            state.discountPrice = 0
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
        }
    },
    extraReducers : (builder) => {
        // raise price process
        builder.addCase(raiseService.pending, (state) => {
            state.isLoading = true
            state.error = false
        })
        builder.addCase(raiseService.fulfilled,(state,action) => {
            if(action.payload.status === true){
                socket.emit('get-shopSttings',{cutPrice:action.payload.cutPrice,cutBPrice:action.payload.cutBPrice})
            }else{
                state.expiredError = true
            }
            state.isLoading = false
        })
        builder.addCase(raiseService.rejected,(state) => {
            state.error = true
            console.error('Error on raisePrice')
        })
        // discount price process
        builder.addCase(discountService.pending, (state) => {
            state.isLoading = true
            state.error = false
        })
        builder.addCase(discountService.fulfilled,(state,action) => {
            if(action.payload.status === true){
                socket.emit('get-shopSttings',{cutPrice:action.payload.cutPrice,cutBPrice:action.payload.cutBPrice})
            }else{
                state.expiredError = true
            }
            state.isLoading = false
        })
        builder.addCase(discountService.rejected,(state) => {
            state.error = true
            console.error('Error on discountPrice')
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
    }
})

export const {updateRaisePriceValue,resetRaisePrice,resetDiscountPrice,updateDiscountPriceValue,resetShopSettingsExpiredError,setCutPrice,setCutBPrice,updateShowMessage,updateShopDataMessage} = shopSettingsSlice.actions
export default shopSettingsSlice.reducer