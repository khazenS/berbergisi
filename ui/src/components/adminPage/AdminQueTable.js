import { Box, Button, Collapse, Container, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import CloseIcon from '@mui/icons-material/Close';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import {useDispatch,useSelector} from 'react-redux'
import { addNewUser, getDailyBookingAdmin, cancelUserFromAdminQue, resetDailyQueue, removeUserFromAdminQue, cutFinished, upMove, downMove, upMoveReq, downMoveReq } from "../../redux/features/adminPageSlices/adminDailyBookingSlice";
import { changeOrderFeature } from  '../../redux/features/adminPageSlices/shopStatusSlice'
import { socket } from "../../helpers/socketio";
import { useNavigate } from "react-router-dom";
import { newFinishedCut } from "../../redux/features/adminPageSlices/shopStatsSlice";
import { decryptData } from "../../helpers/cryptoProcess";

//Row 
function Row(props){
    const { row } = props
    const { dailyQueue } = props
    const [open,setOpen] = useState(false)
    const dispatch = useDispatch()


    const handleCancel = (userBookingID) => {
        dispatch(removeUserFromAdminQue(userBookingID))
        setOpen(false)
    }

    const handleFinishCut = (userBookingID) => {
        dispatch(cutFinished(userBookingID))
        .then((result) => {
            // This is for uupdating shop stats
            dispatch((newFinishedCut({income:result.payload.finishedDatas.income,serviceName:result.payload.finishedDatas.serviceName,comingWith:result.payload.finishedDatas.comingWith})))
        })
        setOpen(false)
    }

    const handleUpMove = () => {
        dispatch(upMoveReq(dailyQueue.indexOf(row)))
        setOpen(false)
    }

    const handleDownMove = () => {
        dispatch(downMoveReq(dailyQueue.indexOf(row)))
        setOpen(false)
    }

    return (
        <React.Fragment>
            <TableRow hover sx={{ '& > *': { borderBottom: 'unset' } }} key={dailyQueue.indexOf(row)}>
                <TableCell sx={{padding:0}}>
                <IconButton sx={{color: 'green'}}
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
                </TableCell>
                <TableCell align='left' component="th" scope="row" sx={{padding:0,fontWeight:'bold'}}>
                {dailyQueue.indexOf(row) + 1}
                </TableCell>
                <TableCell align="center" sx={{padding:1}}>{row.name}</TableCell>
                <TableCell align="center" sx={{padding:1}}>{row.phoneNumber}</TableCell>
                <TableCell align="center" sx={{padding:0}}>{row.comingWith}</TableCell>
            </TableRow>

            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                {
                                    row.phoneNumber !== null ?
                                    <a href={`tel:+90${row.phoneNumber}`}>
                                        <IconButton sx={{margin:1}}  style={{backgroundColor: 'green',color: 'white',borderRadius: '50%',padding: 3}}>
                                            <LocalPhoneIcon />
                                        </IconButton>
                                    </a> :
                                    <></>

                                }
                                
                            </Grid>
                            <Grid item xs={2}>
                                <IconButton onClick={() => {handleCancel(row.userBookingID)}} sx={{margin:1}} style={{backgroundColor: 'red',color: 'white',borderRadius: '50%',padding: 3}}>
                                    <CloseIcon />
                                </IconButton>
                            </Grid>
                            <Grid item xs={3}>
                                <IconButton onClick={() => {handleFinishCut(row.userBookingID)}} sx={{margin:1}} style={{backgroundColor: 'blue',color: 'white',borderRadius: '50%',padding: 3}}>
                                    <ContentCutIcon />
                                </IconButton>
                            </Grid>
                            <Grid item xs={2}>
                                <IconButton onClick={dailyQueue.indexOf(row) === 0 ? null : handleUpMove} sx={{margin:1}} style={{backgroundColor: 'blue',color: 'white',borderRadius: '50%',padding: 3}}>
                                    <KeyboardArrowUpIcon />
                                </IconButton>
                                
                                </Grid>
                                <Grid item xs={2}>
                                    <IconButton onClick={dailyQueue.indexOf(row) === dailyQueue.length - 1 ? null : handleDownMove} sx={{margin:1}} style={{backgroundColor: 'blue',color: 'white',borderRadius: '50%',padding: 3}}>
                                        <KeyboardArrowDownIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={6} sx={{textAlign:'center',opacity:'0.75'}}>
                                    {row.service.name}
                                </Grid>
                                <Grid item xs={6} sx={{textAlign:'center',opacity:'0.75'}}>
                                    {row.shownDate}
                                </Grid>
                            </Grid>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    )
}
export default function AdminQueTable(){
    const dispatch = useDispatch()
    const shopStatus = useSelector( state => state.shopStatus.status)
    const dailyQueue = useSelector( state => state.adminBooking.dailyQueue)
    const cancelTokenError = useSelector( state => state.adminBooking.expiredError)
    const orderFeature = useSelector(state => state.shopStatus.orderFeature)

    const navigate = useNavigate()

    // token error exists
    useEffect( () => {
        if(cancelTokenError === true){
            navigate('/adminLogin')
        }
    },[cancelTokenError,navigate])
    // Control of shop that is close or open if shopStatus is false then convert value of que to null for new opening
    useEffect(() => {
        if(shopStatus === true){
            dispatch(getDailyBookingAdmin());
        }else{
            dispatch(resetDailyQueue())
        }
        
    },[dispatch,shopStatus])

    // Listen socket for adding new user to que then print it out
    useEffect(()=>{
        socket.on('newUser',(cryptedData) => {
          const decryptedData = decryptData((cryptedData))
          dispatch(addNewUser(decryptedData))
        })
    
        return () => {
          socket.off('newUser')
        }
    },[dispatch])

    // Listen socket for cancelling process
    useEffect( () => {
        socket.on('cancel',(userBookingID) =>{
            dispatch(cancelUserFromAdminQue(userBookingID))
        })
        return () => {
          socket.off('cancel')
        }
    },[dispatch])


    if(shopStatus === true && dailyQueue !== null){
        return (
            <Container sx={{marginTop:'15vh'}}>
                {
                    dailyQueue.length === 0 ? <Box sx={{borderStyle:'dotted'}}><Typography variant="h4" sx={{fontWeight:'bold',textAlign:'center'}}>Sıra Boş</Typography></Box> : 
                    <Paper sx={{ width: '100%', overflow: 'hidden',marginTop:1}} elevation={10}>
                        <TableContainer sx={{maxHeight:350}}>
                            <Table stickyHeader aria-label="sticky table" sx={{border:1}}>
                                {// Table head part
                                }
                                <TableHead>
                                    <TableRow>
                                        <TableCell colSpan={12}>
                                            <Typography sx={{textAlign:'center',fontWeight:'bold'}} variant="h6">Günlük Sıra Listesi</Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{paddingY:1}} />
                                        <TableCell align='left' id='line' sx={{padding:0,fontWeight:'bold'}}>
                                        Sıra
                                        </TableCell>
                                        <TableCell align='center' id='name' sx={{fontWeight:'bold',padding:1}}>
                                        İsim
                                        </TableCell>
                                        <TableCell align='center' id='phoneNumber' sx={{fontWeight:'bold',padding:1}}>
                                        Telefon Numarası
                                        </TableCell>
                                        <TableCell align='center' id='comingWith' sx={{padding:0,fontWeight:'bold'}}>
                                        Kişi Sayısı
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                

                                {// Table body part
                                }
                                <TableBody>
                                    {
                                        dailyQueue.map( (user) => {
                                            return (
                                                <Row key={dailyQueue.indexOf(user)} row={user} dailyQueue={dailyQueue} ></Row>
                                            )
                                        })
                                    }
                                </TableBody>
                            </Table>
                            
                        </TableContainer>
                    </Paper>

                }


                {
                    // We can open or close our order specify.
                    dailyQueue.length !== 0 ? orderFeature === true ?  <Button onClick={() => {dispatch(changeOrderFeature(orderFeature))}}variant="contained" fullWidth color="error" sx={{marginTop:4,marginBottom:4,fontWeight:'bold'}}>Sira almayi kapat</Button> 
                    : <Button onClick={() => {dispatch(changeOrderFeature(orderFeature))}}variant="contained" fullWidth color="success" sx={{marginTop:4,marginBottom:4,fontWeight:'bold'}}>Sira almayi Ac</Button>
                    : <></>
                }

            </Container>
        )
    }else{
        return (
            <></>
        )  
    }

}