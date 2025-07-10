import { Chip } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import ClearIcon from '@mui/icons-material/Clear';


function LogTypeChip( {type} : {type  : number}) {
  switch (type) {
    case 1: return (
      <Chip icon= {<AddIcon />} label="CREATED" color="success" sx={{color : "white"}} />
  )
    case 2: return (
      <Chip icon={<DriveFileRenameOutlineIcon />} label="UPDATED" color="info" sx={{color : "white"}} />
  ) 
    case 3: return (
      <Chip icon={<DriveFileRenameOutlineIcon />} label="UPDATED" color="info" sx={{color : "white"}} />
  )
  case 4: return (
      <Chip icon={<ClearIcon />} label="DELETED" color="error" sx={{color : "white"}} />
  )
  }   
  
}

export default LogTypeChip