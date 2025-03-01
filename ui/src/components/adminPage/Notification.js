import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { subscribeUserToNotification } from "../../redux/features/adminPageSlices/notificationSlice.js" 
import { requestNotificationPermission } from "../../helpers/notificationHelper.js"


export default function Notification(){
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        requestNotificationPermission().then((result) => {
            if(result) dispatch(subscribeUserToNotification())
        })
    },[dispatch])

   const notificationExpired = useSelector( state => state.notification.expiredError)

    useEffect( () => {
        if(notificationExpired === true){
            navigate('/adminLogin')
        }
    },[navigate,notificationExpired])

    return (
        <div></div>
    )
}