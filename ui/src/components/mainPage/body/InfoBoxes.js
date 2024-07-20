import { Avatar, Container, Grid, Typography } from "@mui/material"
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import LineModal from "./LineModal.js";


function InfoBoxes(){


    return (
        <div>
            <Typography>{String(status)}</Typography>
            <Grid container spacing={1} sx={{marginTop:3}}>
                <Grid xs={6} item sx={{display:"flex",justifyContent:"center",alignItems:"center"}} >
                    <Avatar sx={{ bgcolor:"green" }}></Avatar>

                    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography sx={{ marginLeft: 1 }}>Sırada ki kişi sayısı </Typography>
                        <Typography sx={{ fontWeight: "700" , fontSize:"1.25rem"}}>2</Typography>
                    </Container>
                    
                </Grid>
                <Grid xs={6} item sx={{display:"flex",justifyContent:"center",alignItems:"center"}} >
                    <Avatar sx={{ bgcolor:"blue" }}><AccessAlarmIcon></AccessAlarmIcon></Avatar>

                    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography sx={{ marginLeft: 1}}>Tahmini Zaman</Typography>
                        <Typography sx={{ fontWeight: "700",fontSize:"1.25rem"}}>30 dakika</Typography>
                    </Container>
                    
                </Grid>
            </Grid>

            <LineModal></LineModal>
            
        </div>

    )
}
export default InfoBoxes