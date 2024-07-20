import { useEffect } from "react"
import AdminFirstPart from "../components/adminPage/AdminFirstPart.js"
import {useDispatch,useSelector} from 'react-redux'
import { controlAdminAccessToken } from "../redux/features/adminPageSlices/shopStatusSlice.js"
import { useNavigate } from 'react-router-dom';


function AdminPage(){
    const dispatch = useDispatch()
    const tokenError = useSelector( state => state.shopStatus.expiredError )
    const navigate = useNavigate()

    // Token control process
    useEffect(() => {
        dispatch(controlAdminAccessToken())
        if(tokenError === true){
            navigate('/adminLogin')
        }
    },[dispatch,navigate,tokenError])


    return (
        <div>
            <AdminFirstPart></AdminFirstPart>       
        </div>
    )
}

export default AdminPage