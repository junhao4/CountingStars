import { useState } from 'react'
import supabase from '../../../helper/supabaseClient';
import { Box, Button, Input, Typography } from '@mui/material';
import { useMessageContext } from '../../contexts/MessageContext';

function ResetPassword() {

const [password, setPassword] = useState("");
const { createMessage } = useMessageContext()
   
 const handleReset = async () => {
        const {data, error} = await supabase.auth.updateUser({password})
        console.log(data)
        if (error) {
                createMessage("error", error.message);
                return;
            } else {
        
            console.log("Sign-up successful!");
            createMessage("success", "Password reset was successful")
            }
                
    }

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
        <Input sx={{flexGrow:1}} value={password} onChange={(e) => setPassword(e.target.value)}/>
      </Box>
      <Button sx={{alignSelf:'center', margin:'0 0 2rem 0'}} onClick={handleReset}>Submit</Button>
    </Box>
    </>
    );
}

export default ResetPassword;