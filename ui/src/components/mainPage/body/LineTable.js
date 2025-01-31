import {  Table, TableBody, TableCell, TableContainer, TableHead, TableRow , CircularProgress , Box, Typography} from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { downMove, newUserToQue, removeUserFromQue, upMove } from "../../../redux/features/mainPageSlices/dailyBookingSlice";
import { socket } from "../../../helpers/socketio.js";
import { jwtDecode } from "jwt-decode";
import { decryptData } from "../../../helpers/cryptoProcess.js";
import ListIcon from '@mui/icons-material/List';
import PersonIcon from '@mui/icons-material/Person';
import HelpIcon from '@mui/icons-material/Help';
export default function LineTable(){
    const dispatch = useDispatch()
    const dailyQue = useSelector( state => state.booking.dailyQueue )

    // queueToken
    const queueToken = useSelector( state => state.register.queueToken.token)

    // Listen socket for new user to write it on ui
    useEffect(()=>{
      socket.on('newUser',(cryptedData) => {
        const decryptedData = decryptData(cryptedData)
        dispatch(newUserToQue(decryptedData))
      })
      return () => {
        socket.off('newUser')
      }
    },[dispatch])

    // Listen socket for new fast user to write it on ui
    useEffect(()=>{
      socket.on('fastUser-register',(fastUserDatas) => {
        const decryptedData = decryptData(fastUserDatas)
        dispatch(newUserToQue(decryptedData))
      })
  
      return () => {
        socket.off('fastUser-register')
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

    // Listen up move socket for moving the user from admin panel
    useEffect( () => {
      socket.on('up-moved',(index) => {
        dispatch(upMove(index))
      })

      return () => {
          socket.off('up-moved')
      }
    },[dispatch])

    // Listen down move socket for moving the user from admin panel
    useEffect( () => {
      socket.on('down-moved',(index) => {
        dispatch(downMove(index))
      })

      return () => {
        socket.off('down-moved')
      }
    },[dispatch])

    if(dailyQue){
    return (
        <div style={{
          backgroundImage: 'url("gisi_transparent.png")',
          backgroundSize: "contain", 
          backgroundPosition: "center",
          backgroundRepeat:'no-repeat', 
          height:'45vh'
        }}>
          {dailyQue.length !== 0 ? (
            <>
            <TableContainer sx={{marginTop:5}}>
                <Table>
                    <TableHead sx={{marginBottom:5}}>
                        <TableRow sx={{marginBottom:5}}>
                            <TableCell sx={{fontWeight:"bold",padding:0}}>
                            <Box sx={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                            <ListIcon fontSize="small"/>
                            Sıra
                            </Box>
                            </TableCell>

                            <TableCell align="center" sx={{fontWeight:"bold",padding:0}}>
                            <Box sx={{display:'flex',justifyContent:"center",alignItems:'center'}}>
                              <PersonIcon fontSize="small" />
                              İsim
                            </Box>
                            </TableCell>

                            <TableCell align="center" sx={{fontWeight:"bold",padding:0}}>
                            <Box sx={{display:'flex',justifyContent:"center",alignItems:'center'}}>
                              <HelpIcon fontSize="small"/>
                              Kaç Kişi
                            </Box>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dailyQue.map((data) => (
                          queueToken && data.userBookingID === jwtDecode(queueToken).userBookingID ? 
                          <TableRow key={dailyQue.indexOf(data)} sx={{ border: '2px solid rgba(255,0,0,0.75)'}}>
                            <TableCell >{dailyQue.indexOf(data) + 1}</TableCell>
                            <TableCell align="center">{data.name}</TableCell>
                            <TableCell align="center">{data.comingWith}</TableCell>
                          </TableRow>
                          :
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
          ) : 
          <></>}
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