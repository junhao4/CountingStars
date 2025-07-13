import { useEffect, useState } from 'react';
import { useSessionContext } from '../../../contexts/SessionContext';
import { useNavigate } from 'react-router-dom';
import supabase from '../../../../helper/supabaseClient';
import { useAlertContext } from '../../../contexts/AlertContext';
import { downloadProfileImage, fetchProfileImage } from '../../../api/UserApi'
import AccountMenuDropdown from './AccountMenuDropdown';
import AccountMenuIcon from './AccountMenuIcon';
import AccountBell from './AccountMenuBell';
import { useThemeContext } from '../../../contexts/ThemeContext';

export default function AccountMenu() {
  const { createAlert } = useAlertContext()
  const { user } = useSessionContext()
  const navigate = useNavigate()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profileUrl, setProfileUrl] = useState<string | null>(null);
  const [img, setImg] = useState<string | undefined>()
  const { themeMode, setThemeMode } = useThemeContext()

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (bool : boolean) => {
    if (bool) {
    setAnchorEl(null);
    }
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
    if (user?.id) {
      new Promise(async () => {
        const imageFile = await fetchProfileImage(user.id, createAlert)
        setProfileUrl(imageFile)
      })
    }
  }, [user]);

  //Downloads user image from storage
  useEffect(() => {
    new Promise(async () => {
      const blob = await downloadProfileImage(profileUrl || "Default_pfp.jpg")
      if (blob) {
        const url = URL.createObjectURL(blob);
        setImg(url);
      }
    })
  }, [profileUrl]);

  return (
    <>
      <AccountBell />
      <AccountMenuIcon open={open} img={img} handleClick={handleClick} />
      <AccountMenuDropdown anchorEl={anchorEl} handleClose={handleClose}
        handleLogout={handleLogout} handleProfile={handleProfile} open={open} user={user!} 
        themeMode={themeMode} setThemeMode={setThemeMode}/>
    </>
  );
}