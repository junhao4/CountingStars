import { Paper, Box, Button, Tooltip, IconButton, Avatar, Menu, MenuItem, TextField } from "@mui/material";
import { type GridColDef, type GridRenderCellParams, type GridRowSelectionModel, DataGrid } from "@mui/x-data-grid";
import { useState, useEffect, useMemo, type SetStateAction } from "react";
import supabase from "../../../../helper/supabaseClient";
import { useOrgContext } from "../../../contexts/OrgContext";
import type { CategoryFetch, ItemFetch } from "./Inventory";

// Fetches and displays the items in a table
interface ItemTableProps {
    items: ItemFetch[],
    categoryOptions: CategoryFetch[],
    rowSelectionModel: GridRowSelectionModel,
    setRowSelectionModel: React.Dispatch<SetStateAction<GridRowSelectionModel>>,
    fetchItems: () => void,
    fetchCategoryOptions: () => void,
}

export default function ItemTable({ items, categoryOptions, rowSelectionModel, setRowSelectionModel, fetchItems, fetchCategoryOptions }: ItemTableProps) {
    
    // Defines the column data for MUI Data Grid
    const columns: GridColDef[] = useMemo(() => [
        { field: 'id', headerName: 'ID', width: 70, align:'left', headerAlign:'left' },
        { field: 'name', headerName: 'Name', type: 'string', width:280, align:'left', headerAlign:'left' },
        { field: 'quantity', headerName: 'Quantity', type: 'number', width: 140, align:'left', headerAlign:'left' },
        {
            field: 'categories', headerName: 'Categories', type: 'actions',
            width: 280, align:'left', headerAlign:'left',
            renderCell: (params: GridRenderCellParams<ItemFetch>) => <CatAction {...{ params }} setRefresh={setRefresh} categoryOptions={categoryOptions} />,
        },
        { field: 'description', headerName: 'Description', width: 280, align:'left', headerAlign:'left' },
        { field: 'last_modified', headerName: 'Last Modified', valueGetter: (arg0) => new Date(arg0), type: 'date', width: 140, align:'left', headerAlign:'left' },
        { field: 'expiry_date', headerName: 'Expiry Date', valueGetter: (arg0) => new Date(arg0), type: 'date', width: 140, align:'left', headerAlign:'left' },
    ], [items])

    const paginationModel = { page: 0, pageSize: 5 };

    useEffect(() => {
        console.log(rowSelectionModel)
    }, [rowSelectionModel])


    const [refresh, setRefresh] = useState<boolean>(true)

    useEffect(() => {
        fetchItems()
        fetchCategoryOptions()
    }, [refresh])

    return (
        <>
            <Paper sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={items}
                    getRowId={row => row.id}
                    getRowHeight={() => 'auto'}
                    columns={columns}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    onRowSelectionModelChange={(newRowSelectionModel) => {
                        setRowSelectionModel(newRowSelectionModel);
                    }}
                    rowSelectionModel={rowSelectionModel}
                    sx={{ border: 0 }}
                    showToolbar
                />
            </Paper>
        </>
    )
}

// Manages the action buttons for the 'categories' column
interface CatActionProps {
    params: GridRenderCellParams<ItemFetch>,
    categoryOptions: { id: number, name: string }[],
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>,
}

function CatAction({ params, categoryOptions, setRefresh }: CatActionProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [addCatName, setAddCatName] = useState<string>('')
    const { getOrgContext } = useOrgContext()
    const { id: org_id } = getOrgContext()!

    const buttonStyle = { borderRadius: '16px', color: 'black', backgroundColor: '#eeeeee' }

    const catClick = async (rowId: number, catId: number) => {
        await supabase.from('items_categories')
            .delete()
            .eq('item_id', rowId)
            .eq('category_id', catId)
            .then(res => { if (res.error) {console.log(res.error.message); } setRefresh(prev => !prev) })
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', flexWrap:'wrap'}}>
                {
                    (params.row.categories || []).map((cat: CategoryFetch) => {
                        return (
                            <Button key={cat.id} sx={{ ...buttonStyle }}
                                onClick={() => catClick(params.row.id, cat.id)}>
                                {cat.name}
                            </Button>)
                    })
                }

                <Tooltip title="Add category">
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Avatar sx={{ width: 32, height: 32 }}>+</Avatar>
                    </IconButton>
                </Tooltip>

            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                // onClick={handleClose}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {categoryOptions.map(cat => {
                    return (<MenuItem key={cat.id} onClick={() => {
                        supabase.from('items_categories')
                            .insert({ item_id: params.row.id, category_id: cat.id })
                            .then(res => { if (res.error) {console.log(res.error.message)} setRefresh(prev => !prev) })
                        handleClose()
                    }}>
                        {cat.name}
                    </MenuItem>)
                })}
                <MenuItem disableTouchRipple disableRipple >
                    <>
                        <TextField value={addCatName} onChange={(e) => setAddCatName(e.target.value)} size='small' />
                        <Button onClick={() => {
                            supabase.from('Categories')
                                .insert({ name: addCatName, org_id })
                                .then(res => { if (res.error) { console.log(res.error.message) } setRefresh(prev=> !prev) })
                        }}>+</Button>
                    </>
                </MenuItem>
            </Menu>
        </Box>
    )
}