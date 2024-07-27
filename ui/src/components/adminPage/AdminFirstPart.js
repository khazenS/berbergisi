import { Container, Grid, Button, Typography } from '@mui/material';
import {useDispatch,useSelector} from 'react-redux'
import {useEffect} from 'react'
import { changeStatus, defineStatus } from "../../redux/features/adminPageSlices/shopStatusSlice";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import {socket} from "../../helpers/socketio.js";
import { useNavigate } from 'react-router-dom';

export default function AdminFirstPart(){
    const dispatch = useDispatch()
    const shopStatusState = useSelector(state => state.shopStatus)
    const navigate = useNavigate()
    // defining the first value of shopStatusState.status
    useEffect(()=>{
        dispatch(defineStatus())
    },[dispatch])

    //Button Click Fucntion
    const changeProcessFunc = (status) => {
        if(shopStatusState.expiredError === true){
            navigate('/adminLogin')
        }else{
            socket.emit('changeStatus',status)
            return () => {
                dispatch(changeStatus(status))
            }            
        }

    };

    if(shopStatusState.defineRequest.isLoading === true || shopStatusState.defineRequest.isLoading === null){
        return(
            <Box sx={{display: 'flex',justifyContent: 'center',alignItems: 'center',height: '50vh', }}>
                <CircularProgress />
            </Box>
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
                <Container
                sx={{display: 'flex',height: '10vh',}}>
                <Grid container spacing={2} >
                    <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button variant="contained" color='success' onClick={changeProcessFunc(shopStatusState.status)}>Dükkanı {shopStatusState.status === true ? 'kapat' : 'aç'}</Button>
                  </Grid>
                  <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography variant="h6">Dükkan şuanda {shopStatusState.status === true ? 'açık' : 'kapalı'}</Typography>
                  </Grid>
                </Grid>
              </Container>
            )
        }    
    }
}

