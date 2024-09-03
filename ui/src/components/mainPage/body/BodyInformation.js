import { Box, Container, Stack, Typography } from "@mui/material"
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMessage, updateMessage } from "../../../redux/features/mainPageSlices/showMessageSlice";
import { socket } from "../../../helpers/socketio";
import CampaignIcon from '@mui/icons-material/Campaign';

function BodyInformation(){
    const dispatch = useDispatch()

    const message = useSelector( state => state.showMessage.message)
    useEffect( () => {
        dispatch(getMessage())
    },[dispatch])

    // new message socket
    useEffect( () => {
        socket.on('sended-message', (message) => {
            dispatch(updateMessage(message))
        })

        return () => {
            socket.off('sended-message')
        }
    },[])
    // delete socket
    useEffect( () => {
        socket.on('deleted-message', () => {
            dispatch(updateMessage(null))
        })

        return () => {
            socket.off('deleted-message')
        }
    })
    return (
        <div>
        <Container sx={{display:"flex",justifyContent:"center",p:2,marginTop:5}}>
            <Typography variant="h4" sx={{fontStyle: 'italic',textShadow: '1px 1px 2px rgba(0,0,0,0.3)'}}>
                Berber Gısi'ye Hoşgeldiniz
            </Typography>
        </Container>

        <Stack sx={{marginTop:3}}>
            <Alert variant="outlined" severity="info" color="warning" sx={{marginTop:5,color:"black",alignItems:"center",fontWeight:"bold"}}>
            <AlertTitle sx={{fontWeight:"700",textAlign:"center"}}>BİLGİLENDİRME</AlertTitle>
            Sıra sistemi uygulanmaktadır. 
            Aşşağıda ki kısımdan sıradaki kişi sayısını ve TAHMİNİ süreyi öğrenebilirsiniz 
            ve isterseniz sıra alabilirsiniz sıranız geldiğinde size haber verilecektir.</Alert> 
        </Stack>

        {
            message ? 
                <Box sx={{marginTop:3,display:'flex',justifyContent:'center',marginY:5}} >
                    <Stack>
                        <Typography variant="h5" sx={{fontWeight:'bold',textAlign:'center',justifyContent:'center',alignItems:'center'}}>
                            <CampaignIcon fontSize="small" sx={{color:'blue'}}/>   DUYURU  <CampaignIcon fontSize="small" sx={{color:'blue'}}/> 
                        </Typography>
                        <Typography sx={{fontWeight:'bold',textAlign:'center'}}>{message}</Typography>            
                    </Stack>             

                
                </Box>
                :
                <></>            
        }


        </div>
    )


}


export default BodyInformation