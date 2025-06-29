import { useEffect, useState } from "react";
import supabase from "../../../helper/supabaseClient.ts";
import { usePageTitleContext } from "../../contexts/PageTitleContext";
import { useSessionContext } from "../../contexts/SessionContext.tsx";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Input, Button } from "@mui/material";
import { useMessageContext } from "../../contexts/MessageContext.tsx";

export function Register() {
  const navigate = useNavigate()
  const { createMessage } = useMessageContext()
  const { session } = useSessionContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (email == "" || password == "") {
      createMessage('warning', "Please fill in the blanks");
      return;
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: "https://counting-stars-jade.vercel.app/verify",
        },
      });
      if (error) {
        createMessage("error", error.message)
        return;
      }

      if (data.user?.identities && data.user.identities.length > 0) {
        console.log("Sign-up successful!");
        createMessage('success', "A link was sent to your email");
      } else {
        console.log("Email address is already taken.");
        createMessage('warning', "Email address is already taken.");
      }
    }
  };

  //Set header title to Register
  const { setTitle } = usePageTitleContext();

  useEffect(() => {
    setTitle("Registration");
  }, []);

  useEffect(() => {
    if (session) {
      navigate("/dashboard");
    }
  }, [session]);

  return (
    <Box display='flex' flexDirection='column' justifySelf='center' alignItems='center' color='var(--foreground)'
      sx={{ outline: '2px solid black', borderRadius: '2px', margin: '2rem' }}>
      <Box display='flex' gap='2rem' alignItems='center' margin='2rem 2rem 0 2rem'>
        <Typography>Email: </Typography>
        <Input value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder='Email' />
      </Box>
      <Box display='flex' gap='2rem' alignItems='center' margin='2rem'>
        <Typography>Password: </Typography>
        <Input value={password} onChange={(e) => setPassword(e.target.value)} type='password'
          placeholder='Password' sx={{ marginRight: '1.75rem' }} />
      </Box>
      <Button onClick={handleRegister} sx={{ justifySelf: 'center', marginBottom:'3.5rem' }}>Register</Button>
    </Box>
  )
}
