import { Box, Container, Typography, TextField, Button, Collapse, Grid, IconButton, ButtonGroup,} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addMessage, addService, cancelCostumOpen, deleteMessage, deleteService, getShop, resetOtoDate, setTimeCostumOpen, updateShowMessage } from "../../redux/features/adminPageSlices/shopSettingsSlice";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ShopSettings(){
    const navigate = useNavigate()
    const dispatch = useDispatch()

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
    const services = useSelector( state => state.shopSettings.services)

    // This part for services
    const [openServices,setOpenServices] = useState(false)
    const [openAddService,setAddService] = useState(false)

    const [serviceName,setserviceName] = useState('')
    const [serviceTime,setServiceTime] = useState('')
    const [serviceAmount,setServiceAmount] = useState('')

    const [sNameErr,setSNameErr] = useState(false)
    const [sTimeErr,setSTimeErr] = useState(false)
    const [sAmountErr,setSAmountErr] = useState(false)

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


    useEffect( () => {
        dispatch(resetOtoDate())
        setCostumOpen(false)
    },[shopStatus,dispatch])

    const submitAddService = () => {
        if(serviceName.length < 3 || serviceName.length > 15){
            setSNameErr(true)
        }else if(isNaN(serviceTime) || !serviceTime){
            setSTimeErr(true)
        }else if(isNaN(serviceAmount) || !serviceAmount){
            setSAmountErr(true)
        }else{
            dispatch(addService({name:serviceName,estimatedTime:Number(serviceTime),amount:Number(serviceAmount)}))
            resetAddServiceSettings()
            setAddService(false)
        }
    }
     
    const resetAddServiceSettings = () => {
        setserviceName('')
        setServiceTime('')
        setServiceAmount('')
        setSNameErr(false)
        setSTimeErr(false)
        setSAmountErr(false)
    }


    return (
        <Container sx={{marginTop:5}}>
            <Box sx={{borderBottom:3}}>
                <Typography variant="h4" sx={{fontWeight:'bold'}}>Dükkan Ayarları</Typography>
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
                        {shopData.showMessage ? 'Duyuru Kaldır' : 'Duyuru Yayınla'}
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
            <>
                <Box>
                <Grid container alignItems="center">
                    <Grid item xs={10} sx={{display:'flex',alignItems:'center',marginTop:2}}>
                        <IconButton
                        onClick={() => {
                            setOpenServices(!openServices)
                            setAddService(false)
                            resetAddServiceSettings()
                        }}
                        >
                            {openServices ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>

                        <Typography variant="h6" sx={{opacity:'0.6'}}>
                        Hizmet Ekle-Çıkar
                        </Typography>
                    </Grid>
                </Grid>
                <Collapse in={openServices} timeout="auto" unmountOnExit sx={{marginLeft:5}}>
                    <Box sx={{ marginTop: '10px'}}>

                    <Button onClick={() => {
                        setAddService(!openAddService)
                        resetAddServiceSettings()
                        }} variant="contained" color={openAddService ? "error" : "success"} fullWidth> 
                        {openAddService ? <RemoveIcon /> : <AddIcon />}
                    </Button>
                
                    <Collapse in={openAddService} timeout="auto" unmountOnExit>
                        <Grid container spacing={2} sx={{marginTop:1}}>
                            <Grid item xs={12} sm={6}>
                                <TextField 
                                value={serviceName}
                                onChange={(e) => {
                                setserviceName(e.target.value)
                                setSNameErr(false)
                                }} 
                                error={sNameErr}
                                helperText={sNameErr ? "Lütfen 3-15 karakter aralığında isim giriniz." : "* Ekranda gözükecek bir isim giriniz."}
                                variant="outlined" 
                                label="Hizmet İsmi" 
                                size="small" multiline 
                                fullWidth/>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField 
                                value={serviceTime}
                                onChange={(e) => {
                                setServiceTime(e.target.value)
                                setSTimeErr(false)
                                }}
                                error={sTimeErr}
                                helperText={sTimeErr ? "Lütfen geçerli bir sayı giriniz." : "* Dakika cinsinden bir süre giriniz."}
                                variant="outlined" 
                                label="Tahmini süre" 
                                size="small" multiline 
                                fullWidth/>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField 
                                value={serviceAmount}
                                onChange={(e) => {
                                setServiceAmount(e.target.value)
                                setSAmountErr(false)
                                }}
                                error={sAmountErr}
                                helperText={ sAmountErr ? "Lütfen geçerli bir sayı giriniz." : "* TL olarak ücret giriniz."}
                                size="small" multiline variant="outlined"
                                label="Hizmet ücreti" 
                                fullWidth/>
                            </Grid>
                            <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Button 
                                onClick={submitAddService}
                                variant="contained" 
                                color="success" 
                                startIcon={<AddIcon />} 
                                sx={{width:'60%'}}>
                                    Ekle
                                </Button>
                            </Grid>
                        </Grid>                    
                    </Collapse>
                    
                    {
                        services && services.length != 0 ?
                        services.map((service) => (
                            <Box key={service.serviceID} sx={{boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.5)',display:'flex',justifyContent:'space-between',marginTop:2,borderRadius:3,border:"2px solid blue",alignItems:'center',padding:'1rem'}}>
                                <Typography sx={{fontWeight:'bold'}}>{service.name}</Typography>
                                <Typography sx={{fontWeight:'bold'}}>{service.estimatedTime}DK</Typography>
                                <Typography sx={{fontWeight:'bold'}}>{service.amount}TL</Typography>
                                <IconButton color="error" size="small" onClick={() => dispatch(deleteService(service.serviceID))}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ))
                        : <></>
                    }
                    

                    </Box>
                </Collapse>
            </Box>        



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
        </>  
        :
        <></>
        }

            
        </Container>
        
    )
}