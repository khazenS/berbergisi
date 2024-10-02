import { Box, Container, Typography, TextField, Button, Collapse, Grid, IconButton, RadioGroup, FormControlLabel, Radio, FormLabel, ButtonGroup} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addMessage, cancelCostumOpen, deleteMessage, getShop, resetOtoDate,  resetServicePrice, setCutBPrice, setCutPrice, setTimeCostumOpen, updateServicePrice, updateServicePriceValue, updateShopDataMessage, updateShowMessage } from "../../redux/features/adminPageSlices/shopSettingsSlice";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { socket } from "../../helpers/socketio"

export default function ShopSettings(){
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [service,setService] = useState(null)

    const [openUpdate, setUpdate] = useState(false)
    const [updateError,setUpdateError] = useState(false)
    const servicePrice = useSelector(state => state.shopSettings.servicePrice)

    const [openShowMessage,setShowMessage] = useState(false)
    const [showMessageError,setShowMessageError] = useState(false)

    const [openCostumOpen,setCostumOpen] = useState(null)
    const [hour, setHour] = useState('10')
    const [minute, setMinute] = useState('00')
    const [nowDate,setNowDate] = useState(null)


    const shopData = useSelector( state => state.shopSettings.shopData)
    const showMessage = useSelector( state => state.shopSettings.showMessage)
    const tokenError = useSelector( state => state.shopSettings.expiredError)
    const shopStatus = useSelector(state => state.shopStatus.status)
    const costumShopOpeningState =useSelector( state => state.shopSettings.costumShopOpening)
    // token error exists
    useEffect( () => {
        if(tokenError === true){
            navigate('/adminLogin')
        }
    },[tokenError,navigate])

    //get shop settings when page rendered
    useEffect( () => {
        dispatch(getShop())
    },[dispatch])


    const updateServicePriceSubmit = () => {
        if(servicePrice > 0 && service !== null){
            dispatch(updateServicePriceValue({service:service,value:servicePrice}))
            dispatch(resetServicePrice())
            setUpdate(!openUpdate)
            setService(null)
            setUpdateError(false)
        }else{
            setUpdateError(true)
        }
    }

    // sumbit for show message
    const showMessageSubmit = () => {
        if(showMessage.length < 250){
            dispatch(addMessage(showMessage))
            setShowMessage(false)
            dispatch(updateShowMessage(''))            
        }else{
            setShowMessageError(true)
        }

    }

    const deleteMessageSubmit = () => {
        dispatch(deleteMessage())
        setShowMessage(false)
    }

    // Costum Day Opening Processes
    const handleCostumShopOpen = () => {
        setCostumOpen(!openCostumOpen)
    }

    const handleHourChange = (e) => {
        const value = e.target.value;
        // Sadece sayıları ve belirtilen aralıkta olanları kabul et
        if (value === '' || (value >= 0 && value <= 24)) {
            setHour(value);
        }
    };

    const handleMinuteChange = (e) => {
        const value = e.target.value;
        // Sadece sayıları ve belirtilen aralıkta olanları kabul et
        if (value === '' || (value >= 0 && value < 60)) {
            setMinute(value)
        }
    };

    useEffect( () => {
        if(costumShopOpeningState.date === null){
            if(openCostumOpen){
                let now = new Date()
                now.setDate(now.getDate() + 1);  
                setNowDate(now)
            }else{
                setHour('10')
                setMinute('0')
                setNowDate(null)
            }   
        }

    },[openCostumOpen])

    const submitCostumShop = () => {
        nowDate.setHours(hour)
        nowDate.setMinutes(minute)
        const utcDate = new Date(nowDate.getTime() - nowDate.getTimezoneOffset() * 60000)
        dispatch(setTimeCostumOpen(utcDate))

        setCostumOpen(false)
    }
    // sockets for raise and discount for all admins
    useEffect( () => {
        socket.on('sended-shopSettings',(data) => {
            dispatch(setCutPrice(data.cutPrice))
            dispatch(setCutBPrice(data.cutBPrice))
        })

        return () => {
            socket.off('sended-shopSettings')
        }
    },[dispatch])
    
    // sockets for getting message coming from database 
    useEffect(() => {
        socket.on('sended-message', (message) => {
            dispatch(updateShopDataMessage(message))
        })

        return () => {
            socket.off('sended-message')
        }
    },[dispatch])

    // sockets for delete message 
    useEffect(() => {
        socket.on('deleted-message', () => {
            dispatch(updateShopDataMessage(null))
        })

        return () => {
            socket.off('deleted-message')
        }
    },[dispatch])


    useEffect( () => {
        dispatch(resetOtoDate())
        setCostumOpen(false)
      },[shopStatus,dispatch])

    return (
        <Container sx={{marginTop:5}}>
            <Box sx={{borderBottom:3}}>
                <Typography variant="h4" sx={{fontWeight:'bold'}}>Dükkan Ayarları</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, width: '100%' }}>
                <Typography sx={{ fontSize: '0.85rem' }}> Saç:{' '}
                    <Box component="span" sx={{ fontWeight: 'bold' }}>
                        {shopData.cutPrice ? shopData.cutPrice : <></>}TL
                    </Box>
                </Typography>

                <Typography sx={{ fontSize: '0.85rem' }}> Saç Sakal:{' '} 
                    <Box component="span" sx={{ fontWeight: 'bold' }}>
                        {shopData.cutBPrice ? shopData.cutBPrice : <></>}TL
                    </Box>
                </Typography>
                <Typography sx={{ fontSize: '0.85rem' }}> Duyuru mesajı {' '}
                    <Box component="span" sx={{ fontWeight: 'bold' }}>
                        {shopData.showMessage ? 'var' : 'yok'}
                    </Box>
                </Typography>
            </Box>





            <Box>
                <Grid container alignItems="center">
                    <Grid item xs={10} sx={{display:'flex',alignItems:'center',marginTop:2}}>
                        <IconButton
                        onClick={() => {
                            setUpdate(!openUpdate)
                            dispatch(resetServicePrice())
                            setService(null)
                            setUpdateError(false)
                        }}
                        >
                            {openUpdate ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>

                        <Typography variant="h6" sx={{opacity:'0.6'}}>
                        Hiznet Fiyatı Güncelle
                        </Typography>
                    </Grid>
                </Grid>
                <Collapse in={openUpdate} timeout="auto" unmountOnExit sx={{marginLeft:5}}>
                <FormLabel sx={{fontWeight:'bold'}}>Hizmet Seç</FormLabel>
                    <Box>
                        <RadioGroup row 
                        onChange={(e) => {
                            setService(e.target.value)
                        }}
                        >
                        <FormControlLabel value="cut" control={<Radio />} label="Saç" />
                        <FormControlLabel value="cutB" control={<Radio />} label="Saç Sakal" />
                        </RadioGroup>
                    </Box>
                    <Box sx={{ marginTop: '10px',display:'flex'}}>
                    <TextField
                        onChange={(e) => {
                        setUpdateError(false) 
                        dispatch(updateServicePrice(e.target.value))
                        }} 
                        value={servicePrice}
                        helperText= {updateError === true ? 'Hizmet seçin veya düzgün bir sayı giriniz.' : ''}
                        error={updateError} 
                        size="small" type="number" required label="Zam Miktarı" variant="outlined" 
                        sx={{width:'60%'}}
                        />
                        <Button onClick={() => updateServicePriceSubmit()} variant="contained" color="primary" size="small" sx={{width:'25%',float:'right',marginLeft:2}}>
                            Yap
                        </Button>
                    </Box>
                </Collapse>
            </Box>

            <Box>
                <Grid container alignItems="center">
                    <Grid item xs={10} sx={{display:'flex',alignItems:'center',marginTop:2}}>
                        <IconButton
                        onClick={() => {
                            setShowMessage(!openShowMessage)
                            dispatch(updateShowMessage(''))
                            setShowMessageError(false)
                        }}
                        >
                            {openShowMessage ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>

                        <Typography variant="h6" sx={{opacity:'0.6'}}>
                        Duyuru Yayınla
                        </Typography>
                    </Grid>
                </Grid>
                <Collapse in={openShowMessage} timeout="auto" unmountOnExit sx={{marginLeft:5}}>
                    <Box sx={{ marginTop: '10px'}}>
                    {
                        shopData.showMessage ?
                        <Button onClick={() => deleteMessageSubmit()} variant="contained" color="error" size="small" fullWidth sx={{marginTop:2}}>
                        Duyuruyu bitir
                        </Button>
                        : 
                        <>
                            <TextField
                            onChange={(e) => {
                            setShowMessageError(false)
                            dispatch(updateShowMessage(e.target.value))
                            }}
                            multiline
                            rows={4} 
                            value={showMessage}
                            helperText= {showMessageError === true ? 'Maksimum 250 karakter girini' : ''}
                            error={showMessageError} 
                            size="small" type="number" required label="Duyuru mesajı" variant="outlined" 
                            fullWidth
                            />
                            <Button onClick={() => showMessageSubmit()} variant="contained" color="primary" size="small" fullWidth sx={{marginTop:2}}>
                                Yayınla
                            </Button>                        
                        </>

                    }
                    </Box>
                </Collapse>
            </Box>
            
            {shopStatus === false ?
            <Box>
            <Grid container alignItems="center">
                <Grid item xs={10} sx={{display:'flex',alignItems:'center',marginTop:2}}>
                    <IconButton
                    onClick={handleCostumShopOpen}
                    >
                        {openCostumOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>

                    <Typography variant="h6" sx={{opacity:'0.6'}}>
                    Dükkan Açılış Saati Ayarla
                    </Typography>
                </Grid>
            </Grid>
            <Collapse in={openCostumOpen} timeout="auto" unmountOnExit sx={{marginLeft:5}}>
                {costumShopOpeningState.date === null ?
                <>
                <Box sx={{ marginTop: '10px'}}>
                İşlem yapılacak tarih 
                <Box component="span" sx={{ fontWeight: 'bold' }}> {nowDate !== null ? nowDate.toLocaleDateString('tr-TR'): <></>} ,  {nowDate !== null ? nowDate.toLocaleDateString('tr-TR', { weekday: 'long' }): <></>}
                </Box>
                </Box>                
                
                <ButtonGroup 
                    sx={{ 
                        display: 'flex', // Flex container olarak ayarla
                        justifyContent: 'center', // Yatayda ortala
                        marginTop: 2 // Üstten boşluk
                    }} 
                    variant="contained" 
                    aria-label="Basic button group">
                    <Button 
                        onClick={() => {
                            setNowDate(new Date(nowDate.setDate(nowDate.getDate() + 1)));
                        }} 
                        variant="contained" 
                        color="success" 
                        size="small" 
                        fullWidth 
                        sx={{ 
                            textAlign: 'center', // Metni ortala
                            whiteSpace: 'nowrap', // Metnin taşmasını önle
                        }}>
                        Gün Arttır
                    </Button>
                    <Button 
                        onClick={() => {
                            setNowDate(new Date(nowDate.setDate(nowDate.getDate() - 1)));
                        }} 
                        variant="contained" 
                        color="error" 
                        size="small" 
                        fullWidth 
                        sx={{ 
                            textAlign: 'center', // Metni ortala
                            whiteSpace: 'nowrap', // Metnin taşmasını önle
                        }}>
                        Gün Azalt
                    </Button>
                </ButtonGroup>  

                <Box sx={{marginTop:3}}>
                    İşlem yapılacak saat: 
                    <Box component="span" sx={{ fontWeight: 'bold' }}> {hour} : {minute < 10 ? '0'+minute : minute}
                    </Box>
                </Box> 

                <Box sx={{ marginTop: 2 }}>
                <Grid container spacing={2} justifyContent="center">
                    {/* Saat Input */}
                    <Grid item>
                        <TextField
                            label="Saat"
                            type="number"
                            inputProps={{
                                max: 24,
                                min: 0,
                            }}
                            value={hour}
                            onChange={handleHourChange}
                            variant="outlined"
                        />
                    </Grid>
                
                    {/* Dakika Input */}
                    <Grid item>
                        <TextField
                            label="Dakika"
                            type="number"
                            inputProps={{
                                max: 59,
                                min: 0,
                            }}
                            value={minute}
                            onChange={handleMinuteChange}
                            variant="outlined"
                        />
                    </Grid>
                </Grid>
                </Box>

                <Button onClick={() => {submitCostumShop()}} variant="contained" fullWidth sx={{marginTop:5,fontWeight:'bold'}}>Dükkan açılışını onayla</Button>
                </>
                :
                <>
                <Box>İşlem tarihi <Box component={'span'} sx={{fontWeight:'bold'}}>{costumShopOpeningState.date}</Box></Box>
                <Button onClick={() => {
                dispatch(cancelCostumOpen())
                setCostumOpen(!openCostumOpen) }} variant="contained" fullWidth color="error" sx={{marginTop:3}}>iptal et</Button>              
                </>
                }





                    



            </Collapse>
        </Box>    
        :
        <></>
        }

            
        </Container>
        
    )
}