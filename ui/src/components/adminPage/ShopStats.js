import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  getStats, newFinishedCut, resetDaily } from "../../redux/features/adminPageSlices/shopStatsSlice";
import { socket } from "../../helpers/socketio";

export default function ShopStats(){
    const dispatch = useDispatch()
    const isLoading = useSelector( state => state.shopStats.isLoading)
    const stats = useSelector( state => state.shopStats.stats)
    // Getting all stats
    useEffect( () => {
        dispatch(getStats())
    },[dispatch])
    
    // When status changed socket
    useEffect( () => {
        socket.on('changedStatus', (datas) => {
            if(datas === true){
                dispatch(resetDaily())
            }
        })
        return () => {
            socket.off('changedStatus')
        }
    },[dispatch])


    return (
        <>
        {
                isLoading === true || !stats ? 
                    <Container sx={{ justifyContent:'center',alignItems:'center',display:'flex'}}>
                        <CircularProgress/>
                    </Container>
                :
                    <Container sx={{marginTop:5}}>
                        <Box sx={{borderBottom:3}}>
                            <Typography variant="h4" sx={{fontWeight:'bold'}}> Dükkan İstatistikleri</Typography>
                        </Box>

                        <Box sx={{marginTop:3}}>
                            <Typography variant="h6">Günlük gelir : {stats.daily.dailyIncome} TL</Typography>
                            {
                                stats.daily.dailyCounts.map( (service,index) => (
                                    <Typography key={index} variant="h6">Günlük <u>{service.name}</u> sayısı : {service.count}</Typography>
                                ))
                            }
                        </Box>  

                        <Box sx={{marginTop:3}}>
                            <Typography variant="h6">Haftalık gelir : {stats.weekly.weeklyIncome} TL</Typography>
                            {
                                stats.weekly.weeklyCounts.map((service,index) => (
                                    <Typography key={index} variant="h6">Haftalık <u>{service.name}</u> sayısı : {service.count}</Typography>
                                ))
                            }
                        </Box>   

                        <Box sx={{marginTop:3}}>
                            <Typography variant="h6">Aylık gelir : {stats.monthlyIncome} TL</Typography>
                            <Typography variant="h6">Yıllık gelir : {stats.yearlyIncome} TL</Typography>
                        </Box>        
                    </Container> 
                                
        }
        </>


    )
}