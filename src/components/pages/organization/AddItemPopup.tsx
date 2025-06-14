import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { useEffect, useState, type FormEvent } from "react";
import { type SelectChangeEvent } from "@mui/material";
import supabase from "../../../helper/supabaseClient";
import { useOrgContext } from "../../contexts/OrgContext";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type { Dayjs } from "dayjs";
import type { CategoryFetch } from "./inventory/Inventory";

interface OrgAddItemPopupProps {
    trigger: boolean,
    closePopup: () => void,
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>,
    categoryList: CategoryFetch[]
}

export default function OrgAddItemPopup({ trigger, closePopup, setRefresh, categoryList }: OrgAddItemPopupProps) {
    const { getOrgContext } = useOrgContext()
    const { id: org_id } = getOrgContext()!

    const [itemName, setItemName] = useState<string>('')
    const [itemQuantity, setItemQuantity] = useState<number>(1)
    const [itemDescription, setItemDescription] = useState<string>('')
    const [itemCategory, setItemCategory] = useState<string[]>([])
    const [itemExpiry, setItemExpiry] = useState<Dayjs | null>(null) // In the format YYYY-MM-DD

    const handleCategoryChange = (event: SelectChangeEvent<string[]>) => {
        const {
            target: { value },
        } = event;
        setItemCategory(
            // On autofill we get a stringified value.
            typeof (value) === 'string' ? [] : value,
        );
    };


    const submitPopup = async () => {
        await supabase.from('Items')
            .insert({ name: itemName, org_id, quantity: itemQuantity, description: itemDescription, expiry_date: itemExpiry?.toDate().toDateString() })
            .select()
            .then(res => {
                if (res.error) {
                    console.log(res.error.message)
                    return Promise.reject(false)
                }
                Promise.all(itemCategory.map(async value => {
                    const row = categoryList.find(cat => cat.name === value)
                    return row
                        ? supabase.from('items_categories')
                            .insert({ item_id: res.data[0].id, category_id: row.id })
                            .then(res => { if (res.error) {console.log(res.error.message)} return true})
                        : Promise.resolve(true)
                })).then(val => {
                    setRefresh(prev => !prev)
                    closePopup()
                })
            })
    }

    return (
        <>
            <Modal open={trigger}
                onClose={closePopup}>
                <Box sx={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translateY(-50%) translateX(-50%)', height: '55%', width: '50%',
                    backgroundColor: 'beige', outline: '4px solid black', padding: '16px', borderRadius: '8px',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', gap: '8px', overflow: 'auto'
                }}>

                    <Typography variant="h4" component="h2">Add Organization</Typography>

                    <TextField value={itemName} label='Name of Item'
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setItemName(e.target.value)} />

                    <TextField value={itemQuantity} type='number' label='Quantity of Item'
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setItemQuantity(parseInt(e.target.value))} />

                    <TextField value={itemDescription} label='Description of Item (Optional)'
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setItemDescription(e.target.value)} />

                    <FormControl sx={{ m: 1, width: 300 }}>
                        <InputLabel id="item-category-chip-label">Categories</InputLabel>
                        <Select
                            labelId="item-category-chip-label"
                            id="item-category-chip"
                            multiple
                            value={itemCategory}
                            onChange={handleCategoryChange}
                            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {
                                        selected.map((value) => {
                                            return <Chip key={value} label={value} />
                                        })
                                    }
                                </Box>
                            )}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 48 * 4.5 + 8,
                                        width: 250,
                                    },
                                }
                            }}
                        >
                            {
                                categoryList.map((cat) => (
                                    <MenuItem
                                        key={cat.id}
                                        value={cat.name}
                                    // style={}
                                    >
                                        {cat.name}
                                    </MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>

                    <DatePicker value={itemExpiry} onChange={(e) => setItemExpiry(e)} label='Expiry Date of Item (Optional)' />

                    <Button variant='contained' onClick={submitPopup} children='Add' />
                </Box>
            </Modal >
        </>
    )
}