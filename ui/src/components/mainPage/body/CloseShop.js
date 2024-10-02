import {Alert} from '@mui/material'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

export default function CloseShop(){
    const openingDate = useSelector( state => state.booking.otoOpeningDate)

    const [isDayEqual,setIDE] = useState(false)
    const [time,setTime] = useState(null)

    useEffect( () => {
        const newDate = new Date(openingDate)
        newDate.setHours(newDate.getHours() - 3)
        const nowDate = new Date()

        if(openingDate && newDate.getDay() === nowDate.getDay()){
            setIDE(true)
        }
        if(openingDate !== null){
            const hours = newDate.getHours().toString().padStart(2, '0')
            const minutes = newDate.getMinutes().toString().padStart(2, '0')
            
            setTime(`${hours}:${minutes}`)
        }

    },[openingDate])
    return (
        <div>
            {
                openingDate && isDayEqual ?
                    <Alert severity="warning" variant='outlined' color='primary' sx={{alignItems:"center",marginTop:5,fontWeight:'bold',color:'black'}}>
                        Dükkan SAAT {time} otomatik olarak açılacaktır.Sabrınız için teşekkürler.
                    </Alert>                
                :
                    <Alert severity="warning" variant='outlined' color='error' sx={{alignItems:"center",marginTop:5,fontWeight:'bold',color:'black'}}>
                        Dükkan şuanda kapalıdır lütfen dükkan sahibinin dükkanı açmasını bekleyiniz.
                    </Alert>                
            }

        </div>
    )
}