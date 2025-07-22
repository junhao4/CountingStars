import { Alert, AlertTitle, Box, Grow, IconButton } from "@mui/material";
import { handleCloseAlert, useAlertContext } from "../contexts/AlertContext";
import CloseIcon from "@mui/icons-material/Close";

export default function AlertPopup() {
  const { alert, setAlert } = useAlertContext();

  return (
    <Box
      sx={{
        pointerEvents: 'none',
        position: "fixed",
        width: "80vw",
        transform: "translateX(10%)",
        zIndex: "2",
        backgroundColor: 'transparent',
      }}
    >
      {alert.map(({ variant, text, trigger, key }) => {

        console.log(alert)
        return (
          <Grow
            in={trigger} key={key}
            style={{ position: 'relative', transformOrigin: "0 0 0", pointerEvents: 'all' }}
            timeout={1000}
          >
            <Alert
              sx={{ m: '0.5rem 0' }}
              severity={variant}
              variant="filled"
              color={variant}
              action={
                <IconButton
                  color="inherit"
                  size="small"
                  onClick={() => handleCloseAlert(setAlert, { key })}
                >
                  <CloseIcon></CloseIcon>
                </IconButton>
              }
            >
              <AlertTitle>
                {variant.charAt(0).toUpperCase() + variant.slice(1)}
              </AlertTitle>
              {text}
            </Alert>
          </Grow>
        )
      })}
    </Box>
  );
}
