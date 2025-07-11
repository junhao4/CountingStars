import { type GridColDef, type GridRenderCellParams, type GridRowSelectionModel, DataGrid } from "@mui/x-data-grid";
import { useMemo, type SetStateAction } from "react";
import CategoryChip from "./CategoryChip";
import type { Item } from "../../../../helper/types";

// Fetches and displays the items in a table
interface ItemTableProps {
    items: Item[],
    rowSelectionModel: GridRowSelectionModel,
    setRowSelectionModel: React.Dispatch<SetStateAction<GridRowSelectionModel>>,
}

export default function ItemTable({ items, rowSelectionModel, setRowSelectionModel }: ItemTableProps) {

    // Defines the column data for MUI Data Grid
    const columns: GridColDef[] = useMemo(() => [
        { field: 'id', headerName: 'ID', width: 70, align: 'left', headerAlign: 'left' },
        { field: 'name', headerName: 'Name', type: 'string', width: 280, align: 'left', headerAlign: 'left' },
        { field: 'quantity', headerName: 'Quantity', type: 'number', width: 140, align: 'left', headerAlign: 'left' },
        {
            field: 'categories', headerName: 'Categories', type: 'actions',
            width: 280, align: 'left', headerAlign: 'left',
            renderCell: (params: GridRenderCellParams<Item>) => <CategoryChip {...{ params }} />,
        },
        { field: 'last_modified', headerName: 'Last Modified', valueGetter: (arg0) => new Date(arg0), type: 'date', width: 140, align: 'left', headerAlign: 'left' },
        {
            field: 'expiry_date', headerName: 'Expiry Date', renderCell: (arg0) =>
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