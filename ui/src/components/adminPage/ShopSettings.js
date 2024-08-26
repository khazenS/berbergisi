import { Box, Container, Typography, TextField, Button, Collapse, Grid, IconButton, RadioGroup, FormControlLabel, Radio, FormLabel} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteMessage, discountService, getShop, raiseService, resetDiscountPrice, resetRaisePrice, setCutBPrice, setCutPrice, updateDiscountPriceValue, updateRaisePriceValue, updateShowMessage } from "../../redux/features/adminPageSlices/shopSettingsSlice";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { socket } from "../../helpers/socketio";

export default function ShopSettings(){
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [service,setService] = useState(null)

    const [openRaise, setOpenRaise] = useState(false)
    const [raiseError,setRaiseError] = useState(false)
    const raisePrice = useSelector(state => state.shopSettings.raisePrice)

    const [openDiscount, setOpenDiscount] = useState(false)
    const [discountError,setDiscountError] = useState(false)
    const discountPrice = useSelector(state => state.shopSettings.discountPrice)   

    const [openShowMessage,setShowMessage] = useState(false)
    const [showMessageError,setShowMessageError] = useState(false)


    const shopData = useSelector( state => state.shopSettings.shopData)
    const showMessage = useSelector( state => state.shopSettings.showMessage)
    const tokenError = useSelector( state => state.shopSettings.expiredError)
    
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


    const raiseSubmit = () => {
        if(raisePrice > 0 && service !== null ){
            dispatch(raiseService({service,raisePrice}))
            dispatch(resetRaisePrice())
            setOpenRaise(!openRaise)
            setService(null)
            setRaiseError(false)
        }else{
            setRaiseError(true)
        }
    }

    const discountSubmit = () => {
        if(discountPrice > 0 && service !== null ){
            dispatch(discountService({service,discountPrice}))
            dispatch(resetDiscountPrice())
            setOpenDiscount(false)
            setService(null)
            setDiscountError(false)
        }else{
            setDiscountError(true)
        }
    }

    const showMessageSubmit = () => {
        console.log('show submit')
    }
    const deleteMessageSubmit = () => {
        dispatch(deleteMessage())
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
    },[])

    return (
        <Container sx={{marginTop:5}}>
            <Box sx={{borderBottom:3}}>
                <Typography variant="h4" sx={{fontWeight:'bold'}}>Dükkan Ayarları</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, width: '100%' }}>
                <Typography> Saç Fiyat :{' '}
                    <Typography component="span" sx={{ fontWeight: 'bold' }}>
                        {shopData.cutPrice ? shopData.cutPrice : <></>} TL
                    </Typography>
                </Typography>

                <Typography> Sac Sakal Fiyat :{' '} 
                    <Typography component="span" sx={{ fontWeight: 'bold' }}>
                        {shopData.cutBPrice ? shopData.cutBPrice : <></>} TL
                    </Typography>
                </Typography>
                <Typography> Duyuru mesajı {' '}
                    <Typography component="span" sx={{ fontWeight: 'bold' }}>
                        {shopData.showMessage ? 'var' : 'yok'}
                    </Typography>
                </Typography>
            </Box>
            <Box>
                <Grid container alignItems="center">
                    <Grid item xs={10} sx={{display:'flex',alignItems:'center',marginTop:2}}>
                        <IconButton
                        onClick={() => {
                            setOpenRaise(!openRaise)
                            setService(null)
                            setRaiseError(false)
                        }}
                        >
                            {openRaise ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>

                        <Typography variant="h6" sx={{opacity:'0.6'}}>
                        Zam Yap
                        </Typography>
                    </Grid>
                </Grid>
                <Collapse in={openRaise} timeout="auto" unmountOnExit sx={{marginLeft:5}}>
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
                        setRaiseError(false) 
                        dispatch(updateRaisePriceValue(e.target.value))
                        }} 
                        value={raisePrice}
                        helperText= {raiseError === true ? 'Hizmet seçin veya düzgün bir sayı giriniz.' : ''}
                        error={raiseError} 
                        size="small" type="number" required label="Zam Miktarı" variant="outlined" 
                        sx={{width:'60%'}}
                        />
                        <Button onClick={() => raiseSubmit()} variant="contained" color="primary" size="small" sx={{width:'25%',float:'right',marginLeft:2}}>
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
                            setOpenDiscount(!openDiscount)
                            setService(null)
                            setDiscountError(false)
                        }}
                        >
                            {openRaise ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>

                        <Typography variant="h6" sx={{opacity:'0.6'}}>
                        İndirim yap
                        </Typography>
                    </Grid>
                </Grid>
                <Collapse in={openDiscount} timeout="auto" unmountOnExit sx={{marginLeft:5}}>
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
                        setDiscountError(false) 
                        dispatch(updateDiscountPriceValue(e.target.value))
                        }} 
                        value={discountPrice}
                        helperText= {discountError === true ? 'Hizmet seçin veya düzgün bir sayı giriniz.' : ''}
                        error={discountError} 
                        size="small" type="number" required label="İndirim Miktarı" variant="outlined" 
                        sx={{width:'60%'}}
                        />
                        <Button onClick={() => discountSubmit()} variant="contained" color="primary" size="small" sx={{width:'25%',float:'right',marginLeft:2}}>
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
                            helperText= {showMessageError === true ? 'Hizmet seçin veya düzgün bir sayı giriniz.' : ''}
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
            
        </Container>
        
    )
}