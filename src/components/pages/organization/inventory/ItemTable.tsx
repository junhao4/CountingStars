import { Button } from "@mui/material";
import { type GridColDef, type GridRenderCellParams, type GridRowSelectionModel, DataGrid } from "@mui/x-data-grid";
import {  useMemo, type SetStateAction } from "react";
import type { CategoryFetch, ItemFetch } from "./InventoryController";

// Fetches and displays the items in a table
interface ItemTableProps {
    items: ItemFetch[],
    rowSelectionModel: GridRowSelectionModel,
    setRowSelectionModel: React.Dispatch<SetStateAction<GridRowSelectionModel>>,
}

export default function ItemTable({ items, rowSelectionModel, setRowSelectionModel  }: ItemTableProps) {

    // Defines the column data for MUI Data Grid
    const columns: GridColDef[] = useMemo(() => [
        { field: 'id', headerName: 'ID', width: 70, align: 'left', headerAlign: 'left' },
        { field: 'name', headerName: 'Name', type: 'string', width: 280, align: 'left', headerAlign: 'left' },
        { field: 'quantity', headerName: 'Quantity', type: 'number', width: 140, align: 'left', headerAlign: 'left' },
        {
            field: 'categories', headerName: 'Categories', type: 'actions',
            width: 280, align: 'left', headerAlign: 'left',
            renderCell: (params: GridRenderCellParams<ItemFetch>) => <CatAction {...{ params }} />,
        },
        { field: 'last_modified', headerName: 'Last Modified', valueGetter: (arg0) => new Date(arg0), type: 'date', width: 140, align: 'left', headerAlign: 'left' },
        { field: 'expiry_date', headerName: 'Expiry Date', valueGetter: (arg0) => new Date(arg0), type: 'date', width: 140, align: 'left', headerAlign: 'left' },
    ], [items])

    const paginationModel = { page: 0, pageSize: 5 };

    return (
        <>
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
                showToolbar
            />  
        </>
    )
}

// Manages the action buttons for the 'categories' column
interface CatActionProps {
    params: GridRenderCellParams<ItemFetch>,
}

function CatAction({ params }: CatActionProps) {
    const buttonStyle = { borderRadius: '16px', color: 'black', backgroundColor: '#eeeeee' }

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', textAlign: 'center', flexWrap: 'wrap' }}>
                {
                    (params.row.categories || []).map((cat: CategoryFetch) => {
                        return (
                            <Button key={cat.id} sx={{ ...buttonStyle }}>
                                {cat.name}
                            </Button>)
                    })
                }
            </div>
        </div>
    )
}