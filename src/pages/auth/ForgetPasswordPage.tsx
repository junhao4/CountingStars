import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { usePageTitleContext } from "../../common/contexts/PageTitleContext";
import { Button, TextField, Typography } from "@mui/material";
import { useAlertContext } from "../../common/contexts/AlertContext";
import { resetPasswordForEmail } from "../../features/authentication/api/AuthApi";

export default function ForgetPassword() {
  const [email, setEmail] = useState("")
  const { setTitle } = usePageTitleContext()
  const { createAlert } = useAlertContext()

  const handleSubmit = () => resetPasswordForEmail({email, createAlert})

  useEffect(() => {
    setTitle("Reset Password")
  }, []);

  return (
    <Box display='flex' flexDirection='column' justifySelf='center' alignItems='start' color='var(--text)'
            sx={{ outline: '2px solid black', borderRadius: '2px', margin: '2rem' }}>
      <Typography variant="h6" padding='1rem 2rem 0 2rem'>Reset your Password</Typography>
      <Typography variant="body1" padding='0 2rem 1rem 2rem'>
        Type in your email and we'll send you a link to reset your password
      </Typography>
      <Box display='flex' gap='2rem' alignItems='center' padding='1rem 2rem 2rem 2rem' 
        width='calc(100% - 4rem)' boxShadow='0 -2px 0 black'>
        <Typography sx={{pt:2}}>Email: </Typography>
        
                             <TextField
                             
                  id="login-email-input"
                  label="Email"
                  type="text"
                  autoComplete="on"
                  variant="standard"
                  color="secondary"
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{flexGrow:1}}
        
                />
      </Box>
      <Button sx={{alignSelf:'center', margin:'0 0 2rem 0', color: 'var(--secondary)', borderColor: 'var(--secondary)'}} onClick={handleSubmit}>Submit</Button>
    </Box>
  )
}

