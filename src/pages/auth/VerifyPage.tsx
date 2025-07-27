import { useEffect } from "react";
import supabase from "../../helper/supabaseClient";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { usePageTitleContext } from "../../common/contexts/PageTitleContext";
import { useSessionContext } from "../../common/contexts/SessionContext";

export default function VerifyPage() {
  const navigate = useNavigate();
  const { setTitle } = usePageTitleContext()
  const { user } = useSessionContext()

  const toLogin = () => {
    navigate('/login');
  };

  useEffect(() => {
    setTitle("Verification")

    if (user) {
      supabase.auth.signOut()
    }
    
  }, []);

  return (<>
    <Box component="section" sx={{ m: '2rem 0', p: 2, border: '2px solid var(--border)', borderRadius: '2rem'}}>
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
