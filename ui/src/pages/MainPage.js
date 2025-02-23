import Container from '@mui/material/Container'
import Header from '../components/mainPage/Header.js';
import Body from '../components/mainPage/body/Body.js';
import BodyInformation from '../components/mainPage/body/BodyInformation.js';
import { Alert, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { resetReqError } from '../redux/features/mainPageSlices/registerSlice.js';
import { dailyResetTRE } from '../redux/features/mainPageSlices/dailyBookingSlice.js';
import { resgisterResetTRE } from '../redux/features/mainPageSlices/registerSlice.js';
import { messageResetTRE } from '../redux/features/mainPageSlices/showMessageSlice.js';
function MainPage(){
    const dispatch = useDispatch()
    const registerReqError = useSelector(state => state.register.registerReqError)

    const dailyBookingTotalError = useSelector(state => state.booking.totalReqError)
    const registerTotalError = useSelector( state => state.register.totalReqError)
    const messageTotalError = useSelector(state=> state.showMessage.totalReqError)

    useEffect( () => {
        if(registerReqError === true){
            setTimeout(() => {
                dispatch(resetReqError())
              }, 3000)
        }
    },[registerReqError])
    useEffect( () => {
        if(dailyBookingTotalError === true || registerTotalError === true || messageTotalError === true){
            {
                setTimeout(() => {
                    dispatch(dailyResetTRE())
                    dispatch(resgisterResetTRE())
                    dispatch(messageResetTRE ())
                }, 4000)
            }            
        }
    },[dailyBookingTotalError,registerTotalError,messageTotalError])
    return (
        <div>
        <Container>
            {
                registerReqError === true ? 
                <div style={{zIndex:'999',position:'fixed',marginTop:5,top:'20px',left:'10px',right:'20px'}}>
                    <Alert severity="error" variant='filled' sx={{fontWeight:'bold'}}> Çok fazla kayıt denediniz.Lütfen daha sonra tekar deneyiniz.</Alert>
                </div> : 
                <></>
            }
            {
                dailyBookingTotalError === true || registerTotalError === true || messageTotalError === true ? 
                <div style={{zIndex:'999',position:'fixed',marginTop:5,top:'20px',left:'10px',right:'20px'}}>
                    <Alert severity="error" variant='filled' sx={{fontWeight:'bold'}}> Sunucuya çok fazla istek attınız.Lütfen daha sonra tekrar deneyiniz. </Alert>
                </div> : 
                <></>
            }
            <Header></Header>
            <BodyInformation></BodyInformation>
            <Body></Body>
        </Container>
        </div>

    )
}

export default MainPage