import { Container, Stack, Typography } from "@mui/material"
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#76ABAE',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
  }));

function Body1(){
    return (
        <div>
        <Container sx={{display:"flex",justifyContent:"center",p:2}}>
            <Typography variant="h4" sx={{fontStyle: 'italic',textShadow: '1px 1px 2px rgba(0,0,0,0.3)'}}>
                Berber Gısi'ye Hoşgeldiniz
            </Typography>
        </Container>

        <Stack spacing={1} sx={{marginTop:4}}>
            <Item color="red" sx={{ display: 'flex', alignItems: 'center' }}>
                <InfoOutlinedIcon fontSize="large" sx={{ mr: 1,color:"white"}} />
                <Typography sx={{ fontSize: "1rem", fontWeight: "700", color: "red" }}>
                Eğer aşşağıda herhangi bir sıra göremiyorsanız lütfen dükkan sahibinin dükkanı açmasını bekleyiniz.
                </Typography>
            </Item>
            <Item sx={{ display: 'flex', alignItems: 'center', fontSize: "1rem", fontWeight: "700" }}>
                <InfoOutlinedIcon fontSize="large" sx={{ mr: 1,color:"white"}} />
                <Typography sx={{ fontSize: "1rem", fontWeight: "700"}}>
                    Sıra sistemi uygulanmaktadır. Hemen altta sırada kaç kişinin olduğunu ve TAHMİNİ bekleme süresini görebilirsiniz. Sıranız yaklaştığında size haber verilecektir.
                </Typography>
            </Item>
        </Stack>
        </div>
    )


}


export default Body1