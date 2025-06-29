
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { useEffect, useState } from 'react';
import { useSessionContext } from '../contexts/SessionContext';
import { useNavigate } from 'react-router-dom';
import supabase from '../../helper/supabaseClient';
import { Avatar } from '@mui/material';

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { session, userName } = useSessionContext();
  const [ profileUrl, setProfileUrl ] = useState("");
  const [ img, setImg ] = useState("")

  const open = Boolean(anchorEl);
  const navigate = useNavigate();


  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    setAnchorEl(null);
    navigate("/dashboard/profile")
  }

  const handleLogout = () => {
    setAnchorEl(null)
    supabase.auth.signOut()
    navigate("/")
  }

  //Fetches preexisting user info
    useEffect(() => {
        if (session?.user) {
            const fetchUser = async () => {
                const { data } = await supabase
                    .from("Users")
                    .select()
                    .eq("user_id", session!.user.id)
                    .single()

                console.log(data!.name);
                setProfileUrl(data!.image_file!);
            };

            fetchUser();
        }
    }, [session, userName]);

    //Downloads user image from storage
    useEffect(() => {
        const downloadImage = async () => {
            const { data, error } = await supabase.storage
                .from("profile-images")
                .download(profileUrl!);
            if (error) {
                console.error("Error downloading image:", error.message);
            } else {
                const url = URL.createObjectURL(data);
                setImg(url);
            }
        };

        downloadImage();
    }, [profileUrl]);

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', bgcolor: 'transparent'}}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="medium"
            sx={{ mx: 0 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
         <Avatar src={img} sx={{ width: 40, height : 40}}/>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            variant: "outlined",
            sx: {
              overflow: 'visible',
              mt: 1.5,
              padding : 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem sx={{py : 0, color: 'white', pointerEvents: 'none'}}>
            <Typography sx={{fontWeight: 900, color: 'white',  "&.Mui-disabled": {
          color: "white", opacity : 1}}}>
                { userName }
            </Typography>
        </MenuItem>
        <MenuItem disabled sx={{py : 0}}>
          <Typography >
            { session?.user.email }
        </Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Profile Settings
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}