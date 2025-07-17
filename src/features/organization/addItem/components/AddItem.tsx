import { Box, Typography, Input, FormControl, InputLabel, Select, OutlinedInput, Chip, MenuItem, Button, Stack } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import type { Dayjs } from "dayjs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlertContext } from "../../../../common/contexts/AlertContext";
import { useOrgContext, type ValidOrg } from "../../../../common/contexts/OrgContext";
import { useSessionContext, type ValidSession } from "../../../../common/contexts/SessionContext";
import type { Item } from "../../../../helper/types";
import { handleAddItem, handleCategoryChange } from "../../inventory/table/api/InventoryApi";
import useGetCategoryList from "../../inventory/table/hooks/useGetCategoryList"


export default function AddItem() {
    const { org } = useOrgContext() as ValidOrg
    const navigate = useNavigate()
    const { createAlert } = useAlertContext();
    const { user } = useSessionContext() as ValidSession
    const { categoryList } = useGetCategoryList()

    const [itemName, setItemName] = useState<string>("");
    const [itemQuantity, setItemQuantity] = useState<number>(1);
    const [itemDescription, setItemDescription] = useState<string>("");
    const [itemCategory, setItemCategory] = useState<string[]>([]);
    const [itemExpiry, setItemExpiry] = useState<Dayjs | null>(null); // In the format YYYY-MM-DD

    const item: Omit<Item, "id" | "lastModified"> & { categories: string[] } = {
        name: itemName, quantity: itemQuantity, description: itemDescription,
        expiryDate: itemExpiry?.toDate().toDateString() || null,
        categories: itemCategory
    }

    const onHandleAddItem = async () => {
        const res = await handleAddItem(user.id, item, categoryList, org.id)
        if (res) {
            createAlert("success", "Successfully added item!")
        } else {
            createAlert("error", "Failed to add item")
        }
        navigate(-1)
    }

    return (
        <Box width="40%" sx={{ outline: "2px solid black", borderRadius: "2px", margin: "2rem" }}>
            <Stack sx={{ display:'flex', alignItems:'end', gap:'2rem' }}>

                <Typography variant="h6" sx={{ p:'1rem 0', width: "100%", textAlign: "center", boxShadow: "0 1px 0 black" }}>
                    Add Item
                </Typography>

                <Box display="flex" gap="2rem" alignItems="center" margin="0 auto 0 auto" flexWrap='wrap' width='80%'>
                    <Typography>Name:&emsp;&emsp;</Typography>
                    <Input value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="Name" sx={{ flexGrow: 1 }} />
                </Box>

                <Box display="flex" gap="2rem" alignItems="center" margin="0 auto 0 auto" flexWrap='wrap' width='80%'>
                    <Typography>Quantity:&emsp;</Typography>
                    <Input value={itemQuantity} onChange={(e) => setItemQuantity(parseInt(e.target.value))} placeholder="Quantity"
                        type="number" sx={{ flexGrow: 1 }} />
                </Box>

                <Box display="flex" gap="2rem" alignItems="center" margin="0 auto 0 auto" flexWrap='wrap' width='80%'>
                    <Typography>Description: </Typography>
                    <Input value={itemDescription} onChange={(e) => setItemDescription(e.target.value)} placeholder="Description"
                        multiline rows={3} sx={{ flexGrow: 1 }} />
                </Box>

                <FormControl
                    size="small"
                    sx={{ m: "0 2rem 0 2rem", width: "80%", alignSelf: "center" }}
                >
                    <InputLabel id="item-category-chip-label">Categories</InputLabel>
                    <Select
                        labelId="item-category-chip-label"
                        id="item-category-chip"
                        multiple
                        value={itemCategory}
                        onChange={(e) => handleCategoryChange(e, setItemCategory)}
                        input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                {selected.map((value) => {
                                    return <Chip key={value} label={value} />;
                                })}
                            </Box>
                        )}
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    maxHeight: 48 * 4.5 + 8,
                                    width: 250,
                                },
                            },
                        }}
                    >
                        {categoryList.map((cat) => (
                            <MenuItem key={cat.id} value={cat.name}>
                                {cat.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <DatePicker
                    value={itemExpiry}
                    onChange={(e) => setItemExpiry(e)}
                    label="Expiry Date of Item"
                    slotProps={{ textField: { size: "small" } }}
                    sx={{ m: "1rem 2rem 0 2rem", alignSelf: "center", width: "80%" }}
                />

                <Box>
                    <Button variant="contained" color="info" onClick={() => navigate(-1)} children="Back" />
                    <Button sx={{ m: "1rem 2rem" }} variant="contained" color='secondary' onClick={onHandleAddItem} children="Add" />
                </Box>
            </Stack>
        </Box>
    );
}