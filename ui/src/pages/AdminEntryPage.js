import { Alert, Box, Button, Container, Grid, Paper, Typography } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TextField from '@mui/material/TextField';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { adminLogin, resetAdminDatas, resetExpiredError, resetTotalReqError, updatePassword, updateUsername } from '../redux/features/adminPageSlices/adminLoginSlice';
import { useNavigate } from 'react-router-dom';
import { resetShopStatusExpiredError } from '../redux/features/adminPageSlices/shopStatusSlice';
import { resetCancelExpiredError } from '../redux/features/adminPageSlices/adminDailyBookingSlice';
import { resetFastOpsExpiredError } from '../redux/features/adminPageSlices/fastOpsSlice';
import { resetShopSettingsExpiredError } from '../redux/features/adminPageSlices/shopSettingsSlice';
import { resetNotificationExpiredError } from '../redux/features/adminPageSlices/notificationSlice';
function AdminEntryPage(){
    const dispatch = useDispatch()
    const adminDatas = useSelector( state => state.adminLogin.adminDatas)
    const isLoading = useSelector( state => state.adminLogin.isLoading)
    const isLogin = useSelector( state => state.adminLogin.isLogin)
    const wrongInputs = useSelector( state => state.adminLogin.wrongInputs)
    const navigate = useNavigate()
    
    const adminExpired = useSelector( state => state.adminLogin.expiredError)
    const shopExpired = useSelector( state => state.shopStatus.expiredError)
    const bookingExpired = useSelector( state => state.adminBooking.expiredError)
    const fastOpsExpired = useSelector( state => state.fastOps.expiredError)
    const shopSettingsExpired = useSelector( state => state.shopSettings.expiredError)
    const notificationExpired = useSelector( state => state.notification.expiredError)
    const totalReqError = useSelector( state => state.adminLogin.totalReqError)

    // When login was succesfully navigate admin panel
    useEffect( () => {
        if(isLogin === true){
            navigate('/admin')
            dispatch(resetAdminDatas())
        }
    },[dispatch,navigate,isLogin,isLoading])

    // Reset all adminTokenErrors for navigate loop bug
    useEffect( () => {
        dispatch(resetExpiredError())
        dispatch(resetShopStatusExpiredError())
        dispatch(resetCancelExpiredError())
        dispatch(resetFastOpsExpiredError())
        dispatch(resetShopSettingsExpiredError())
        dispatch(resetNotificationExpiredError())
    },[dispatch,adminExpired,shopExpired,bookingExpired,fastOpsExpired,shopSettingsExpired])

    // Reset total request error after 3 sec
    useEffect( () => {
        if(totalReqError ===true){
            setTimeout( () => {
                dispatch(resetTotalReqError())
            },3000)
        }
    },[dispatch,totalReqError])

    return (
        <div>
        {
            totalReqError === true ? 
            <div style={{zIndex:'999',position:'fixed',marginTop:5,top:'20px',left:'10px',right:'20px'}}>
            <Alert severity="error" variant='filled' sx={{fontWeight:'bold'}}> Sunucuya çok fazla istek attınız.Lütfen daha sonra tekrar deneyiniz. </Alert>
            </div>
            :
            <></>
        }
        <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}>
            <Paper elevation={24} sx={{ height: '50vh', width: '40vh',display:'flex' }}>
                    <Container sx={{display:'flex'}}>
                        <Grid container direction="column" justifyContent="space-between">
                            <Grid item sx={{display:'flex',justifyContent:'center',alignItems:'center',marginTop:5}}>
                                <AccountCircleIcon fontSize='large'></AccountCircleIcon>
                                <Typography variant='h5' sx={{fontWeight:'bold',marginLeft:1}}>Admin Girişi</Typography>
                            </Grid>
                            <Grid item >
                                <TextField  onChange={(e) => {dispatch(updateUsername(e.target.value))}} color='success' sx={{marginBottom:2,width:'100%'}} label="Kullanıcı Adı" variant="outlined" />
                                <TextField  onChange={(e) => {dispatch(updatePassword(e.target.value))}} color='success' sx={{marginTop:2,width:'100%'}} label="Şifre" type='password' variant="outlined" />
                            </Grid>
                            <Grid item sx={{display:'flex',justifyContent:'center',alignItems:'center',marginBottom:5,flexDirection: 'column',}}>
                                {
                                    wrongInputs === true ? <Alert sx={{marginBottom:2}} variant="filled" severity="error">Girdiğiniz kullanıcı adı veya şifre yanlış.</Alert> : <div></div>
                                }
                                <Button onClick={()=>{dispatch(adminLogin({
                                    username:adminDatas.username,
                                    password:adminDatas.password
                                    }))}}  sx={{width:'100%'}} size='large' variant='contained' color='primary' endIcon={<SendIcon />}>Giriş Yap</Button>
                            </Grid>
                        </Grid>
                    </Container>
            </Paper>            
        </Box>
        </div>
    );
}

export default AdminEntryPage