import { Box, Button, TextField, Typography } from '@mui/material'

interface ProfileUsernameProps {
    newUsername : string,
    setNewUsername :  React.Dispatch<React.SetStateAction<string>>,
    handleUpdateProfileName :  () => Promise<void>,
}

function ProfileUsernameBox({newUsername, setNewUsername, handleUpdateProfileName} : ProfileUsernameProps) {
  return (
    <Box
  sx={{
    border: "1px solid var(--ring)",
    borderRadius: 2,
    p: 3,
    mx: "auto",
    mb: 2,
  }}
>
  
  <Typography variant="h6" fontWeight={600} mb={4}>
    Username
  </Typography>

  
  <Box sx={{ display: "flex", gap: 2 }}>
    <TextField
      variant="outlined"
      value={newUsername}
      onChange={(e) => setNewUsername(e.target.value)}
      fullWidth
      placeholder="Enter your username"
  
      sx={{color : 'var(--input)' ,".MuiInputBase-root" : {
         borderColor: "var(--input)", color : "var(--input)"
      }, ".Mui-focused fieldset" : {
         borderColor: "var(--input)", color : "var(--input)"
      }, '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'var(--input)',
      }}

    }}
    />
    <Button
      variant="contained"
      onClick={handleUpdateProfileName}
      sx={{ whiteSpace: "nowrap" }}
    >
      Save
    </Button>
  </Box>
</Box>
  )
}

export default ProfileUsernameBox