import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import LogTypeChip from './LogTypeChip';
import type { FilterType } from '../api/LogApi';


interface LogFilterProps {
    filter : FilterType[],
    setFilter : React.Dispatch<React.SetStateAction<FilterType[]>>
}

const MenuProps = {
  PaperProps: {
  sx: {                    
      borderRadius: 4,
      boxShadow: 3,
      width: 200
    },
  },
};

const types = [
  'Created',
  'Updated',
  'Deleted'
] as FilterType[]





export default function LogFilterSelect({ filter, setFilter} : LogFilterProps) {

  return (
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-chip-label">Filter by type</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={filter}
          onChange={e => setFilter(typeof e.target.value === 'string' ? e.target.value.split(',') as FilterType[] : e.target.value)}
          input={<OutlinedInput id="select-multiple-chip" label="Filter by type" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, bgcolor : 'transparent'}}>
              {selected.map((value, index) => (
                <LogTypeChip key={index} type={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {types.map((type) => (
            <MenuItem
              key={type}
              value={type}
            >
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
  );
}