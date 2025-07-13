import { type GridColDef, type GridRenderCellParams, type GridRowSelectionModel, DataGrid } from "@mui/x-data-grid";
import { useMemo, type SetStateAction } from "react";
import CategoryChip from "./CategoryChip";
import type { ItemWithCategories } from "../../../../helper/types";
import { Link, useNavigate } from "react-router-dom";

// Fetches and displays the items in a table
interface ItemTableProps {
    items: ItemWithCategories[],
    rowSelectionModel: GridRowSelectionModel,
    setRowSelectionModel: React.Dispatch<SetStateAction<GridRowSelectionModel>>,
}

export default function ItemTable({ items, rowSelectionModel, setRowSelectionModel }: ItemTableProps) {
    const navigate = useNavigate()
    // Defines the column data for MUI Data Grid
    const columns: GridColDef[] = useMemo(() => [
        { field: 'id', headerName: 'ID', width: 70, align: 'left', headerAlign: 'left' },
        { field: 'name', headerName: 'Name', type: 'string', width: 280, align: 'left', headerAlign: 'left', 
            renderCell: e => {return <Link style={{ color:'var(--foreground-text)', fontSize:'1.25rem'}} to={'' + e.row.id} children={e.value}/>} },
        { field: 'quantity', headerName: 'Quantity', type: 'number', width: 140, align: 'left', headerAlign: 'left' },
        {
            field: 'categories', headerName: 'Categories', type: 'actions',
            width: 280, align: 'left', headerAlign: 'left',
            renderCell: (params: GridRenderCellParams<ItemWithCategories>) => <CategoryChip {...{ params }} />,
        },
        // { field: 'lastModified', headerName: 'Last Modified', valueGetter: (arg0) => new Date(arg0), type: 'date', width: 140, align: 'left', headerAlign: 'left' },
        {
            field: 'expiryDate', headerName: 'Expiry Date', renderCell: (arg0) =>
                arg0.value !== "-" ? new Date(arg0.value).toLocaleDateString() : "-", width: 140, align: 'left', headerAlign: 'left'
        },
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