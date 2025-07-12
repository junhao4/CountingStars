import { Box, Button, IconButton, Stack, styled, TextField, Tooltip } from "@mui/material"
import Loading from "../../../../common/components/Loading"
import useGetItem from "../hooks/useGetItem"
import CategoryChips from "./CategoryChips"
import { useAlertContext } from "../../../../common/contexts/AlertContext"
import { useSessionContext, type ValidSession } from "../../../../common/contexts/SessionContext"
import { useOrgContext, type ValidOrg } from "../../../../common/contexts/OrgContext"
import { addItemCategory, deleteItemCategory } from "../api/ItemApi"
import { useState, type ChangeEventHandler } from "react"
import EditIcon from "@mui/icons-material/Edit"
import FileUploadIcon from "@mui/icons-material/FileUpload"
import DeleteIcon from "@mui/icons-material/Delete"
import { DatePicker } from "@mui/x-date-pickers"
import dayjs from "dayjs"
import useGetItemImage from "../hooks/useGetItemImage"

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

const RowDisplay = ({ title, value, onChange, readOnly }: {
    title: string, value: any,
    onChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>, readOnly: boolean
}) => {
    return (
        <div>{title + ": "}
            <TextField size='small' slotProps={{ input: { readOnly } }} variant="standard"
                value={value} onChange={onChange} />
        </div>)
}

export default function Item({ itemId }: { itemId: number }) {
    const { user } = useSessionContext() as ValidSession
    const { org } = useOrgContext() as ValidOrg
    const { createAlert } = useAlertContext()

    const { loading: loadingItem, item, setItem } = useGetItem(itemId)
    const { loading: loadingImage, image, setImage, removeImage } = useGetItemImage(itemId)
    const [editMode, setEditMode] = useState(false)

    const handleDeleteCategory = (categoryId: number) => async () => {
        const res = await deleteItemCategory(user.id, org.id, item!.id, categoryId)
        if (item && res) {
            setItem({ ...item, categories: item?.categories.filter(cat => cat.id !== categoryId) })
            createAlert("success", 'Successfully deleted category!')
        }
        else { createAlert("warning", "Failed to delete category") }
    }

    const handleAddCategory = (categoryId: number, categoryName: string) => async () => {
        const res = await addItemCategory(user.id, org.id, item!.id, categoryId)
        if (item && res) {
            setItem({
                ...item, categories: item.categories
                    .concat([{ id: categoryId, name: categoryName, createdAt: Date.now().toLocaleString() }])
            })
            createAlert("success", "Successfully added category!")
        } else {
            createAlert('error', "Failed to add category")
        }
    }


    if (loadingItem || loadingImage) return (<Loading />)
    if (!item) return (<Box>NO ITEM FOUND!</Box>)

    return (
        <Box sx={{
            display: 'flex', outline: '1px solid black', borderRadius: '1rem',
            margin: '2rem 0'
        }}>
            <Stack sx={{ width: '60vw', alignItems: 'center' }}>

                <IconButton onClick={() => setEditMode(prev => !prev)}>
                    <Tooltip title="Edit item">
                        <EditIcon />
                    </Tooltip>
                </IconButton>

                {/** Section Title for item name */}
                <TextField size='medium' slotProps={{
                    input: { readOnly: !editMode },
                    htmlInput: { sx: { textAlign: 'center', fontSize: '2rem' } }
                }} sx={{ margin: '0 0 2rem 0' }}
                    variant="standard" value={item.name} onChange={(e) => setItem({ ...item, name: e.target.value })} />

                {/** Section for displaying image, quantity, description and categories */}
                <div style={{ display: 'flex', width: '90%', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', margin: '0 0 2rem 0' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                        <img width='200px' height='200px' src={image?.imageBlobUrl}></img>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Button startIcon={<FileUploadIcon />} color="primary" variant="contained" component='label' sx={{ width: 'fit-content' }}>
                                Upload Image<VisuallyHiddenInput type='file' onChange={e => {
                                    if (e.target.files) { setImage(e.target.files) }
                                }} />
                            </Button>
                            <Button onClick={removeImage} color='error' variant="contained"><DeleteIcon /></Button>
                        </div>
                    </div>

                    {/** Section for displaying last modified and expiry date */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end', gap: '2rem' }}>
                        <div style={{ width: '100%', gap: '1rem', display: 'flex', justifyContent: 'left', flexWrap: 'wrap' }}>
                            <p style={{ margin: '0' }}>Quantity:&nbsp;&nbsp;&nbsp;&nbsp;</p>
                            <TextField size='small' slotProps={{ input: { readOnly: !editMode } }} variant="standard"
                                value={item.quantity} sx={{ flexGrow: 1 }}
                                onChange={(e) => setItem({
                                    ...item,
                                    quantity: convertValidStringToInt(e.target.value, item.quantity)
                                })} /></div>

                        <div style={{ width: '100%', gap: '1rem', display: 'flex', justifyContent: 'left', flexWrap: 'wrap' }}>Description:{' '}
                            <TextField size='small' slotProps={{ input: { readOnly: !editMode } }} variant="standard"
                                multiline rows={4} sx={{ flexGrow: 1, minWidth: '12rem' }} placeholder="Description"
                                value={item.description} onChange={(e) => setItem({ ...item, description: e.target.value })} />
                        </div>

                        <div style={{ width: '100%', display: 'flex', justifyContent: 'left', flexWrap: 'wrap' }}>
                            <p>Categories:&emsp;&emsp;&emsp;</p>
                            <CategoryChips categories={item.categories} editMode={editMode}
                                handleDelete={handleDeleteCategory} handleAdd={handleAddCategory} />
                        </div>
                    </div>

                </div>


                <div style={{ display: 'flex', flexWrap: 'wrap', margin: '1rem 0 1rem 2rem' }}>
                    <p>Last Modified:&emsp;&emsp;&emsp;&emsp;</p>
                    <p>{item.lastModified}</p>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', margin: '0 0 2rem 2rem' }}>
                    <p style={{ display: 'flex', alignItems: 'center' }}>Expiry Date:&emsp;&emsp;</p>
                    <DatePicker value={dayjs(item.lastModified)} slotProps={{ textField: { size: 'small' } }} onChange={(e) => {
                        setItem({ ...item, lastModified: e?.toISOString() || item.lastModified })
                    }}></DatePicker>
                </div>
            </Stack>
        </Box >
    )
}