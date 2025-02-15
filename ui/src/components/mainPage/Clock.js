import React, { useState, useEffect } from "react";
import { Typography, Card, CardContent, Box } from "@mui/material";
import { DateTime } from "luxon";

export default function Clock(){
    const [time, setTime] = useState(DateTime.now().toFormat("HH:mm:ss"));

    useEffect(() => {
      const interval = setInterval(() => {
        setTime(DateTime.now().toFormat("HH:mm:ss"));
      }, 1000);
  
      return () => clearInterval(interval);
    }, []);
  
    return (
      <Box sx={{textAlign:'center', marginTop:5}}>
      <Typography variant="h4" sx={{fontWeight:'bold'}}>{time}</Typography>
      </Box>  
    );
  };

