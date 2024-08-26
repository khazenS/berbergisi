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
        if (tokenError) {
            navigate('/adminLogin');
        }
    }, [tokenError, navigate]);

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
            </div>
        );
    }
    
           
    

    
}

export default AdminPage;
