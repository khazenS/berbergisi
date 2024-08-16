import { Box, Collapse, Container, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import CloseIcon from '@mui/icons-material/Close';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import {useDispatch,useSelector} from 'react-redux'
import { addNewUser, getDailyBookingAdmin, cancelUserFromAdminQue, resetDailyQueue, removeUserFromAdminQue, cutFinished } from "../../redux/features/adminPageSlices/adminDailyBookingSlice";
import { socket } from "../../helpers/socketio";
import { useNavigate } from "react-router-dom";

const datas = [
    {name:'Abdullah12',phoneNumber:5323555754,comingWith:2},
    {name:'Apo',phoneNumber:5323555754,comingWith:2},
    {name:'Mehmet',phoneNumber:5323555754,comingWith:2},
    {name:'Mehmet',phoneNumber:5323555754,comingWith:2},
    {name:'Mehmet',phoneNumber:5323555754,comingWith:2},
    {name:'Mehmet',phoneNumber:5323555754,comingWith:2},
    {name:'Mehmet',phoneNumber:5323555754,comingWith:2},
    {name:'Mehmet',phoneNumber:5323555754,comingWith:2}
]


//Row 
function Row(props){
    const { row } = props
    const { dailyQueue } = props
    const [open,setOpen] = useState(false)
    const dispatch = useDispatch()



    const handleCancel = (userBookingID) => {
        dispatch(removeUserFromAdminQue(userBookingID))
    }

    const handleFinishCut = (userBookingID) => {
        
        dispatch(cutFinished(userBookingID))
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
                                <a href={`tel:+90${row.phoneNumber}`}>
                                    <IconButton sx={{margin:1}}  style={{backgroundColor: 'green',color: 'white',borderRadius: '50%',padding: 3}}>
                                        <LocalPhoneIcon />
                                    </IconButton>
                                </a>
                                
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
                                <IconButton sx={{margin:1}} style={{backgroundColor: 'blue',color: 'white',borderRadius: '50%',padding: 3}}>
                                    <KeyboardArrowUpIcon />
                                </IconButton>
                                
                            </Grid>
                            <Grid item xs={2}>
                                <IconButton sx={{margin:1}} style={{backgroundColor: 'blue',color: 'white',borderRadius: '50%',padding: 3}}>
                                    <KeyboardArrowDownIcon />
                                </IconButton>
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
    
    const navigate = useNavigate()

    // Control of shop that is close or open if shopStatus is false then convert calue of que to null for new opening
    useEffect(() => {
        if(shopStatus === true){
            dispatch(getDailyBookingAdmin());
        }else{
            dispatch(resetDailyQueue())
        }
        
    },[dispatch,shopStatus])

    // Listen socket for adding new user to que then print it out
    useEffect(()=>{
        socket.on('newUser',(user) => {
          dispatch(addNewUser(user))
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
  
    // Remove socket for cancelling user from que on admin panel
    useEffect( () => {
        socket.on('remove',({userBookingID,bookingToken}) =>{
            dispatch(cancelUserFromAdminQue(userBookingID))
        })
        return () => {
          socket.off('remove')
        }
    },[dispatch])

    // finish cut socket for cancelling user from que on admin panel
    useEffect( () => {
        socket.on('finished-cut',({userBookingID,bookingToken}) =>{
            dispatch(cancelUserFromAdminQue(userBookingID))
        })
        return () => {
          socket.off('finished-cut')
        }
    },[dispatch])


    useEffect( () => {
        if(cancelTokenError === true){
            navigate('/adminLogin')
        }
    },[cancelTokenError,navigate])
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
                                        console.log(dailyQueue)
                                    }
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

            </Container>
        )
    }else{
        return (
            <></>
        )  
    }

}