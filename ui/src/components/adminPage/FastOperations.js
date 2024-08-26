import { Box, Button, Collapse, Container, Grid, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useDispatch, useSelector } from "react-redux";
import { decreaseAmount, increaseAmount, registerFastUser, updateAmount, updateFastName } from "../../redux/features/adminPageSlices/fastOpsSlice";
import { useEffect, useState } from "react";
import { socket } from "../../helpers/socketio";
import { addNewUser } from "../../redux/features/adminPageSlices/adminDailyBookingSlice";
import { useNavigate } from "react-router-dom";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';




export default function FastOperations(){
    const dispatch = useDispatch()
    const [nameError,setNameError] = useState(false)
    const [amountError,setAmountError] = useState(false)
    
    const shopStatus = useSelector(state => state.shopStatus.status)
    const fastName = useSelector( state => state.fastOps.fastName)
    const changeAmount = useSelector( state => state.fastOps.changeAmount)
    
    const tokenError = useSelector( state => state.fastOps.expiredError)
    const navigate = useNavigate()

    const [openFast,setOpenFast] = useState(false)
    const [openChangeA,setOpenChangeA] = useState(false)


    // token error exists
    useEffect( () => {
        if(tokenError === true){
            navigate('/adminLogin')
        }
    },[tokenError,navigate])

    // submit handle for fast name 
    const handleFastNameSubmit = () => {
        if(fastName.length > 3 && fastName.length < 15){
            dispatch(registerFastUser(fastName))
            dispatch(updateFastName(''))
            setOpenFast(false)
        }else{
            setNameError(true)
        }
    }

    // increace and decrease process handle 
    const handleIncreaseSubmit = () => {
        if(changeAmount > 0){
            dispatch(increaseAmount(changeAmount))
            dispatch(updateAmount(0))
            setOpenChangeA(false)
        }else{
            setAmountError(true)
        }

    }
    const handleDecreaseSubmit = () => {
        if(changeAmount > 0){
            dispatch(decreaseAmount(changeAmount))
            dispatch(updateAmount(0))
            setOpenChangeA(false)
        }else{
            setAmountError(true)
        }
    }
    // fast user register socket
    useEffect( () => {
        socket.on('fastUser-registered', (fastUserDatas) => {
            dispatch(addNewUser(fastUserDatas))
        })
        return () => {
            socket.off('fastUser-registered')
        }
    })


    return (
        <div>
            {
                shopStatus === true ? 
                <Container sx={{marginTop:5}}>
                    
                    <Box sx={{borderBottom:3}}>
                        <Typography variant="h4" sx={{fontWeight:'bold'}}>Hızlı İşlemler</Typography>
                    </Box>
                    <Grid container >
                        <Grid item xs={10} sx={{display:'flex',alignItems:'center',marginTop:2}}>
                            <IconButton
                            onClick={() => {
                                setOpenFast(!openFast)
                                dispatch(updateFastName(''))
                                setNameError(false)
                            }}
                            >
                                {openFast ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>

                            <Typography variant="h6" sx={{opacity:'0.6'}}>
                                Hızlı ekle
                            </Typography>
                        </Grid>
                    </Grid>

                    <Collapse in={openFast} timeout="auto" unmountOnExit sx={{marginLeft:5}}>
                            <Box sx={{marginTop:3, display:'flex',alignItems:'center'}} >
                                <TextField 
                                onChange={(e) => {
                                setNameError(false) 
                                dispatch(updateFastName(e.target.value))
                                }} 
                                value={fastName}
                                helperText= {nameError === true ? '4-15 karakter aralığı isim giriniz.' : ''}
                                error={nameError} 
                                size="small" required label="İsim" variant="outlined" 
                                sx={{width:'65%'}}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start" sx={{color:'black'}}>
                                            <AccountCircle />
                                        </InputAdornment>
                                    ),
                                }}/>
                                
                                <Button
                                    onClick={() => {handleFastNameSubmit()}} 
                                    variant="contained" color="primary" 
                                    sx={{fontWeight: 'bold', width: '35%', marginLeft: 2 }}>
                                    Sıraya Al
                                </Button>
                            </Box>
                        </Collapse>

                        <Grid container>
                            <Grid item xs={10} sx={{display:'flex',alignItems:'center',marginTop:2}}>
                                <IconButton
                                onClick={() => {
                                    setOpenChangeA(!openChangeA)
                                    dispatch(updateAmount(0))
                                    setAmountError(false)
                                }}
                                >
                                    {openChangeA ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                </IconButton>

                                <Typography variant="h6" sx={{opacity:'0.6'}}>
                                    Gelirde güncelleme yap
                                </Typography>
                            </Grid>
                        </Grid>
                        <Collapse in={openChangeA} timeout="auto" unmountOnExit sx={{marginLeft:5}}>
                            <Box sx={{marginTop:3, display:'flex',alignItems:'center'}}>
                            <TextField 
                            onChange={(e) => {
                                setAmountError(false)
                                dispatch(updateAmount(e.target.value))
                            }}
                            value={changeAmount}
                            helperText={amountError === true ? 'Lütfen düzgün bir sayı giriniz.' : ''}
                            error={amountError}
                            size="small" type="number" required label="Lira" sx={{width:'50%'}} variant="outlined" InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start" sx={{color:'black'}}>
                                        ₺
                                    </InputAdornment>
                                ),
                            }}/>
                            <Button  onClick={() => {handleIncreaseSubmit()}} variant="contained" color="success" sx={{fontWeight: 'bold', fontSize: 12, width: '15%', height: '40px', marginLeft: 2 }}> + </Button>
                            <Button  onClick={() => {handleDecreaseSubmit()}} variant="contained" color="error" sx={{fontWeight: 'bold', fontSize: 12, width: '15%', height: '40px', marginLeft: 2 }}> - </Button>
                            </Box>
                        </Collapse>


                </Container> 
                :
                <></>  
            }
          
        </div>

    )
}