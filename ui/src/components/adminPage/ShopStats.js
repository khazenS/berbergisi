import { Alert, Box, Card, CardContent, CircularProgress, Collapse, Container, Grid, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useDispatch, useSelector } from "react-redux";
import {
    getDailyStats,
  getMonthlyStats,
  getStats,
  getWeeklyStats,
  newFinishedCut,
  resetDaily,
} from "../../redux/features/adminPageSlices/shopStatsSlice";
import { socket } from "../../helpers/socketio";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

export default function ShopStats() {
  const dispatch = useDispatch();

  const dailyStatsValue = useSelector((state) => state.shopStats.dailyStats);
  const weeklyStatsValue = useSelector((state) => state.shopStats.weeklyStats);
  const monthlyStatsValue = useSelector((state) => state.shopStats.monthlyStats);


  const [openDailyStats,setDailyStats] = useState(false)
  const [openWeeklyStats,setWeeklyStats] = useState(false)
  const [openMonthlyStats,setMonthlyStats] = useState(false)
 
  useEffect( () => {
    console.log(weeklyStatsValue)
  },[weeklyStatsValue]) 
  // When status changed socket
  useEffect(() => {
    socket.on("changedStatus", (datas) => {
      if (datas === true) {
        dispatch(resetDaily());
      }
    });
    return () => {
      socket.off("changedStatus");
    };
  }, [dispatch]);

  const submitDaily = () => {
    if(openDailyStats == false && !dailyStatsValue.dataIsReady) dispatch(getDailyStats())
    setDailyStats(!openDailyStats)
  }

  const submitWeekly = () => {
    if(openWeeklyStats == false && !weeklyStatsValue.dataIsReady) dispatch(getWeeklyStats())
    setWeeklyStats(!openWeeklyStats)
  }

  const submitMonthly = () => {
    if(openMonthlyStats == false && !monthlyStatsValue.dataIsReady) dispatch(getMonthlyStats())
    setMonthlyStats(!openMonthlyStats)
  }
  return (
    <>
      <Container sx={{ marginTop: 5 }}>
        <Box sx={{ borderBottom: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            {" "}
            Dükkan İstatistikleri
          </Typography>
        </Box>

        <Box>
          <Grid container alignItems="center">
            <Grid item sx={{display:'flex',alignItems:'center',marginTop:2}}>
              <IconButton
                onClick={() => {
                  submitDaily()
                }}
              >
                {openDailyStats ? (
                  <KeyboardArrowUpIcon />
                ) : (
                  <KeyboardArrowDownIcon />
                )}
              </IconButton>

              <Typography variant="h6" sx={{ opacity: "0.6" }}>
                Günlük İstatistikleri al
              </Typography>
            </Grid>
          </Grid>
          <Collapse in={openDailyStats} timeout="auto" unmountOnExit sx={{ marginLeft: 5 }}>
            {dailyStatsValue.dataIsReady && dailyStatsValue.dailyIncome == 0 ?
            (
                <Alert variant="filled" severity="error">Henüz sıftah yapmadınız.</Alert>
            )
            :
            (
                <>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                        <Pie
                            data={dailyStatsValue.counts.filter(service => service.income > 0)}
                            dataKey="income"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label={({ name ,income }) => `${income} ₺`}
                        >
                            {(dailyStatsValue?.counts.filter(service => service.income > 0) || []).map((service, index) => (
                            <Cell key={`cell-${index}`} fill={service.color} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value, name, props) => [`${props.payload.count}`, `${name} sayısı`]} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={{ textAlign: "center", marginTop: "10px" }}>
                        {(dailyStatsValue?.counts.filter(service => service.income > 0) || []).map((service) => (
                        <div key={service.name} style={{ display: "inline-block", marginRight: "10px" }}>
                            <span
                            style={{
                                display: "inline-block",
                                width: "12px",
                                height: "12px",
                                backgroundColor: service.color,
                                marginRight: "5px",
                            }}
                            ></span>
                            <span style={{ fontWeight:'bold' }}>
                                {service.name} 
                            </span>
                        </div>
                        ))}
                    </div>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Typography variant="h6" sx={{ marginTop: 2, fontWeight: 'bold', fontSize: 18 }}>
                    Toplam Gelir {dailyStatsValue.dailyIncome} ₺
                    </Typography>
                </Box>
                </>
            )}
            </Collapse>

        </Box>


          <Grid container alignItems="center">
            <Grid item sx={{display:'flex',alignItems:'center',marginTop:2}}>
              <IconButton
                onClick={() => {
                  submitWeekly()
                }}
              >
                {openWeeklyStats ? (
                  <KeyboardArrowUpIcon />
                ) : (
                  <KeyboardArrowDownIcon />
                )}
              </IconButton>

              <Typography variant="h6" sx={{ opacity: "0.6" }}>
                Haftalık İstatistikleri al
              </Typography>
            </Grid>
          </Grid>

          <Collapse in={openWeeklyStats} timeout="auto" unmountOnExit sx={{ marginLeft: 5 }}>
          {weeklyStatsValue.dataIsReady && weeklyStatsValue.weeklyIncome == 0 ?
            (
              <Alert variant="filled" severity="error">Henüz sıftah yapmadınız.</Alert>
            )
            :
            <>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyStatsValue.counts}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`Gelir: ${value} ₺`]}/>
                  <Bar dataKey="income" fill="#4CAF50" />
                </BarChart>
              </ResponsiveContainer>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography variant="h6" sx={{ marginTop:1, fontWeight: 'bold', fontSize: 18 }}>
                  Toplam Gelir {weeklyStatsValue.weeklyIncome} ₺
                </Typography>
              </Box>            
            </>
          }
          </Collapse>

          <Grid container alignItems="center">
            <Grid item sx={{display:'flex',alignItems:'center',marginTop:2}}>
              <IconButton
                onClick={() => {
                  submitMonthly()
                }}
              >
                {openMonthlyStats ? (
                  <KeyboardArrowUpIcon />
                ) : (
                  <KeyboardArrowDownIcon />
                )}
              </IconButton>

              <Typography variant="h6" sx={{ opacity: "0.6" }}>
                Aylık İstatistikleri al
              </Typography>
            </Grid>
          </Grid>

          <Collapse in={openMonthlyStats} timeout="auto" unmountOnExit sx={{ marginLeft: 5 }}>
              {monthlyStatsValue.dataIsReady && monthlyStatsValue.counts[0].income == 0 ?
                (
                    <Alert variant="filled" severity="error">Henüz sıftah yapmadınız.</Alert>
                )
                :
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={monthlyStatsValue.counts} dataKey="income" nameKey="name" cx="50%" cy="50%" outerRadius={100}  label={({ name, value }) => `${name}: ${value} ₺`}>
                      <Cell key="cell-0" fill="#4CAF50" />
                      <Cell key="cell-1" fill="#FF9800" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>                 
              }
          </Collapse>
      </Container>
    </>
  );
}
