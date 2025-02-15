import {  Table, TableBody, TableCell, TableContainer, TableHead, TableRow , CircularProgress , Box, Typography, Button, Backdrop, Collapse, Fab} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { downMove, newUserToQue, removeUserFromQue, upMove } from "../../../redux/features/mainPageSlices/dailyBookingSlice";
import { socket } from "../../../helpers/socketio.js";
import { jwtDecode } from "jwt-decode";
import { decryptData } from "../../../helpers/cryptoProcess.js";
import ListIcon from '@mui/icons-material/List';
import PersonIcon from '@mui/icons-material/Person';
import HelpIcon from '@mui/icons-material/Help';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
export default function LineTable(){
    const dispatch = useDispatch()
    const dailyQue = useSelector( state => state.booking.dailyQueue )
    const [openLine,setOpenLine] = useState(false)
    // queueToken
    const queueToken = useSelector( state => state.register.queueToken.token)

    useEffect(()=>{
      // Listen socket for new user to write it on ui
      socket.on('newUser',(cryptedData) => {
        const decryptedData = decryptData(cryptedData)
        dispatch(newUserToQue(decryptedData))
      })
      // Listen socket for new fast user to write it on ui
      socket.on('fastUser-register',(fastUserDatas) => {
        const decryptedData = decryptData(fastUserDatas)
        dispatch(newUserToQue(decryptedData))
      })
      // Listen socket for cancel specialized que on daily que and 
      socket.on('cancel',(userBookingID) =>{
        dispatch(removeUserFromQue(userBookingID))
      })
      // Listen up move socket for moving the user from admin panel
      socket.on('up-moved',(index) => {
        dispatch(upMove(index))
      })
      // Listen down move socket for moving the user from admin panel
      socket.on('down-moved',(index) => {
        dispatch(downMove(index))
      })

      return () => {
        socket.off('newUser')
        socket.off('fastUser-register')
        socket.off('cancel')
        socket.off('up-moved')
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
          { queueToken ? 
          <>
          <Box sx={{display:'flex',justifyContent:'center'}}>
          <Fab sx={{fontWeight:'bold'}}variant="extended" size="medium" color="primary" onClick={() => {setOpenLine(!openLine)}}>
            {openLine == true ? 
            <><ArrowDownwardIcon sx={{ mr: 1 }} />Sirayi kapat</>
            :
            <><ArrowForwardIcon sx={{ mr: 1 }} />Sirayi goster</>
            }
          </Fab>            
          </Box>

          <Collapse in={openLine}>
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
          </Collapse>
          </>
          :
          dailyQue.length !== 0 ? (
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
          <></>
          }
        </div>
    )        
    }
    else{
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