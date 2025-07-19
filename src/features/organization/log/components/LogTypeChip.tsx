import { Chip } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import ClearIcon from '@mui/icons-material/Clear';
import type { LOGSTYPE } from '../api/LogApi';


function LogTypeChip( {type} : {type  : LOGSTYPE}) {
  switch (type) {
    case 'addItem': return (
      <Chip icon= {<AddIcon />} label="CREATED" color="success" sx={{color : "white"}} />
  )
    case 'moveItem' :
    case 'updateExpiry' :
    case 'updateQuantity': return (
      <Chip icon={<DriveFileRenameOutlineIcon />} label="UPDATED" color="info" sx={{color : "white"}} />
  ) 
  
  case 'removeItem': return (
      <Chip icon={<ClearIcon />} label="DELETED" color="error" sx={{color : "white"}} />
  )
  }   
  
}

export default LogTypeChip