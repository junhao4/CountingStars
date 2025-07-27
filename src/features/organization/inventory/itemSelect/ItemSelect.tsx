import { Select, MenuItem, TextField, InputLabel, FormControl } from "@mui/material";
import useItemSelect from "./useItemSelect";
import { useEffect, useState } from "react";

interface itemSelectProps {
    selectedIds: number[],
    setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>
}


export default function ItemSelect({ selectedIds, setSelectedIds }: itemSelectProps) {



    const { itemList } = useItemSelect()

    const [text, setText] = useState("")

    useEffect(() => {
        if (itemList.length > 0 && selectedIds.length === 0) {
            setSelectedIds([itemList[0].id]);
        }
    }, [itemList])

    return (
        <FormControl sx={{ m: 1, minWidth: 220 }} size="small">
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
                onChange={e => {
                    setSelectedIds(typeof e.target.value === 'string'
                        ? e.target.value.split(',').map(id => parseInt(id)) as number[]
                        : e.target.value.filter(data => !!data))
                }}
                MenuProps={{ slotProps: { paper: { sx: { height: '20rem', width: '15rem' } } } }}>
                {
                    [<TextField placeholder="Search items" defaultValue={text} autoFocus
                        onChange={e => setText(e.target.value)} onKeyDown={e => e.stopPropagation()} />,
                    ...itemList
                        .map(item => (
                        <MenuItem key={item.id} value={item.id} 
                            sx={{display: !(item.name + ' ' + item.id.toString()).toLowerCase().includes(text.toLowerCase()) 
                                ? "none" : "block"}}>
                            {item.id}.&ensp;{item.name}
                        </MenuItem>))
                    ]
                }
            </Select>
        </FormControl>
    )
}