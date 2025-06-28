import { Alert, AlertTitle, Box, Button, Grid, Grow } from "@mui/material";
import { useMessageContext } from "../contexts/MessageContext";
import { blue, red } from "@mui/material/colors";
import CloseIcon from "@mui/icons-material/Close";

export default function Message() {
  const { variant, text, trigger, setTrigger } = useMessageContext();

  return (
    <div
      style={{
        position: "fixed",
        width: "80vw",
        transform: "translateX(10%)",
        zIndex: "1",
      }}
      hidden={!trigger}
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
              onClick={() => setTrigger((prev) => !prev)}
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
    </div>
  );
}
