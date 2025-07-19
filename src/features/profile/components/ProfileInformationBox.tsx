import { Box, Button, Stack, TextField, Typography } from "@mui/material"
import { VisuallyHiddenInput } from "./Profile"
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import type { ChangeEvent } from "react";
import type { FirstTimeUser, User } from "../../../helper/types";

interface ProfileInfoProps {
    img : string
    user : User | FirstTimeUser
    onUpdateImage : (e: ChangeEvent<HTMLInputElement>) => Promise<void>
}


function ProfileInformationBox({ img, user, onUpdateImage} : ProfileInfoProps) {
  return (
    <>
    <Box sx={{ border:"1px solid var(--ring)", mx : "auto", p : 2, mt : 2, mb : 2,
                 display: "flex",
                alignItems: "flex-start",
                borderRadius : 2,
                flexDirection : 'column'
            }}
            
            >
              
                    <Typography
                    variant="h6"
                    mb={4}
                    sx={{
                        fontWeight: 600,
                        
                       
                    }}
                >
                    Profile Information
                </Typography>
                 <Box  sx={{ display: "flex", alignItems: "center", mb: 2, bgcolor:"transparent"}}>
                    <Stack>
                <Box
                    component="img"
                    src={img}
                    alt="Profile"
                    sx={{
                        width: 200,
                        height: 175,
                        borderRadius : 2,
                        ml : 2,
                        mr : 2,
                        mb : 2
                    }}
                />
                 <Button
                    component="label"
                    variant="outlined"
                    sx={{color : "var(--input)"}}
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                >
                    Upload Profile Image
                    <VisuallyHiddenInput type="file" onChange={onUpdateImage} />
                </Button>
                </Stack>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 450,
                        ml : 3,
                        mb: 3,
                    }}
                >
                    {user.name}
                </Typography>
                </Box>
            
          
                
    
                
            </Box>
            
           
            </>
  )
}

export default ProfileInformationBox