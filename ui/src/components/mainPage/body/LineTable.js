import {  Table, TableBody, TableCell, TableContainer, TableHead, TableRow , CircularProgress , Box, Typography, listItemSecondaryActionClasses} from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { newUserToQue, removeUserFromQue } from "../../../redux/features/mainPageSlices/dailyBookingSlice";
import { socket } from "../../../helpers/socketio.js";
import { resetQueueToken } from "../../../redux/features/mainPageSlices/registerSlice.js";

export default function LineTable(){
    const dispatch = useDispatch()
    const dailyQue = useSelector( state => state.booking.dailyQueue )
    const userDatas = useSelector( state => state.register.userDatas)
    const queToken = useSelector( state => state.register.queueToken)
    useEffect(() => {
        if(userDatas){
          // Sending userDatas to all client
          socket.emit('newRegister',userDatas)
        }
    },[dispatch,userDatas])

    // Listen socket for new user to write it on ui
    useEffect(()=>{
      socket.on('newUser',(user) => {
        dispatch(newUserToQue(user))
      })
  
      return () => {
        socket.off('newUser')
      }
    },[dispatch])
    
    // Listen socket for cancel specialized que on daily que and 
    useEffect( () => {
      socket.on('cancel',(userBookingID) =>{
        dispatch(removeUserFromQue(userBookingID))
      })
      return () => {
        socket.off('cancel')
      }
    },[dispatch])



    if(dailyQue){
    return (
        <div>
          {dailyQue.length !== 0 ? (
            <>
            <TableContainer sx={{marginTop:5}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{fontWeight:"bold"}}>Sıra</TableCell>
                            <TableCell align="center" sx={{fontWeight:"bold"}}>İsim</TableCell>
                            <TableCell align="center" sx={{fontWeight:"bold"}}>Kaç Kişi</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dailyQue.map((data) => (
                                <TableRow key={dailyQue.indexOf(data)}>
                                    <TableCell>{dailyQue.indexOf(data) + 1}</TableCell>
                                    <TableCell align="center">{data.name}</TableCell>
                                    <TableCell align="center">{data.comingWith}</TableCell>
                                </TableRow>
                        ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            </>
          ) : (
            <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "20vh",
                marginTop:5
              }}>
            <Typography variant="h4" sx={{
                textAlign:"center",
                fontWeight:'bold',
            }}> Şuanda sırada hiç kimse yok</Typography>        
            </Box>
        
          )}
        </div>
    );        
    }else{
        return (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "50vh",
              }}
            >
              <CircularProgress />
            </Box>
          );    
    }

}