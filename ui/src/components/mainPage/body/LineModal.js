import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { Container, Fab, FormControlLabel, FormHelperText, FormLabel, InputAdornment, Radio, RadioGroup, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useDispatch, useSelector } from "react-redux";
import { controlForFetch, setRegisterState } from "../../../redux/features/mainPageSlices/registerSlice.js";

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

  
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    dispatch(setRegisterState({'nameType':'name','value':''}))
    dispatch(setRegisterState({'nameType':'phoneNumber','value':''}))
    setOpen(false)
  };

  const onInpF = (name,value)=>{
    dispatch(setRegisterState({'nameType':name,'value':value}))
  }

  const state = useSelector(state => state.register.values)
  console.log(state)

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
              <FormControlLabel value="cutAndBeard" control={<Radio />} label="Saç-Sakal" />
              <FormHelperText>Bu tahmini süre hesaplamada önemlidir.</FormHelperText>
              </RadioGroup>               
            </Box>

            <Box sx={{margin:2}}>
            <FormLabel >Kaç kişisiniz</FormLabel>
              <RadioGroup onChange={(e) =>{onInpF('comingWithValue',e.target.value)}} row defaultValue="one" name="radio-buttons-group">
              <FormControlLabel value="one" control={<Radio />} label="Tekim" />
              <FormControlLabel value="two" control={<Radio />} label="2" />
              <FormControlLabel value="three" control={<Radio />} label="3" />
              <FormControlLabel value="four" control={<Radio />} label="4" />
              <FormHelperText>Bu sıralamada önemlidir.</FormHelperText>
              </RadioGroup>               
            </Box>

            <Button variant="contained" onClick={() => {dispatch(controlForFetch())}} color="success" size="large" sx={{fontWeight:'bold',textTransform:'none'}}fullWidth={true} endIcon={<ArrowForwardIcon></ArrowForwardIcon>}>Sıraya gir</Button>

          </Box>
        </Box>
      </Modal>
    </Container>
  );
}
