import { useEffect, useState } from 'react'
import supabase from '../../helper/supabaseClient';
import { Box, Button, Input, Typography } from '@mui/material';
import { useAlertContext } from '../../common/contexts/AlertContext';
import { usePageTitleContext } from '../../common/contexts/PageTitleContext';

export default function ResetPasswordPage() {
  const {setTitle} = usePageTitleContext()
  const [password, setPassword] = useState("");
  const { createAlert } = useAlertContext()

  const handleReset = async () => {
    const { data, error } = await supabase.auth.updateUser({ password })
    console.log(data)
    if (error) {
      createAlert("error", error.message);
      return;
    } else {

      console.log("Sign-up successful!");
      createAlert("success", "Password reset was successful")
    }

  }

  useEffect(() => {
    setTitle("Reset Password")
  }, [])

  return (
    <>
      <Box display='flex' flexDirection='column' justifySelf='center' alignItems='start' color='var(--foreground-text)'
        sx={{ outline: '2px solid black', borderRadius: '2px', margin: '2rem' }}>
        <Typography variant="h6" padding='1rem 2rem 0 2rem'>Reset your Password</Typography>
        <Typography variant="body1" padding='0 2rem 1rem 2rem'>
          Type in a new secure password and press submit to update your password
        </Typography>
        <Box display='flex' gap='2rem' alignItems='center' padding='1rem 2rem 2rem 2rem'
          width='calc(100% - 4rem)' boxShadow='0 -2px 0 black'>
          <Typography>Password: </Typography>
          <Input sx={{ flexGrow: 1 }} value={password} onChange={(e) => setPassword(e.target.value)} />
        </Box>
        <Button sx={{ alignSelf: 'center', margin: '0 0 2rem 0' }} onClick={handleReset}>Submit</Button>
      </Box>
    </>
  );
}