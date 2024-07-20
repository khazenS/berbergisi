import { Container, Stack, Typography } from "@mui/material"
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';


function BodyInformation(){
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
        </div>
    )


}


export default BodyInformation