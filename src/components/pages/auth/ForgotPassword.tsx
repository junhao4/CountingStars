import React, { useEffect, useState, type FormEvent } from "react";
import supabase from "../../../helper/supabaseClient";
import Box from "@mui/material/Box";
import { usePageTitleContext } from "../../contexts/PageTitleContext";
import { Button, Input, Typography } from "@mui/material";
import { useMessageContext } from "../../contexts/MessageContext";

function ForgotPassword() {
  const [email, setEmail] = useState("")
  const { setTitle } = usePageTitleContext()
  const { createMessage } = useMessageContext()

  const handleSubmit = async () => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/reset",
    });
    if (error) {
      createMessage('error', error.message)
      return
    }  
    createMessage('success', "A link was sent to your email")
  }

  useEffect(() => {
    setTitle("Reset Password")
  }, []);

  return (
    <Box display='flex' flexDirection='column' justifySelf='center' alignItems='start' color='var(--foreground)'
            sx={{ outline: '2px solid black', borderRadius: '2px', margin: '2rem' }}>
      <Typography variant="h6" padding='1rem 2rem 0 2rem'>Reset your Password</Typography>
      <Typography variant="body1" padding='0 2rem 1rem 2rem'>
        Type in your email and we'll send you a link to reset your password
      </Typography>
      <Box display='flex' gap='2rem' alignItems='center' padding='1rem 2rem 2rem 2rem' 
        width='calc(100% - 4rem)' boxShadow='0 -2px 0 black'>
        <Typography>Email: </Typography>
        <Input sx={{flexGrow:1}} value={email} onChange={(e) => setEmail(e.target.value)}/>
      </Box>
      <Button sx={{alignSelf:'center', margin:'0 0 2rem 0'}} onClick={handleSubmit}>Submit</Button>
    </Box>
  )
}

export default ForgotPassword
