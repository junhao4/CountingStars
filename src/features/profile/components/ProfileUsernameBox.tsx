import { Box, Button, TextField, Typography } from '@mui/material'
import { useState } from 'react';
import { updateProfileName } from '../api/ProfileApi';
import { useSessionContext, type ValidSession } from '../../../common/contexts/SessionContext';
import { useAlertContext } from '../../../common/contexts/AlertContext';


function ProfileUsernameBox() {
  const { user, setUser } = useSessionContext() as ValidSession
  const { createAlert } = useAlertContext()
  
  const [newUsername, setNewUsername] = useState<string>("");

  const handleUpdateProfileName = async () => {
    await updateProfileName(user.id, newUsername)
    createAlert("success", "Successfully set new username!");
    setUser({ ...user, name: newUsername })

  }
  return (
    <Box
      sx={{
        border: "1px solid var(--border)",
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

          sx={{
            color: 'var(--input)', ".MuiInputBase-root": {
              borderColor: "var(--text)", color: "var(--text)"
            }, ".Mui-focused fieldset": {
              borderColor: "var(--text)", color: "var(--text)"
            }, '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'var(--text)',
              }
            }

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