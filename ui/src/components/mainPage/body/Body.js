import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import {socket} from "../../../helpers/socketio.js";
import CloseShop from "./CloseShop.js";
import { getBooking, getShopStatus, resetDailyQueue } from "../../../redux/features/mainPageSlices/dailyBookingSlice.js";
import { resetQueueToken, resetUserDatas } from "../../../redux/features/mainPageSlices/registerSlice.js";
import InfoBoxes from "./InfoBoxes.js";
import LineTable from "./LineTable.js";

function Body() {
  const dispatch = useDispatch()
  const shopStatus = useSelector(state => state.booking.shopStatus)
  const [changedStatus,setStatus] = useState(null)

  const dailyBookingState = useSelector(state => state.booking)
  
  useEffect( () => {
    console.log(dailyBookingState.dailyQueue)
  },[dailyBookingState.dailyQueue])

  //Request database to learn status value and then set value to changedStatus state
  useEffect(() => {
    dispatch(getShopStatus())
  }, [dispatch]);

  useEffect(() => {
    setStatus(shopStatus)
  },[shopStatus])

  // We listen 'changedStatus' socket and set value to changedStatus state
  useEffect(()=>{
    socket.on('changedStatus',(datas) => {
      setStatus(datas.status)
    })

    return () => {
      socket.off('changedStatus')
    }
  },[])

  // This is for creating que on server
  useEffect(() => {
    if(changedStatus === true){
      dispatch(getBooking())
    }else if(changedStatus === false){
      // This is for asycn process bug. Extra and previous datas (user and daily que) seem when close-open shop
      dispatch(resetUserDatas())
      dispatch(resetDailyQueue())
      // When shop closed the cancel button still exists.It is for this bug
      dispatch(resetQueueToken())
      localStorage.removeItem('queueToken')
    }
  },[dispatch,changedStatus])
  if (dailyBookingState.isLoading === true || changedStatus === null ) {
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
  } else if (dailyBookingState.error) {
    return (
      <div>
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
      </div>
    );    
  }
  else {
    return (
      <div>
        {changedStatus ? (
          <>
            <InfoBoxes></InfoBoxes>
            <LineTable></LineTable>    
          </>
        ) : (
          <CloseShop></CloseShop>
        )}
      </div>
    );
  }
}

export default Body;
