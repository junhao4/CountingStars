import { Chip } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import ClearIcon from '@mui/icons-material/Clear';

function LogTypeChip( {type} : {type  : string}) {
  switch (type) {
    case 'Created':
    case 'addItem': return (
      <Chip icon= {<AddIcon />} label="CREATED" color="success" sx={{color : "white"}} />
  )
    case 'moveItem' :
    case 'updateExpiry' : 
    case 'updateQuantity': 
    case 'moveItem' :
    case 'changeItemName' :
    case 'addItemCategory' :
    case 'removeItemCategory' :
    case 'Updated': return (
      <Chip icon={<DriveFileRenameOutlineIcon />} label="UPDATED" color="info" sx={{color : "white"}} />
  ) 
  
  case 'Deleted':
  case 'removeItem': return (
      <Chip icon={<ClearIcon />} label="DELETED" color="error" sx={{color : "white"}} />
  )
  
  }   
  
}

export default LogTypeChip