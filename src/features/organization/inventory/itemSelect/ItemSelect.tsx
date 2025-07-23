import { Select, MenuItem, TextField, InputLabel, FormControl } from "@mui/material";
import useItemSelect from "./useItemSelect";
import Loading from "../../../../common/components/Loading";
import { useState } from "react";


export default function ItemSelect() {

    // Only need to lift up this component to pass to the charts
    const [selectedIds, setSelectedIds] = useState<number[]>([])

    const { loading, filteredList, handleFilter } = useItemSelect()

    return (
        <FormControl>
            <InputLabel children="Select Items" />
            <Select
                autoWidth
                multiple
                value={selectedIds}
                label="Select Items"
                renderValue={v => <p>{v.join(',')}</p>}
                onChange={e => (console.log(e.target.value), setSelectedIds(typeof e.target.value === 'string'
                    ? e.target.value.split(',').map(id => parseInt(id)) as number[]
                    : e.target.value))}
                MenuProps={{ slotProps: { paper: { sx: { height: '20rem', width: '15rem' } } } }}>
                {
                    loading
                        ? <Loading />
                        : ([
                            <TextField placeholder="&emsp;Search item" onChange={e => handleFilter(e.target.value)} onKeyDown={e => e.stopPropagation()} />,
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