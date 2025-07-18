import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import {socket} from "../../../helpers/socketio.js";
import CloseShop from "./CloseShop.js";
import { changeOrderF,  getBooking, getShopStatus, resetDailyQueue, updateOtoDate, updateShopStatus } from "../../../redux/features/mainPageSlices/dailyBookingSlice.js";
import { resetQueueToken } from "../../../redux/features/mainPageSlices/registerSlice.js";
import InfoBoxes from "./InfoBoxes.js";
import LineTable from "./LineTable.js";

function Body() {
  const dispatch = useDispatch()
  const shopStatus = useSelector(state => state.booking.shopStatus)
  const [changedStatus,setStatus] = useState(null)

  const dailyBookingState = useSelector(state => state.booking)
  //Request database to learn status value and then set value to changedStatus state
  useEffect(() => {
    dispatch(getShopStatus())
  }, [dispatch]);

  useEffect(() => {
    setStatus(shopStatus)
  },[shopStatus])

  // We listen 'changedStatus' socket and set value to changedStatus state
  useEffect(()=>{
    socket.on('changedStatus',(newStatus) => {
      setStatus(newStatus)
    })

    return () => {
      socket.off('changedStatus')
    }
  },[])
  // we listen socket  that is set oto time 
  useEffect(()=>{
    socket.on('set-oto-opening-time',(datas) => {
      if(datas.set === true){
        dispatch(updateOtoDate(datas.date))
      }
      else{
        dispatch(updateOtoDate(null))
      }
    })

    return () => {
      socket.off('set-oto-opening-time')
    }
  },[])

  // This is for creating que on server
  useEffect(() => {
    if(changedStatus === true){
      dispatch(getBooking())
    }else if(changedStatus === false){
      // This is for asycn process bug. Extra and previous datas (user and daily que) seem when close-open shop
      dispatch(resetDailyQueue())
      // When shop closed the cancel button still exists.It is for this bug
      dispatch(resetQueueToken())
      localStorage.removeItem('queueToken')
      // set order feature true
      dispatch(changeOrderF(true))
    }
  },[dispatch,changedStatus])

  // oto opening socket
  useEffect(()=>{
    socket.on('oto-status-change',(datas) => {
      dispatch(updateShopStatus(datas.status))
    })

    return () => {
      socket.off('oto-status-change')
    }
  },[])

  if(dailyBookingState.isLoading === true){
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
    )
  }

  if(dailyBookingState.error){
    return (
      <Stack
        sx={{
          height: "50vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Alert variant="filled" severity="error">
          Yüklenirken bir hata oluştu lütfen sayfayı yenileyiniz.
        </Alert>
      </Stack>
    )
  }

  if(changedStatus === true){
    return(
      <>
        <InfoBoxes />
        <LineTable />
      </>      
    )
  }
  
  if(changedStatus === false){
    return (
      <CloseShop />
    )
  }
}

export default Body;
