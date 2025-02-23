import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { updateFCMToken } from "../../redux/features/adminPageSlices/notificationSlice.js" 

export default function Notification(){
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const notificationExpired = useSelector( state => state.notification.expiredError)
    useEffect( () => {
        dispatch(updateFCMToken())
    },[])

    useEffect( () => {
        if(notificationExpired === true){
            navigate('/adminLogin')
        }
    },[navigate,notificationExpired])

    return (
        <></>
    )
}