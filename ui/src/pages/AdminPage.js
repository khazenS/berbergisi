import { useEffect } from "react"
import AdminFirstPart from "../components/adminPage/AdminFirstPart.js"
import {useDispatch,useSelector} from 'react-redux'
import { controlAdminAccessToken } from "../redux/features/adminPageSlices/adminLoginSlice.js"
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

function AdminPage(){
    const dispatch = useDispatch()
    const tokenError = useSelector( state => state.adminLogin.expiredError)
    const isLoading = useSelector( state => state.adminLogin.isLoading)
    const navigate = useNavigate()

    // Token control process
    useEffect(() => {
        dispatch(controlAdminAccessToken())
    },[dispatch])


    if(tokenError === true){
        navigate('/adminLogin')
        console.log('burda')
    }else if(isLoading === true){
        return(
            <Box sx={{display: 'flex',justifyContent: 'center',alignItems: 'center',height: '50vh', }}>
                <CircularProgress />
            </Box>
        )
    }
    else{
        return (
            <div>
                <AdminFirstPart></AdminFirstPart>       
            </div>
        )    
    }
    
}

export default AdminPage