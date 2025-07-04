import { useEffect } from "react";
import { usePageTitleContext } from "../../contexts/PageTitleContext";
import { Box } from "@mui/material";
import EmailRegisterForm from "./EmailRegisterForm";

export function Register() {
  const { setTitle } = usePageTitleContext()

  useEffect(() => {
    setTitle("Registration");
  }, []);

  return (
    <Box display='flex' flexDirection='column' justifySelf='center' alignItems='center' color='var(--foreground-text)'
      sx={{ outline: '2px solid black', borderRadius: '2px', margin: '2rem' }}>
        <EmailRegisterForm />

    </Box>
  )
}
