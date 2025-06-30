import { Alert, AlertTitle, Box, Button, Grow } from "@mui/material";
import { useMessageContext } from "../contexts/MessageContext";
import CloseIcon from "@mui/icons-material/Close";

export default function Message() {
  const { variant, text, trigger, setTrigger } = useMessageContext();

  return (
    <Box
      sx={{
          ...(trigger ? {}: {pointerEvents: 'none'}),
          position: "fixed",
          width: "80vw",
          transform: "translateX(10%)",
          zIndex: "2",
          backgroundColor: 'transparent',
        }}
    >
      <Grow
        in={trigger}
        style={{ transformOrigin: "0 0 0" }}
        {...(trigger ? { timeout: 1000 } : {})}
      >
        <Alert
          severity={variant}
          variant="filled"
          color={variant}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => setTrigger(false)}
            >
              <CloseIcon></CloseIcon>
            </Button>
          }
        >
          <AlertTitle>
            {variant.charAt(0).toUpperCase() + variant.slice(1)}
          </AlertTitle>
          {text}
        </Alert>
      </Grow>
    </Box>
  );
}
