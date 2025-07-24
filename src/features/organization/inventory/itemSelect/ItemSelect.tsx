import { Select, MenuItem, TextField, InputLabel, FormControl } from "@mui/material";
import useItemSelect from "./useItemSelect";
import Loading from "../../../../common/components/Loading";
import { useEffect, useState } from "react";

interface itemSelectProps {
    selectedIds : number[],
    setSelectedIds : React.Dispatch<React.SetStateAction<number[]>>
}


export default function ItemSelect({ selectedIds, setSelectedIds }: itemSelectProps) {

   

    const { loading, filteredList, handleFilter } = useItemSelect()

    useEffect(() => {
        if (filteredList.length > 0 && selectedIds.length === 0) {
        setSelectedIds([filteredList[0].id]);
    }
}, [filteredList])


    return (
        <FormControl  sx={{ m: 1, minWidth: 220 }} size="small">
            <InputLabel children="Select Items to Compare" />
            <Select
                autoWidth
                multiple
                value={selectedIds}
                label="Select Items to Compare"
               renderValue={(v) => {
  if (!v || v.length === 0) return <p>Select items</p>;
  return <p>{v.join(", ")}</p>;
}}
                onChange={e => (console.log(e.target.value), setSelectedIds(typeof e.target.value === 'string'
                    ? e.target.value.split(',').map(id => parseInt(id)) as number[]
                    : e.target.value))}
                MenuProps={{ slotProps: { paper: { sx: { height: '20rem', width: '15rem' } } } }}>
                {
                    loading
                        ? <Loading />
                        : ([
                            <TextField placeholder="Search item to compare" onChange={e => handleFilter(e.target.value)} onKeyDown={e => e.stopPropagation()} />,
                            ...filteredList.map((item, index) => (
                                <MenuItem key={index} value={item.id} >
                                    {item.id}.&ensp;{item.name}
                                </MenuItem>))
                        ]
                        )
                }
            </Select>
        </FormControl>
    )
}