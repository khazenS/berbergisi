import Container from '@mui/material/Container'
import Header from '../components/mainPage/Header.js';
import Body from '../components/mainPage/body/Body.js';
import BodyInformation from '../components/mainPage/body/BodyInformation.js';
import { Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { resetReqError } from '../redux/features/mainPageSlices/registerSlice.js';
function MainPage(){
    const dispatch = useDispatch()
    const reqError = useSelector(state => state.register.reqError)
    useEffect( () => {
        if(reqError === true){
            setTimeout(() => {
                dispatch(resetReqError())
              }, 3000)
        }
    },[reqError])
    return (
        <div>
        <Container>
            {
                reqError === true ? 
                <div style={{zIndex:'999',position:'fixed',marginTop:5,top:'20px',left:'10px',right:'20px'}}>
                    <Alert severity="error" variant='filled' sx={{fontWeight:'bold'}}> Çok fazla kayıt denediniz.Lütfen daha sonra tekar deneyiniz. </Alert>
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