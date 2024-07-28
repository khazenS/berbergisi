import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { defineStatus } from "../../../redux/features/adminPageSlices/shopStatusSlice";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import {socket} from "../../../helpers/socketio.js";
import CloseShop from "./CloseShop.js";
import QueueInformation from "./QueueInformation.js";
import { closeDayBooking, getBooking } from "../../../redux/features/mainPageSlices/dailyBookingSlice.js";

function Body() {
  const dispatch = useDispatch()

  const shopStatusState = useSelector((state) => state.shopStatus)
  const [changedStatus,setStatus] = useState(null)

  const dailyBookingState = useSelector(state => state.booking)

  //Request database to learn status value and then set value to changedStatus state
  useEffect(() => {
    dispatch(defineStatus());
    setStatus(shopStatusState.status)
  }, [dispatch,shopStatusState.status]);

  // We listen 'changedStatus' socket and set value to changedStatus state
  useEffect(()=>{
    socket.on('changedStatus',(status) => {
      setStatus(status)
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
      dispatch(closeDayBooking())
    }
  },[dispatch,changedStatus])
  // Getting daily booking queue
  useEffect(() => {
    if(dailyBookingState.dailyQueue !== null){
      console.log('dailiy queue: ',dailyBookingState.dailyQueue)
    }
  },[dailyBookingState.dailyQueue])

  if (shopStatusState.defineRequest.isLoading === true || shopStatusState.status === null || dailyBookingState === true ) {
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
  } else if (shopStatusState.defineRequest.error || dailyBookingState.error) {
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
            <QueueInformation></QueueInformation>
          </>
        ) : (
          <CloseShop></CloseShop>
        )}
      </div>
    );
  }
}

export default Body;
