import { Avatar, Container, Grid, Typography } from "@mui/material"
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import LineModal from "./LineModal.js";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";


function InfoBoxes(){
    const [costumer,setCostumer] = useState(null)
    const [estimatedHour,setEstimatedHour] = useState(null)
    const [estimatedMunite,setEstimatedMunite] = useState(null)

    const dailyQue = useSelector( state => state.booking.dailyQueue )
    const queueToken = useSelector( state => state.register.queueToken.token)
    const services = useSelector(state => state.booking.services)
    // print out the count of costumer of the line
    useEffect(() => {
        if(queueToken && dailyQue){
            let totalCostumer = 0
            let totalMunite = 0
            // This is for just calculating front order datas of specified customer
            const index = dailyQue.findIndex(person => person.userBookingID === jwtDecode(queueToken).userBookingID)
            const newDailyQue = dailyQue.slice(0,index)

            for(const queCostumer of newDailyQue){
                totalCostumer += queCostumer.comingWith
                totalMunite += queCostumer.service.estimatedTime
                totalMunite += (queCostumer.comingWith - 1) * services[0].estimatedTime
            }
            setEstimatedHour((totalMunite / 60) | 0)
            setEstimatedMunite(totalMunite % 60)
            setCostumer(totalCostumer)
        }
        else if (dailyQue) {
            let totalCostumer = 0
            let totalMunite = 0
            for(const queCostumer of dailyQue){
                totalCostumer += queCostumer.comingWith
                totalMunite += queCostumer.service.estimatedTime
                totalMunite += (queCostumer.comingWith - 1) * services[0].estimatedTime
            }
            setEstimatedHour((totalMunite / 60) | 0)
            setEstimatedMunite(totalMunite % 60)
            setCostumer(totalCostumer)
        }
    },[dailyQue,queueToken])

    return (
        <div>
            <Grid container spacing={1} sx={{marginTop:3}}>
                <Grid xs={6} item sx={{display:"flex",justifyContent:"center",alignItems:"center"}} >
                    <Avatar sx={{ bgcolor:"green" }}></Avatar>

                    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography sx={{ marginLeft: 1 }}>Sırada ki kişi sayısı </Typography>
                        { costumer === null ? null : <Typography sx={{ fontWeight: "700", fontSize: "1.25rem" }}>{costumer}</Typography>}
                    </Container>
                    
                </Grid>
                <Grid xs={6} item sx={{display:"flex",justifyContent:"center",alignItems:"center"}} >
                    <Avatar sx={{ bgcolor:"blue" }}><AccessAlarmIcon></AccessAlarmIcon></Avatar>

                    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography sx={{ marginLeft: 1}}>Tahmini Zaman</Typography>
                        {costumer === null || estimatedHour === null || estimatedMunite === null ? null : 
                        <Typography sx={{ fontWeight: "700",fontSize:"1.25rem"}}>{
                            costumer === 0 ? 'Boş' : estimatedHour === 0 ? estimatedMunite + ' dakika' : estimatedMunite === 0 ? estimatedHour + ' saat' : estimatedHour + ' saat ' + estimatedMunite + ' dakika '
                        }</Typography>} 
                    </Container>
                    
                </Grid>
            </Grid>

            <LineModal></LineModal>
            
        </div>

    )
}
export default InfoBoxes