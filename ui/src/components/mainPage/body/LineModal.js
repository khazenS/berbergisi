import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { Container, Fab, FormControlLabel, FormHelperText, FormLabel, InputAdornment, Radio, RadioGroup, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useDispatch, useSelector } from "react-redux";
import { controlForFetch,registerUser,updateRegisterState } from "../../../redux/features/mainPageSlices/registerSlice.js";
import { increaseQueue } from "../../../redux/features/mainPageSlices/dailyBookingSlice.js";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 1.25,
};

export default function LineModal() {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch()
  // This is for setting errors for fetch data
  const [submitClicked,setSubmitClicked] = React.useState(false)
  //registerSlice state
  const state = useSelector(state => state.register.values)
  //Fonctions for model process
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    dispatch(updateRegisterState({'nameType':'name','value':''}))
    dispatch(updateRegisterState({'nameType':'phoneNumber','value':''}))
    setOpen(false)
  };
  const onInpF = (name,value)=>{
    dispatch(updateRegisterState({'nameType':name,'value':value}))
  }

  //submit process
  const handleSubmit = () =>{
    setSubmitClicked(true)
    dispatch(controlForFetch())
  }
  React.useEffect(()=>{
    if(submitClicked){
      if(state.errors.length === 0 ){
        dispatch(registerUser(state))
      }
    }
    setSubmitClicked(false)
  },[state,submitClicked,dispatch])


  return (
    <Container>
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{
          margin: "1.75rem auto",
          display: "block",
          fontSize: "1.2rem",
          fontWeight: "bold",
        }}
        color="success"
      >
        Hemen Sıra Al
      </Button>

      
      <Modal
        open={open}
      >
        <Box sx={style}>
          <Box>
            <Fab color="error" size="small" onClick={handleClose} sx={{ marginLeft: "auto", display: "flex" }}><CloseIcon /></Fab>
            <TextField onChange={(e) =>{onInpF('name',e.target.value)}} 
            error={state.errors.indexOf("nameRequired") !== -1} helperText={state.errors.indexOf("nameRequired") !== -1?"Lütfen tam isminizi giriniz.":""} 
            label="İsminiz" variant="outlined" inputProps={{ maxLength: 20 }} InputLabelProps={{shrink: true}} sx={{display:'flex' , m:2}}/>

            <TextField onChange={(e) =>{onInpF('phoneNumber',e.target.value)}} 
            error={state.errors.indexOf("wrongNumber") !== -1} helperText={state.errors.indexOf("wrongNumber") !== -1?"Lütfen numaranızı eksiksiz giriniz.":""}  
            type="number" InputLabelProps={{shrink: true}} label="Telefon Numaranız" variant="outlined"   
            sx={{display:'flex',m:2}} InputProps={{startAdornment: (<InputAdornment position="start">+90</InputAdornment>),}}/>
            
            <Box sx={{margin:2}}>
            <FormLabel >Traş</FormLabel>
              <RadioGroup onChange={(e) =>{onInpF('cutValue',e.target.value)}} row defaultValue="cut" name="radio-buttons-group">
              <FormControlLabel value="cut" control={<Radio />} label="Saç" />
              <FormControlLabel value="cutB" control={<Radio />} label="Saç-Sakal" />
              <FormHelperText>Bu tahmini süre hesaplamada önemlidir.</FormHelperText>
              </RadioGroup>               
            </Box>

            <Box sx={{margin:2}}>
            <FormLabel>Kaç kişisiniz</FormLabel>
              <RadioGroup onChange={(e) =>{onInpF('comingWithValue',e.target.value)}} row defaultValue="1" name="radio-buttons-group">
              <FormControlLabel value="1" control={<Radio />} label="Tekim"  />
              <FormControlLabel value="2" control={<Radio />} label="2" />
              <FormControlLabel value="3" control={<Radio />} label="3" />
              <FormControlLabel value="4" control={<Radio />} label="4" />
              <FormHelperText>Bu sıralamada önemlidir.</FormHelperText>
              </RadioGroup>               
            </Box>

            <Button variant="contained" onClick={()=>{handleSubmit()}} color="success" size="large" sx={{fontWeight:'bold',textTransform:'none'}}fullWidth={true} endIcon={<ArrowForwardIcon></ArrowForwardIcon>}>Sıraya gir</Button>

          </Box>
        </Box>
      </Modal>
    </Container>
  );
}
