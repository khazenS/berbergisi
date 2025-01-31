import { Avatar, Grid } from "@mui/material"
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { Container, Fab, FormControlLabel, FormHelperText, FormLabel, InputAdornment, Radio, RadioGroup, TextField , Alert, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useDispatch } from "react-redux";
import { cancelQue, checkQueueToken,registerUser,resetQueueToken,setServiceID,updateRegisterState } from "../../../redux/features/mainPageSlices/registerSlice.js";
import { socket } from "../../../helpers/socketio.js";
import { changeOrderF, removeUserFromQue } from "../../../redux/features/mainPageSlices/dailyBookingSlice.js";
import { decryptData } from "../../../helpers/cryptoProcess.js";


const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 1.25,
  }

function InfoBoxes(){
    const dispatch = useDispatch()
    const [userName,setUserName] = useState(null)
    const [costumer,setCostumer] = useState(null)
    const [estimatedHour,setEstimatedHour] = useState(null)
    const [estimatedMunite,setEstimatedMunite] = useState(null)

    const [open, setOpen] = useState(false)
    // This is for setting errors for fetch data
    const [samePhoneError,setSamePhoneError] = useState(false)
    const [nameError,setNameError] = useState(false)
    const [phoneError,setPhoneError] = useState(false)
    const [noServiceError,setServiceError] = useState(false)
    // orderFeature  for button visibility
    const orderFeature = useSelector(state => state.booking.orderFeature)
    //registerSlice state
    const state = useSelector(state => state.register.values)
    // queueToken state
    const queueToken = useSelector(state => state.register.queueToken)
    // daily queue state 
    const dailyQue = useSelector( state => state.booking.dailyQueue)
    // services state
    const services = useSelector( state => state.booking.services)

    // set serviceID as a default value 
    useEffect( () => {
        if(services && services.length > 0 && !state.serviceID){
        dispatch(updateRegisterState({'nameType':'serviceID','value':services[0].serviceID}))
        }
    },[services])


    // queue token processes
    useEffect( () => {
        const token = localStorage.getItem('queueToken')
        if(token){
        dispatch(checkQueueToken(token))
        }
    },[dispatch])


    //Functions for model process
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        dispatch(updateRegisterState({'nameType':'name','value':''}))
        dispatch(updateRegisterState({'nameType':'phoneNumber','value':''}))
        setOpen(false)
    };
    const onInpF = (name,value)=>{
        dispatch(updateRegisterState({'nameType':name,'value':value}))

        // reset all errors when typing
        setNameError(false)
        setPhoneError(false)
        setSamePhoneError(false)
    }

    // print out the count of costumer of the line
    useEffect(() => {
        if(queueToken.token && dailyQue){
            let totalCostumer = 0
            let totalMunite = 0
            // This is for just calculating front order datas of specified customer
            const index = dailyQue.findIndex(person => person.userBookingID === jwtDecode(queueToken.token).userBookingID)
            //Declare user name for print out
            if(index != -1) setUserName(dailyQue[index].name)

            const newDailyQue = dailyQue.slice(0,index)
            for(const queCostumer of newDailyQue){
                totalCostumer += queCostumer.comingWith
                totalMunite += queCostumer.service.estimatedTime
                totalMunite += (queCostumer.comingWith - 1) * services[0].estimatedTime
            }
            setEstimatedHour((totalMunite / 60) | 0)
            setEstimatedMunite(totalMunite % 60)
            setCostumer(totalCostumer)
        }
        else if (dailyQue) {
            let totalCostumer = 0
            let totalMunite = 0
            for(const queCostumer of dailyQue){
                totalCostumer += queCostumer.comingWith
                totalMunite += queCostumer.service.estimatedTime
                totalMunite += (queCostumer.comingWith - 1) * services[0].estimatedTime
            }
            setEstimatedHour((totalMunite / 60) | 0)
            setEstimatedMunite(totalMunite % 60)
            setCostumer(totalCostumer)
        }
    },[dailyQue,queueToken.token])

    //submit process
    const handleSubmit = () =>{
        let isNameError = false;
        let isPhoneError = false;
        let isSame = false

        // controlling there are any error on inputs
        if(state.name.length < 3 || state.name.length > 18){
        isNameError = true
        setNameError(true)
        }
        if(state.phoneNumber.toString().length !== 10){
        isPhoneError = true
        setPhoneError(true)
        }
        // controlling phone numbers is same
        dailyQue.forEach(user => {
        if(user.phoneNumber != null && decryptData(user.phoneNumber) === state.phoneNumber){
            isSame = true
        }
        });

        if(isNameError){
        setNameError(true)
        }else if(isPhoneError){
        setPhoneError(true)
        }else if(services === null || services.length === 0){
        setServiceError(true)
        }else{
        if(isSame === true){
            setSamePhoneError(true)
        }else{
            if(state.serviceID === null) setServiceID(services[0].serviceID);
            dispatch(registerUser(state))                                                                                                                
            setOpen(false)
        }      
        }
    }


    // remove socket for cancelling on admin panel
    useEffect( () => {
        socket.on('remove',({userBookingID,bookingToken}) =>{
        const localToken = localStorage.getItem('queueToken')
        if(bookingToken !== null){
            const bodyID = jwtDecode(bookingToken).userBookingID
            if(bodyID === userBookingID && bookingToken === localToken){
            localStorage.removeItem('queueToken')
            dispatch(resetQueueToken())
            }
        }
        dispatch(removeUserFromQue(userBookingID))
        })
        return () => {
        socket.off('remove')
        }
    },[dispatch])

    // finis cut on admin panel
    useEffect( () => {
        socket.on('finished-cut',({userBookingID,bookingToken}) =>{
        const localToken = localStorage.getItem('queueToken')
        if(bookingToken !== null){
            const bodyID = jwtDecode(bookingToken).userBookingID
            if(bodyID === userBookingID && bookingToken === localToken){
            localStorage.removeItem('queueToken')
            dispatch(resetQueueToken())
            }
        }
        dispatch(removeUserFromQue(userBookingID))
        })
        return () => {
        socket.off('finished-cut')
        }
    },[dispatch])

    useEffect( () => {
        socket.on('changeOrderFeature', (newOrderFeature) => {
        dispatch(changeOrderF(newOrderFeature))
        })

        return () => {
        socket.off('changedOrderFeature')

        }
    },[dispatch]) 

    const handleCancel = () => {
        dispatch(cancelQue(queueToken.token))
    }
    return (
        <div>
            {

                queueToken.token ? 
                //If there is token then print out that.
                <Grid container spacing={1} sx={{marginTop:3,marginBottom:3}}>
                    <Grid xs={12} item sx={{display:"flex",justifyContent:"center",alignItems:"center"}} >
                        <Typography sx={{fontWeight:'bold',fontSize:'1.25rem'}}> {userName} </Typography>
                    </Grid>
                    <Grid xs={6} item sx={{display:"flex",justifyContent:"left",alignItems:"center",marginTop:2}} >
                        <Avatar sx={{ bgcolor:"green", height:48  , width: 48 }}></Avatar>
                        { costumer === null ? null : <Typography sx={{ fontWeight: "bold", fontSize: "1.35rem",marginLeft:3}}>{costumer} kişi</Typography>}
                    </Grid>
                    <Grid xs={6} item sx={{display:"flex",justifyContent:"left",alignItems:"center",marginTop:2}} >
                        <Avatar sx={{ bgcolor:"blue",height:48  , width: 48  }}><AccessAlarmIcon></AccessAlarmIcon></Avatar>
                            {costumer === null || estimatedHour === null || estimatedMunite === null ? null : 
                            <Typography sx={{ fontWeight: "bold",fontSize:"1.35rem",marginLeft:3}}>{
                                costumer === 0 ? 'Boş' : estimatedHour === 0 ? estimatedMunite + ' dk' : estimatedMunite === 0 ? estimatedHour + ' s' : estimatedHour + ' s' + estimatedMunite + ' dk'
                            }</Typography>}          
                    </Grid>
                </Grid>
                :
                <Grid container spacing={1} sx={{marginTop:3}}>
                    <Grid xs={6} item sx={{display:"flex",justifyContent:"center",alignItems:"center",marginTop:2}} >
                        <Avatar sx={{ bgcolor:"green"}}></Avatar>

                        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography>Sırada ki kişi</Typography>
                        { costumer === null ? null : <Typography sx={{ fontWeight: "700", fontSize: "1.25rem" }}>{costumer}</Typography>}
                        </Container>
                    </Grid>
                    <Grid xs={6} item sx={{display:"flex",justifyContent:"center",alignItems:"center",marginTop:2}} >
                        <Avatar sx={{ bgcolor:"blue"}}><AccessAlarmIcon></AccessAlarmIcon></Avatar>

                        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography>Tahmini Zaman</Typography>
                            {costumer === null || estimatedHour === null || estimatedMunite === null ? null : 
                            <Typography sx={{ fontWeight: "700",fontSize:"1rem"}}>{
                                costumer === 0 ? 'Boş' : estimatedHour === 0 ? estimatedMunite + ' dk' : estimatedMunite === 0 ? estimatedHour + ' s' : estimatedHour + ' s' + estimatedMunite + ' dk'
                            }</Typography>} 
                        </Container>      
                    </Grid>
                </Grid>

            }


            <Container>
            {
                queueToken.token ? 
                <Button
                variant="contained"
                onClick={() => {handleCancel()}}
                sx={{
                    margin: "1.75rem auto",
                    display: "block",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                }}
                color="error"
                >
                Sıramı iptal et
                </Button>
                :
                orderFeature === true ?
                <Button
                variant="contained"
                onClick={handleOpen}
                sx={{
                    margin: "1.75rem auto",
                    display: "block",
                    fontSize: "1.2rem",
                    fontWeight: "bold"
                }}
                color="success"
                >
                Hemen Sıra Al
                </Button>
                : <Stack>
                    <Alert variant="outlined" severity="info" color="info" sx={{marginTop:5,color:"black",alignItems:"center",fontWeight:"bold"}}>
                    Şuan da dükkan sahibi sıra almayı kapatmıştır lütfen yarın tekrar uğrayınız.
                    </Alert> 
                </Stack>
            }


            <Modal
                open={open}
            >
                <Box sx={style}>
                <Box>
                    <Fab color="error" size="small" onClick={handleClose} sx={{ marginLeft: "auto", display: "flex" }}><CloseIcon /></Fab>
                    <TextField onChange={(e) =>{onInpF('name',e.target.value)}} 
                    error={nameError} helperText={nameError ?"Lütfen tam isminizi giriniz.":""} 
                    label="İsminiz" variant="outlined" inputProps={{ maxLength: 20 }} InputLabelProps={{shrink: true}} sx={{display:'flex' , m:2}}/>

                    <TextField onChange={(e) =>{onInpF('phoneNumber',e.target.value)}} 
                    error={phoneError} helperText={phoneError ? "Lütfen numaranızı eksiksiz giriniz.":""}
                    type="number" InputLabelProps={{shrink: true}} label="Telefon Numaranız" variant="outlined"
                    sx={{display:'flex',m:2}} InputProps={{startAdornment: (<InputAdornment position="start">+90</InputAdornment>)}}/>
                    
                    {services.length > 0 ?
                    <Box sx={{margin:2}}>
                    <FormLabel >Hizmet seçiniz</FormLabel>
                        <RadioGroup onChange={(e) =>{onInpF('serviceID',e.target.value)}} row defaultValue={services[0].serviceID}  name="radio-buttons-group">

                        {services.map( (service) => (
                        <FormControlLabel key={service.serviceID} value={service.serviceID} control={<Radio />} label={service.name}></FormControlLabel>
                        ))}
                        </RadioGroup>    
                        <FormHelperText>Bu tahmini süre hesaplamada önemlidir.</FormHelperText>           
                    </Box>
                    :
                    <Box sx={{margin:2}}>
                        <Typography variant="h5">Dükkan sahibinin hizmet eklemesini bekleyiniz.</Typography> 
                    </Box>
                    
                    }


                    <Box sx={{margin:2}}>
                    <FormLabel>Kaç kişisiniz</FormLabel>
                    <RadioGroup onChange={(e) =>{onInpF('comingWithValue',e.target.value)}} row defaultValue="1" name="radio-buttons-group">
                    <FormControlLabel value="1" control={<Radio />} label="Tekim"  />
                    <FormControlLabel value="2" control={<Radio />} label="2" />
                    <FormControlLabel value="3" control={<Radio />} label="3" />
                    <FormControlLabel value="4" control={<Radio />} label="4" />
                    <FormHelperText>Bu sıralamada önemlidir.</FormHelperText>
                    </RadioGroup>               
                    </Box>
                    {
                    samePhoneError === true ? <Alert sx={{marginTop:3,marginBottom:3}} severity="error" variant="filled">Bu telefon numarası zaten sırada</Alert> : <Box></Box>
                    }
                    {
                    noServiceError ? <Alert sx={{marginTop:3,marginBottom:3}} severity="error" variant="filled">Lütfen hizmet seçiniz.</Alert> : <></>
                    }
                    <Button variant="contained" onClick={()=>{handleSubmit()}} color="success" size="large" sx={{fontWeight:'bold',textTransform:'none'}}fullWidth={true} endIcon={<ArrowForwardIcon></ArrowForwardIcon>}>Sıraya gir</Button>

                </Box>
                </Box>
            </Modal>
        </Container>
            
        </div>

    )
}
export default InfoBoxes