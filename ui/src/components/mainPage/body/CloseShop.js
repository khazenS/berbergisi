import {Alert} from '@mui/material'

export default function CloseShop(){
    return (
        <div>
            <Alert severity="warning" variant='outlined' color='error' sx={{alignItems:"center",marginTop:5,fontWeight:'bold',color:'black'}}>
                Dükkan şuanda kapalıdır lütfen dükkan sahibinin dükkanı açmasını bekleyiniz.
            </Alert>
        </div>
    )
}