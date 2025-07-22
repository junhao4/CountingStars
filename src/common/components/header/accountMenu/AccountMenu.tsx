import { useState } from 'react';
import { useSessionContext, type ValidSession } from '../../../contexts/SessionContext';
import { useNavigate } from 'react-router-dom';
import supabase from '../../../../helper/supabaseClient';
import AccountMenuDropdown from './AccountMenuDropdown';
import AccountMenuIcon from './AccountMenuIcon';
import AccountBell from './AccountMenuBell';
import { useThemeContext } from '../../../contexts/ThemeContext';
import { useProfileContext } from '../../../contexts/ProfileContext';


export default function AccountMenu() {
  const { user } = useSessionContext() as ValidSession
  const { blobUrl } = useProfileContext()
  const navigate = useNavigate()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const { themeMode, setAndSaveThemeMode } = useThemeContext()


  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (bool: boolean) => {
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
    // Clear organization local storage
    localStorage.removeItem("orgContext")
    navigate("/")
  }

  return (
    <>
      <AccountBell />
      <AccountMenuIcon open={open} img={blobUrl} handleClick={handleClick} />
      <AccountMenuDropdown anchorEl={anchorEl} handleClose={handleClose}
        handleLogout={handleLogout} handleProfile={handleProfile} open={open} user={user!}
        themeMode={themeMode} setAndSaveThemeMode={setAndSaveThemeMode} />
    </>
  );
}