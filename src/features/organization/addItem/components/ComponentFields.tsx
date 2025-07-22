import { FormControl, InputLabel, Select, Box, Chip, MenuItem, Button, Stack, Typography, styled, TextField } from "@mui/material";
import type { Action, UploadItem } from "./AddItem";
import useGetCategoryList from "../../item/hooks/useGetCategoryList";
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { validateImageFile } from "../../../../common/functions/File";


interface FieldProps {
    state: UploadItem
    dispatch: React.ActionDispatch<[action: Action]>
}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
})

const convertValidStringToInt = (text: string, initialInt: number) => {
    var isNumber = true
    for (var i = 0; i < text.length; i++) {
        if (!(text.charAt(i) >= '0' && text.charAt(i) <= '9')) {
            isNumber = false
        }
    }
    if (!isNumber) {
        return initialInt
    } else if (text === "") {
        return 0
    }
    return parseInt(text)
}

export function ImageNameQuantityDescriptionField({ state, dispatch }: FieldProps) {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', width: '80%', gap: '3rem', justifyContent: 'center' }}>
            <Stack sx={{ gap: '0.5rem' }}>
                <img width='200px' height='200px' src={state.imageBlobUrl}></img>
                <Button sx={{ width: 'fit-content', alignSelf: 'center' }} component='label' variant='contained' startIcon={<CloudUploadIcon />}>
                    Upload File<VisuallyHiddenInput type='file'
                        onChange={(e) => {
                            if (e.target.files && validateImageFile(e.target.files[0])) {
                                dispatch({ type: "SET_IMAGE", value: e.target.files[0] })
                            } else {
                                dispatch({ type: "SET_IMAGE", value: undefined })
                            }
                        }} />
                </Button>
            </Stack>

            <Stack sx={{ padding: '0 1rem 0 0', gap: '2rem', flexGrow: 1 }}>
                <Box display="flex" gap="2rem">
                    <Typography p="0.25rem 0 0 0">Name:&emsp;&emsp;</Typography>
                    <TextField value={state.name} onChange={(e) => dispatch({ type: "SET_NAME", value: e.target.value })}
                        placeholder="Name" sx={{ flexGrow: 1 }} />
                </Box>

                <Box display="flex" gap="2rem">
                    <Typography p="0.25rem 0 0 0">Quantity:&emsp;</Typography>
                    <TextField value={state.quantity} onChange={(e) => dispatch({
                        type: "SET_QUANTITY",
                        value: convertValidStringToInt(e.target.value, state.quantity)
                    })}
                        placeholder="Quantity" sx={{ flexGrow: 1 }} />
                </Box>

                <Box display="flex" gap="2rem">
                    <Typography p="0.25rem 0 0 0">Description: </Typography>
                    <TextField value={state.description} onChange={(e) => dispatch({ type: "SET_DESCRIPTION", value: e.target.value })}
                        placeholder="Description" multiline rows={4} sx={{ flexGrow: 1 }} />
                </Box>
            </Stack>
        </div>
    )
}

export function CategoryField({ state, dispatch }: FieldProps) {
    const { loading, categoryList } = useGetCategoryList()

    if (loading) return (<></>)

    return (
        <FormControl
            size="small"
            sx={{ m: "0 2rem 0 2rem", width: "80%", alignSelf: "center" }}
        >
            <InputLabel id="item-category-chip-label">Categories</InputLabel>
            <Select
                labelId="item-category-chip-label"
                id="item-category-chip"
                multiple
                value={state.categories}
                onChange={(e) => dispatch({
                    type: 'SET_CATEGORIES',
                    value: typeof e.target.value === 'string' ? [] : e.target.value
                })}
                renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => {
                            return <Chip key={value} label={categoryList.find(cat => cat.id === value)!.name} />;
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
                    <MenuItem key={cat.id} value={cat.id}>
                        {cat.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export function ExpiryDateField({ state, dispatch }: FieldProps) {
    return (
        <DatePicker
            value={state.expiryDate}
            minDate={dayjs(Date.now())}
            onChange={(e) => dispatch({ type: 'SET_EXPIRY_DATE', value: e })}
            label="Expiry Date of Item"
            slotProps={{ textField: { size: "small" } }}
            sx={{ m: "1rem 2rem 0 2rem", alignSelf: "center", width: "80%" }}
        />
    )
}