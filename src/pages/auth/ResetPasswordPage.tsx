import { useEffect, useState } from 'react'
import supabase from '../../helper/supabaseClient';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useAlertContext } from '../../common/contexts/AlertContext';
import { usePageTitleContext } from '../../common/contexts/PageTitleContext';

export default function ResetPasswordPage() {
  const { setTitle } = usePageTitleContext()
  const { createAlert } = useAlertContext()

  const [password, setPassword] = useState("");

  const handleReset = async () => {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      console.log(error.message);
      createAlert("warning", error.message)
      return;
    } else {
      createAlert("success", "Password reset was successful")
    }

  }

  useEffect(() => {
    setTitle("Reset Password")
  }, [])

  return (
    <>
      <Box display='flex' flexDirection='column' justifySelf='center' alignItems='start'
        sx={{ outline: '2px solid var(--border)', borderRadius: '2px', margin: '2rem' }}>
        <Typography variant="h6" padding='1rem 2rem 0 2rem'>Reset your Password</Typography>
        <Typography variant="body1" padding='0 2rem 1rem 2rem'>
          Type in a new secure password and press submit to update your password
        </Typography>
        <Box display='flex' gap='2rem' alignItems='center' padding='1rem 2rem 2rem 2rem'
          width='calc(100% - 4rem)' boxShadow='0 -2px 0 var(--border)'>
          <Typography sx={{ pt: 2 }}>Password: </Typography>


          <TextField
            id="login-email-input"
            label="Password"
            type="text"
            autoComplete="password"
            variant="standard"
            color="secondary"
            onChange={(e) => setPassword(e.target.value)}
            sx={{ flexGrow: 1 }}

          />
        </Box>
        <Button sx={{ alignSelf: 'center', margin: '0 0 2rem 0', color: 'var(--secondary)', borderColor: 'var(--secondary)' }} onClick={handleReset}>Submit</Button>
      </Box>
    </>
  );
}