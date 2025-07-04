import { useEffect } from "react";
import supabase from "../../../helper/supabaseClient";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Verify() {
  const navigate = useNavigate();

  const toLogin = () => {
    navigate('/login');
  };

  useEffect(() => {
    const handleRedirect = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        await supabase.auth.signOut();
      }
    };

    handleRedirect();
  }, []);

  return (<>
    <Box component="section" sx={{ p: 2, border: '2px solid black' }}>
      <Stack spacing={3} alignItems="center">
        <Typography sx={{ justifySelf: 'center' }} variant="h4" component="h1">
          Your email was successfully verified! Proceed to login.
        </Typography>
        <Button size="large" variant="contained" onClick={() => toLogin()}>
          Go to Login
        </Button>
      </Stack>
    </Box>
  </>
  );
}

export default Verify;
