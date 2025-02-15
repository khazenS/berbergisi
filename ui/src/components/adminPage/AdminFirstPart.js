import { Container, Grid, Button, Typography } from '@mui/material';
import {useDispatch,useSelector} from 'react-redux'
import {useEffect} from 'react'
import { changeStatus, defineStatus } from "../../redux/features/adminPageSlices/shopStatusSlice";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import Clock from '../mainPage/Clock.js';
import StoreIcon from '@mui/icons-material/Store';

export default function AdminFirstPart(){
    const dispatch = useDispatch()
    const shopStatusState = useSelector(state => state.shopStatus)
    
    const navigate = useNavigate()

    // defining the first value of shopStatusState.status
    useEffect(()=>{
        dispatch(defineStatus())
    },[dispatch])

    useEffect( () => {
        if(shopStatusState.expiredError === true){
           navigate('/adminLogin')
        }
    },[shopStatusState.expiredError,navigate])
    

    //Button Click Fucntion
    const changeProcessFunc = (status) => {
        dispatch(changeStatus(status))
    };

    //Logout button click function 
    const handleLogoutButton = () => {
        localStorage.removeItem('adminAccessToken')
        navigate('/adminLogin')
    }

    if(shopStatusState.defineRequest.isLoading === true){
        return(
            <Container
            sx={{display: 'flex',height: '10vh'}}
            >
               <Box sx={{display: 'flex',justifyContent: 'center',alignItems: 'center',height: '50vh', }}>
                <CircularProgress />
                </Box> 
            </Container>
            
        )
    }
    else{
        if(shopStatusState.defineRequest.error === true){
            return (
                <div>
                    <Stack sx={{height:'50vh',justifyContent:'center',alignItems:'center'}}>
                        <Alert variant="filled" severity="error">
                            Yüklenirken bir hata oluştu lütfen sayfayı yenileyiniz.
                        </Alert>
                    </Stack>
                </div>
    
            )
        }
        else if(shopStatusState.status !== null){
            return (
                <Container sx={{display: 'flex',flexDirection: 'column'}}>
                    <Button variant='contained' color='error' sx={{fontWeight:'bold'}} onClick={() => {handleLogoutButton()}}>Çıkış Yap</Button>
                    <Button  startIcon={<StoreIcon/>} variant="contained" color={shopStatusState.status ? 'error' : 'success'} size='large' sx={{fontWeight:'bold',marginTop:4}} onClick={() => {changeProcessFunc(shopStatusState.status)}}>Dükkanı {shopStatusState.status === true ? 'kapat' : 'aç'}</Button>
                    <Clock/>
                </Container>
            )
        }    
    }
}

