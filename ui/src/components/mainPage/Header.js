import {   Button, Grid,  Typography } from '@mui/material'
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import gisiLogo from '../../static/gisiLogo.png'
function Header(){
    return (
        <Grid container spacing={2} sx={{marginBottom:3}}>
        <Grid item xs={3}  sx={{display:'flex',justifyContent:'center'}}>
            <img src={gisiLogo} alt="gisiLogo" height={60} width={60} />
        </Grid>
        <Grid item xs={9}  sx={{display:'flex',justifyContent:'center',alignItems:'center'}}>
            <Button href='tel:+905323555754' variant='contained' size='medium' color='success'>
            <LocalPhoneOutlinedIcon fontSize="medium"></LocalPhoneOutlinedIcon>
            <Typography sx={{marginLeft:1,fontWeight:'bold'}}>Ara +905323555754</Typography>
            </Button>

        </Grid>
        </Grid>
    )
}
export default Header