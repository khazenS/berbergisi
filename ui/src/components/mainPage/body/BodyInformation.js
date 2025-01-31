import { Accordion, AccordionDetails, AccordionSummary, Box, Container, Stack, Typography } from "@mui/material"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMessage, updateMessage } from "../../../redux/features/mainPageSlices/showMessageSlice";
import { socket } from "../../../helpers/socketio";
import CampaignIcon from '@mui/icons-material/Campaign';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
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


        <Accordion sx={{
            marginTop:3,
            boxShadow:'none',
            border: "2px solid rgba(0.75,0.75,0.75,0.2)",
            borderRadius:'3%'
        }}>
        <AccordionSummary
          expandIcon={<ArrowDownwardIcon />}
        >
          <InfoOutlinedIcon />
          <Typography component="span" sx={{fontWeight:'bold',marginLeft:1}}>Genel Bilgilendirme</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            - Sıra sistemi uygulanmaktadır.
          </Typography>
          <Typography sx={{marginTop:2}}>
            - Eğer dükkan açıksa ve dükkan sahibi sıra almayı kapatmamışsa "Hemen Sıra Al" kısmından sıra alabilirsiniz , sıra size geldiğinde aranacaksınız.
          </Typography>
        </AccordionDetails>
      </Accordion>


      <Accordion sx={{
            marginTop:3,
            boxShadow:'none',
            border: "2px solid rgba(0.75,0.75,0.75,0.2) ",
            borderRadius:'3%'
        }}>
        <AccordionSummary
          expandIcon={<ArrowDownwardIcon />}
        >
          <InfoOutlinedIcon />
          <Typography component="span" sx={{fontWeight:'bold',marginLeft:1}}>Sıra Iptali Bilgilendirmesi</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            - Sıraya girdikten sonra sıranızı iptal edebilirsiniz.
          </Typography>
          <Typography sx={{marginTop:2}}>
            - Güvenlik nedeniyle 6 saat içerisinde maksimum 2 kere sıranızı iptal edebilirsiniz.
          </Typography>
        </AccordionDetails>
      </Accordion>
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