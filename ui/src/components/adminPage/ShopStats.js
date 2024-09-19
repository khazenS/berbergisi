import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { decreaseAmountStats, getStats, increaseAmountStats, newFinishedCut, resetDaily } from "../../redux/features/adminPageSlices/shopStatsSlice";
import { socket } from "../../helpers/socketio";

export default function ShopStats(){
    const dispatch = useDispatch()
    const shopStats = useSelector(state => state.shopStats.shopStats)
    const isLoading = useSelector( state => state.shopStats.isLoading)
    
    // Getting all stats
    useEffect( () => {
        dispatch(getStats())
    },[dispatch])
    // When status changed socket
    useEffect( () => {
        socket.on('changedStatus', (datas) => {
            if(datas.status === true){
                dispatch(resetDaily())
            }
        })
        return () => {
            socket.off('changedStatus')
        }
    },[])

    // cut finished socket 
    useEffect( () => {
        socket.on('finished-cut',(datas) => {
            dispatch(newFinishedCut({income:datas.finishedDatas.income,cutType:datas.finishedDatas.cutType,comingWith:datas.finishedDatas.comingWith}))
        })

        return () => {
            socket.off('finished-cut')
        }
    },[])

    // increased amount socket

    useEffect( ()=> {
        socket.on('increased-amount', (amount) => {
            dispatch(increaseAmountStats(amount))
        })

        return () => {
            socket.off('increased-amount')
        }
    },[dispatch])

    // decreased amount socket

    useEffect( ()=> {
        socket.on('decreased-amount', (amount) => {
            dispatch(decreaseAmountStats(amount))
        })

        return () => {
            socket.off('decreased-amount')
        }
    },[dispatch])

    return (
        <>
        {
                isLoading === true ?
                    <Container sx={{ justifyContent:'center',alignItems:'center',display:'flex'}}>
                        <CircularProgress/>
                    </Container>
                : shopStats.status === true ?
                    <Container sx={{marginTop:5}}>
                        <Box sx={{borderBottom:3}}>
                            <Typography variant="h4" sx={{fontWeight:'bold'}}> Dükkan İstatistikleri</Typography>
                        </Box>

                        <Box sx={{marginTop:3}}>
                            <Typography variant="h6">Günlük gelir : {shopStats.daily.income} TL</Typography>
                            <Typography variant="h6">Günlük saç traşı sayısı : {shopStats.daily.cutCount}</Typography>
                            <Typography variant="h6">Günlük saç-sakal traşı sayısı : {shopStats.daily.cutBCount}</Typography>
                        </Box>  

                        <Box sx={{marginTop:3}}>
                            <Typography variant="h6">Haftalık gelir : {shopStats.weekly.income} TL</Typography>
                            <Typography variant="h6">Haftalık saç traşı sayısı : {shopStats.weekly.cutCount}</Typography>
                            <Typography variant="h6">Haftalık saç-sakal traşı sayısı : {shopStats.weekly.cutBCount}</Typography>
                        </Box>   

                        <Box sx={{marginTop:3}}>
                            <Typography variant="h6">Aylık gelir : {shopStats.monthlyIncome} TL</Typography>
                            <Typography variant="h6">Yıllık gelir : {shopStats.yearlyIncome} TL</Typography>
                        </Box>        
                    </Container> 
                    :
                    <></>              
        }
        </>


    )
}