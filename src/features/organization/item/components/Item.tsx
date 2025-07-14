import { Box, Button, IconButton, Stack, styled, TextField, Tooltip } from "@mui/material"
import Loading from "../../../../common/components/Loading"
import useGetItem from "../hooks/useGetItem"
import CategoryChips from "./CategoryChips"
import { useEffect, useState } from "react"
import EditIcon from "@mui/icons-material/Edit"
import FileUploadIcon from "@mui/icons-material/FileUpload"
import DeleteIcon from "@mui/icons-material/Delete"
import CancelIcon from "@mui/icons-material/Cancel"
import SaveIcon from "@mui/icons-material/Save"
import { DatePicker } from "@mui/x-date-pickers"
import dayjs from "dayjs"
import useGetItemImage from "../hooks/useGetItemImage"
import type { ItemWithCategories } from "../../../../helper/types"

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

export default function Item({ itemId }: { itemId: number }) {
    const { loading: loadingItem, item, handleSetItem } = useGetItem(itemId)
    const { loading: loadingImage, image, setImage, removeImage } = useGetItemImage(itemId)

    const [editItem, setEditItem] = useState<ItemWithCategories>(item!)
    const [editMode, setEditMode] = useState(false)

    

    const handleAddCategory = (categoryId: number, categoryName: string) => () => {
        setEditItem({
                ...editItem, categories: editItem.categories
                    .concat([{ id: categoryId, name: categoryName, createdAt: Date.now().toLocaleString() }])
            })
    }

    const handleRemoveCategory = (categoryId: number) => () => {
        setEditItem({ ...editItem, categories: editItem.categories.filter(cat => cat.id !== categoryId) || [] })
    }

    useEffect(() => {
        if (item) setEditItem(item)
    }, [item])

    if (loadingItem || loadingImage ) return (<Loading />)

    if (!item || !editItem) return (<Box>NO ITEM FOUND!</Box>)

    return (
        <Box sx={{
            display: 'flex', outline: '1px solid black', borderRadius: '1rem',
            margin: '2rem 0'
        }}>
            <Stack sx={{ width: '60vw', alignItems: 'center' }}>

                {/** Section Title for item name */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TextField size='medium' slotProps={{
                        input: { readOnly: !editMode },
                        htmlInput: { sx: { textAlign: 'center', fontSize: '2rem' } }
                    }} sx={{ margin: '1rem 0 2rem 0' }}
                        variant="standard" value={editItem.name} onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} />
                </div>



                <div style={{ display: 'flex', width: '100%', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', margin: '0 0 2rem 0' }}>
                    {/** Section for displaying image, and buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                        <img width='200px' height='200px' src={image?.imageBlobUrl} style={{ outline: '1px solid black' }}></img>
                        <div style={{ display: editMode ? 'flex' : 'none', gap: '1rem' }}>
                            <Button disabled={!editMode} startIcon={<FileUploadIcon />} color="primary" variant="contained" component='label' sx={{ width: 'fit-content' }}>
                                Upload Image<VisuallyHiddenInput type='file' onChange={e => {
                                    if (e.target.files) { setImage(e.target.files) }
                                }} />
                            </Button>
                            <Button onClick={removeImage} color='error' variant="contained"><DeleteIcon /></Button>
                        </div>
                    </div>

                    {/** Section for displaying quantity, description, categories */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end', gap: '2rem', width:'50%' }}>
                        <div style={{ width: '100%', gap: '1rem', display: 'flex', justifyContent: 'left', flexWrap: 'wrap' }}>
                            <p style={{ margin: '0' }}>Quantity:&nbsp;&nbsp;&nbsp;&nbsp;</p>
                            <TextField size='small' slotProps={{ input: { readOnly: !editMode } }} variant="standard"
                                value={editItem.quantity} sx={{ flexGrow: 1 }}
                                onChange={(e) => setEditItem({
                                    ...editItem,
                                    quantity: convertValidStringToInt(e.target.value, editItem.quantity)
                                })} /></div>

                        <div style={{ width: '100%', gap: '1rem', display: 'flex', justifyContent: 'left', flexWrap: 'wrap' }}>Description:{' '}
                            <TextField size='small' slotProps={{ input: { readOnly: !editMode } }} variant="standard"
                                multiline rows={4} sx={{ flexGrow: 1, minWidth: '12rem' }} placeholder="Description"
                                value={editItem.description} onChange={(e) => setEditItem({ ...editItem, description: e.target.value })} />
                        </div>

                        <div style={{ width: '100%', display: 'flex', justifyContent: 'left', flexWrap: 'wrap' }}>
                            <p>Categories:&emsp;&emsp;&emsp;</p>
                            <CategoryChips categories={editItem.categories} editMode={editMode}
                                handleRemove={handleRemoveCategory} handleAdd={handleAddCategory} />
                        </div>
                    </div>

                </div>

                {/** Section for displaying last modified and expiry date */}
                <div style={{ display: 'flex', flexWrap: 'wrap', margin: '1rem 0 1rem 2rem' }}>
                    <p>Last Modified:&emsp;&emsp;&emsp;&emsp;</p>
                    <p>{editItem.lastModified}</p>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', margin: '0 0 1rem 2rem' }}>
                    <p style={{ display: 'flex', alignItems: 'center' }}>Expiry Date:&emsp;&emsp;</p>
                    <DatePicker value={dayjs(editItem.lastModified)} slotProps={{ textField: { size: 'small' } }} onChange={(e) => {
                        setEditItem({ ...editItem, lastModified: e?.toISOString() || editItem.lastModified })
                    }} readOnly={!editMode}></DatePicker>
                </div>

                {/** Section for displaying edit and save button */}
                <div style={{ display: 'flex', margin: '0 0 1rem 0', gap: '2rem' }}>
                    {editMode
                        ? <>
                            <Button onClick={() => {handleSetItem(editItem);setEditMode(false)}} color="success" variant="contained" startIcon={<SaveIcon />} children={"Save"} />
                            <Button onClick={() => {setEditMode(false);setEditItem(item)}} color="error" variant="contained" startIcon={<CancelIcon />} children={"Cancel"} />
                        </>
                        : <IconButton onClick={() => setEditMode(true)}><Tooltip title="Edit item"><EditIcon /></Tooltip></IconButton>
                    }
                </div>
            </Stack>
        </Box >
    )
}