import { Container, Grid, Button, Typography } from '@mui/material';
import {useDispatch,useSelector} from 'react-redux'
import {useEffect} from 'react'
import { changeStatus, defineStatus } from "../../redux/features/adminPageSlices/shopStatusSlice";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';

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
           console.log(shopStatusState.expiredError)
        }
    },[shopStatusState.expiredError,navigate])
    

    //Button Click Fucntion
    const changeProcessFunc = (status) => {
        dispatch(changeStatus(status))
    };

    //Logout button click function 
    const handleLogoutButton = () => {
        console.log('logout')
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
                <Container sx={{display: 'flex',height: '10vh',flexDirection: 'column',marginTop:2}}>
                <Button variant='contained' color='error' sx={{fontWeight:'bold'}} onClick={() => {handleLogoutButton()}}>Çıkış Yap</Button>
                <Grid container spacing={2} sx={{marginTop:2}}>
                    <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button  variant="contained" color='success' sx={{fontWeight:'bold'}} onClick={() => {changeProcessFunc(shopStatusState.status)}}>Dükkanı {shopStatusState.status === true ? 'kapat' : 'aç'}</Button>
                  </Grid>
                  <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{fontWeight:'bold'}}>Dükkan {shopStatusState.status === true ? 'açık' : 'kapalı'}</Typography>
                  </Grid>
                </Grid>
              </Container>
            )
        }    
    }
}

