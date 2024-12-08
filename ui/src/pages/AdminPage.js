import { useEffect } from "react";
import AdminFirstPart from "../components/adminPage/AdminFirstPart.js";
import { useDispatch, useSelector } from 'react-redux';
import { controlAdminAccessToken } from "../redux/features/adminPageSlices/adminLoginSlice.js";
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import AdminQueTable from "../components/adminPage/AdminQueTable.js";
import FastOperations from "../components/adminPage/FastOperations.js";
import ShopSettings from "../components/adminPage/ShopSettings.js";
import ShopStats from "../components/adminPage/ShopStats.js";
import { updateStatus } from "../redux/features/adminPageSlices/shopStatusSlice.js";
import { socket } from "../helpers/socketio.js";
import { resetOtoDate } from "../redux/features/adminPageSlices/shopSettingsSlice.js";


function AdminPage() {
    const dispatch = useDispatch();
    const tokenError = useSelector(state => state.adminLogin.expiredError);
    const isLoading = useSelector(state => state.adminLogin.isLoading);
    const navigate = useNavigate();
     
    // Token control process
    useEffect(() => {
        dispatch(controlAdminAccessToken());
    }, [dispatch]);
    
    useEffect(() => {
        if (tokenError === true) {
            navigate('/adminLogin');
        }
    }, [tokenError, navigate]);

    // socket for oto opening
    useEffect(()=>{
        socket.on('oto-status-change',(datas) => {
          dispatch(updateStatus(datas.status))
        })
    
        return () => {
          socket.off('oto-status-change')
        }
      },[])
      
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }else{
        return (
            <div>
                <AdminFirstPart />
                <AdminQueTable />
                <FastOperations />
                <ShopSettings />
                <ShopStats />
            </div>
        );
    }
    
           
    

    
}

export default AdminPage;
