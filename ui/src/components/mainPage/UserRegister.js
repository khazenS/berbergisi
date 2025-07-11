import { useEffect, useState } from 'react';
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Box,
  IconButton,
  Typography,
  Checkbox,
  FormControlLabel,
  Container,
  TextField,
  InputAdornment,
  Slide,
  Alert,
  CircularProgress,
  LinearProgress
} from "@mui/material";
import SmsIcon from '@mui/icons-material/Sms';
import CloseIcon from '@mui/icons-material/Close';
import { RamenDining, TimerOutlined } from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import { resetSendStatus, send_sms, updateExpiresTime, verify_sms } from '../../redux/features/mainPageSlices/verificationUserSlice';
import { useDispatch, useSelector } from 'react-redux';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function UserRegister() {
  const sendErrorMessage = useSelector((state) => state.verification.send.errorMessage);
  const sendStatus = useSelector((state) => state.verification.send.status);
  const sendIsLoading = useSelector((state) => state.verification.send.isLoading);
  const sendToken = useSelector((state) => state.verification.send.token);
  const expireTime = useSelector((state) => state.verification.send.expireTime);
  const dispatch = useDispatch();
  const [openRegisterModal, setOpenRegisterModal] = useState(false);

  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [showError, setShowError] = useState(false);

  const [fullName, setFullName] = useState('');
  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState('');

  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState(false);
  const [phoneErrorMessage, setPhoneErrorMessage] = useState('');

  const [smsCode , setSmsCode] = useState('');
  const [codeError, setCodeError] = useState(false);
  const [codeErrorMessage, setCodeErrorMessage] = useState('');

  const [fingerprint, setFingerprint] = useState(null);
  const [fpError, setfpError] = useState(false);

  const [rpeError,setRpeError] = useState(false);

  const [remainingTime, setRemainingTime] = useState(expireTime) 
  // This is for a bug that status doesnt change when verification is successful
  const [verifyStatus,setVerifyStatus] = useState(null)
  const [verifyMessage,setVerifyMessage] = useState('')

  // Load FingerprintJS and get the visitor ID
  useEffect( () => {
    const loadFingerprint = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      setFingerprint(result.visitorId);
    };
  
    loadFingerprint();
  },[])

  // Load recaptcha script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.REACT_APP_RECAPTCHA_SITE_KEY}`;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Update remainingTime when it changes
  useEffect(() => {
    if (!expireTime || expireTime <= 0 ) {
      return;
    }
    setRemainingTime(expireTime);
    const interval = setInterval(() => {
      setRemainingTime(prev => {
        const newTime = prev - 1000;
        if (newTime <= 0) {
          clearInterval(interval);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    // Cleanup function
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [expireTime]); 

  const formatTime = (ms) => {
    if (ms <= 0) return "00:00";
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };
  const progressValue = Math.max(0, Math.min((remainingTime / expireTime) * 100, 100));

  const checkeInputField = () => {
    let isError = false;
    if (!fullName || fullName.trim() === '') {
      setNameError(true);
      setNameErrorMessage('Lütfen adınızı giriniz.');
      isError = true;
    }
    if(fullName.trim().length < 3 || fullName.trim().length > 20) {
      setNameError(true);
      setNameErrorMessage('Adınız 3 ile 20 karakter arasında olmalıdır.');
      isError = true;
    }
    if (!phoneNumber || phoneNumber.trim() === '') {
      setPhoneError(true);
      setPhoneErrorMessage('Lütfen telefon numaranızı giriniz.');
      isError = true;
    }
    if(phoneNumber.length != 12) {
      setPhoneError(true);
      setPhoneErrorMessage('Lütfen geçerli bir telefon numarası giriniz.');
      isError = true;
    }

    return isError;
  }

  const handlePhoneNumberChange = (event) => {
    const input = event.target.value;
    // Remove the prefix, spaces, and any non-digit characters
    let digitsOnly = input.replace(/\+90\s?/, '').replace(/\D/g, '');
    // Limit to 10 digits
    digitsOnly = digitsOnly.slice(0, 10);
    
    // Format the phone number with spaces (XXX XXX XXXX)
    let formatted = '';
    if (digitsOnly.length > 0) {
      formatted = digitsOnly.slice(0, 3);
      if (digitsOnly.length > 3) {
        formatted += ' ' + digitsOnly.slice(3, 6);
      }
      if (digitsOnly.length > 6) {
        formatted += ' ' + digitsOnly.slice(6);
      }
    }
    
    // Update the state with the prefix and formatted number
    setPhoneNumber(formatted);
    // Reset errors
    setPhoneError(false);
    setPhoneErrorMessage('');
  }

  const handleSendSMS = async () => {
    if (!isCheckboxChecked) {
      setShowError(true);
      return;
    }
    if(checkeInputField() == true) return;

    if (!fingerprint) {
      setfpError(true);
      return;
    }

    let reCAPTCHAToken;
    try{
      reCAPTCHAToken = await window.grecaptcha.execute(process.env.REACT_APP_RECAPTCHA_SITE_KEY, { action: 'send_sms' });     
    }catch(error) {
      setRpeError(true);
      return;
    }

    dispatch(send_sms({name:fullName, phoneNumber: phoneNumber, reCAPTCHAToken:reCAPTCHAToken , fingerprint: fingerprint}))
  };

  const handleVerifySMS = async () => {
    if(!smsCode || smsCode.trim() === '' || smsCode.length < 4) {
      setCodeError(true);
      setCodeErrorMessage('**Lütfen geçerli bir kod giriniz.');
      return;
    }

    if(remainingTime <= 0) {
      setCodeError(true);
      setCodeErrorMessage('* Kodun süresi dolmuştur. Lütfen tekrar sms isteyiniz.');
      return;
    }

    let reCAPTCHAToken;
    try{
      reCAPTCHAToken = await window.grecaptcha.execute(process.env.REACT_APP_RECAPTCHA_SITE_KEY, { action: 'send_sms' });      
    }catch(error) {
      setRpeError(true);
      return;
    }

    try{
    const result = await dispatch(verify_sms({token: sendToken, code: smsCode, reCAPTCHAToken: reCAPTCHAToken})).unwrap()  
    if(result.status) resetForm()
    setVerifyStatus(result.status);
    setVerifyMessage(result.message);
  }catch(error){
    console.error('Error verifying SMS:', error);
    setVerifyStatus(false);
    }
  }

  const handleCheckboxChange = (event) => {
    setIsCheckboxChecked(event.target.checked);
    if (event.target.checked) {
      setShowError(false);
    }
  };

  // When verification successful, close the modal and reset the form
  const resetForm = () => {
    setOpenRegisterModal(false);
    dispatch(resetSendStatus())
    setFullName('');
    setPhoneNumber('');
    setSmsCode('');
    setIsCheckboxChecked(false);
    setShowError(false);
    setNameError(false);
    setPhoneError(false);
    setCodeError(false);
    setfpError(false);
    setRpeError(false);
    dispatch(updateExpiresTime(0))
  }
  return (
      <div>
        {/* Button for register  */}
        <Button 
          color="primary" 
          size="large" 
          variant="contained" 
          fullWidth 
          sx={{ marginTop: 3, fontWeight:'bold'}} 
          onClick={() => setOpenRegisterModal(true)}
        >
          Sisteme Kayit ol
        </Button>

        <Dialog
          open={openRegisterModal}
          onClose={() => {
            setOpenRegisterModal(false)     
          }}
          aria-labelledby="register-dialog-title"
          PaperProps={{
            sx: {
              width: '100%',
              maxWidth: '90%',
            }
          }}
        >
          {/* Only closing button */}
          <Box sx={{ 
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
            display: 'flex', 
            justifyContent: 'flex-end', 
            padding: 1
          }}>
            <IconButton
              aria-label="close"
              onClick={() => {
                setOpenRegisterModal(false)     
              }}
              sx={{ color: (theme) => theme.palette.grey[500] }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Title Section */}
          <DialogTitle 
            id="register-dialog-title"
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '1.5rem',
            }}
          >
            Sisteme Kayıt Ol 
          </DialogTitle>

          {/* Body Section */}
          <Box>
            {/* get confirmation part  */}
            <DialogInfoPart isChecked={isCheckboxChecked} showError={showError} onCheckboxChange={handleCheckboxChange} sendStatus={sendStatus} />

            <Container sx={{ mt:3}}>
            {/* Name text field part */}
            <Box sx={{ mb: 3 }}>
              <TextField
                variant="outlined"
                fullWidth
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value)
                  //Reset errors
                  setNameError(false)
                  setNameErrorMessage('')
                }}
                error={nameError}
                helperText={nameError ? nameErrorMessage : ''}
                disabled={sendStatus || fpError || rpeError}
                placeholder="Adınızı Giriniz"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ ml: 1 }}>
                      <PersonIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderRadius: '40px',
                    },
                    '& input': {
                      pl: 0.4,
                    },
                  },
                }}
              />
            </Box>
            {/* Phone number text field part */}
            <Box sx={{ mb: 4 }}>
              <TextField
                variant="outlined"
                fullWidth
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                disabled={sendStatus || fpError || rpeError}
                placeholder="Telefon Numaranız"
                error={phoneError}
                helperText={phoneError ? phoneErrorMessage : ''}
                InputProps={{
                  startAdornment: (
                    <>
                    <Box sx={{ pr: 1 , display: 'flex', alignItems: 'center'}}>
                        <InputAdornment position="start" sx={{ ml: 1 }}>
                          <PhoneIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                        <Typography sx={{ color: 'text.secondary' }} > +90 </Typography>                        
                    </Box>
                    </>
                  ),
                  inputProps: {
                    maxLength: 12, // Limit to 10 digits
                    inputMode: 'numeric', // Show numeric keyboard on mobile
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderRadius: '40px',
                    },
                    '& input': {
                      pl: 0, 
                    },
                  },
                }}/>
            </Box>

            </Container>
            {/* Code sent part */}
            {
              sendIsLoading ? 
              <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 3 }}>
                <CircularProgress size={40} thickness={4} />
              </Container>
              :
              sendStatus ? (
                <Container sx={{ mb: 3 }}>
                <Slide 
                  direction="down" 
                  in={sendStatus} 
                  mountOnEnter 
                  unmountOnExit
                >
                  <Container>
                    <Box 
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mb: 2,
                        animation: 'slideDown 0.5s ease-in-out'
                      }}>
                      <Typography variant='h6' sx={{ fontWeight: 'bold'}}>
                        ~ SMS Doğrulama ~
                      </Typography>                    
                    </Box>
                    <TextField
                    variant="outlined"
                    fullWidth
                    value={smsCode}
                    onChange={(e) => {
                      const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
                      if (onlyNumbers.length <= 4) {
                        setSmsCode(onlyNumbers);
                        setCodeError(false);
                        setCodeErrorMessage('');
                      }
                    }}
                    error={codeError}
                    helperText={codeError ? codeErrorMessage : '* Telefonunuza gönderilen 4 haneli kodu giriniz.'}
                    placeholder={'• '.repeat(4 - (smsCode?.length || 0))}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ ml: 1 }}>
                          <SmsIcon sx={{ 
                            color: codeError ? 'error.main' : 'text.secondary',
                            animation: 'bounce 1s infinite'
                          }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderRadius: '40px',
                        },
                        '& input': {
                          pl: 0.4,
                          letterSpacing: '0.5em',
                          textAlign: 'center'
                        },
                      },
                      '@keyframes bounce': {
                        '0%, 100%': {
                          transform: 'translateY(0)',
                        },
                        '50%': {
                          transform: 'translateY(-3px)',
                        },
                      }
                    }}
                    inputProps={{
                      maxLength: 4,
                      inputMode: 'numeric',
                    }}
                    />
                  </Container>
                </Slide>
              </Container>
            ) 
            : <></>}
            { expireTime && remainingTime > 0 ?
            // Countdown and progress bar part
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 2 }}>
                <Box sx={{ width: "80%" }}>
                  <LinearProgress
                    variant="determinate"
                    value={progressValue}
                    sx={{
                      height: 6,
                      borderRadius: 5,
                      backgroundColor: "#e0e0e0",
                    }}
                  />
                </Box>
                <Box sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "flex-end",
                    mt: 1,
                    gap: 1 
                  }}>
                  <TimerOutlined sx={{ 
                    color: "text.secondary",
                    fontSize: "1.5rem"
                  }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      width: "auto",
                      fontWeight: 'bold',
                      fontSize: '1.5rem',
                      color: "text.secondary"
                    }}
                  >
                    {formatTime(remainingTime)}
                  </Typography>
                </Box>
              </Box>
             : <></> }

            {/* Error message part */}
              { (fpError || rpeError || sendErrorMessage || verifyStatus === false) && 
              <ShowError sendErrorMessage={sendErrorMessage} wrongCodeMessage={verifyMessage} />
            }
            
            { /* Button for code sent */}
            {
              sendStatus ?
              (
                <DialogActions sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  pb: 2 
                }}>
                  <Button 
                    onClick={handleVerifySMS} 
                    color="success"
                    variant="contained"
                    sx={{
                      fontWeight: 'bold',
                      width: '80%',
                      borderRadius: '10px',
                      textTransform: 'none',
                      fontSize: '1rem',
                      py: 1
                    }}
                  >
                    Doğrula
                  </Button>
                </DialogActions>    
              )
              :
              (
                <DialogActions sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  pb: 2 
                }}>
                  <Button 
                    onClick={handleSendSMS} 
                    color="primary" 
                    variant="contained"
                    disabled={fpError || rpeError}
                    sx={{ 
                      fontWeight: 'bold',
                      width: '80%',
                      borderRadius: '10px',
                      textTransform: 'none',
                      fontSize: '1rem',
                      py: 1
                    }}
                  >
                    Kodu Yolla
                  </Button>
                </DialogActions>                
              )
            }
          </Box>
        </Dialog>
      </div>
  );
}


// DialogInfoPart component is only for the information part of the dialog and getting acceptance from the user
function DialogInfoPart({isChecked,showError, onCheckboxChange , sendStatus}) {
  return (
      <Box sx={{ px: 3 ,borderBottom: '1px solid rgba(0, 0, 0, 0.3)'}}>

      <Typography variant="body1" sx={{ mb: 2 }}>
        * Siteme kayıt olduğunuzda sizden aldığımız veriler tarafımızca gizli tutulacak ve sadece sizinle iletişim kurmak için kullanılacaktır.
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        * Kayıt işleminden tamamlandıktan sonra, hesabınızı ana ekrandan güncelleyebilir ve ayarlarınızı değiştirebilirsiniz.
      </Typography>      
      <Typography variant="body1" sx={{ mb: 2 }}>
        * Telefonunuzu ve tarayıcınızı değiştirmediğiniz sürece sisteme kayıtlı olacaksınız.
      </Typography>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center',
        pb:2
      }}>
        <FormControlLabel
          sx={{ 
            margin: 0,
            '& .MuiFormControlLabel-label': {
              marginLeft: '4px'
            },
            padding: 1,
            borderRadius: 1,
            backgroundColor: showError ? 'rgba(211, 47, 47, 0.05)' : 'transparent', // Çok hafif kırmızı arka plan
            transition: 'all 0.3s ease',
            border: showError ? '1px solid rgba(211, 47, 47, 0.3)' : '1px solid transparent', // Hafif kırmızı border
          }}  
          control={
            <Checkbox
            disabled={sendStatus}
              checked={isChecked}
              onChange={onCheckboxChange}
              sx={{
                color: showError ? 'error.main' : undefined,
                '&.Mui-checked': {
                  color: showError ? 'error.main' : undefined
                }
              }}
            />
          }
          label={
            <Typography 
            color={showError ? 'error' : 'inherit'}
            sx={{fontWeight: 'bold'}}
            >
              Onaylıyorum
            </Typography>
          }
        />
      </Box>
    </Box>
  )
}

// Show code sent error if exists
function ShowError({ sendErrorMessage , wrongCodeMessage }) {
  return (
    <Container sx={{ mb: 3 }}>
      <Typography
        variant="caption"
        color="error"
        sx={{
          fontWeight: 'bold',
          display: "block",
          mt: 1,
          ml: 1 ,
          display: "flex",
          alignItems: "center",
          gap: 0.5,
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: "1.4rem" }} />
        {
          wrongCodeMessage || sendErrorMessage || "Cihaz bilgileri alınamadı. Lütfen izinlerinizi kontrol edin ve sayfayı yenileyin."
        }
      </Typography>
    </Container>
  );
}