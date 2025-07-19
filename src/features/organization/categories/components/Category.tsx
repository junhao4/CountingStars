import { type GridColDef, type GridRowParams, DataGrid, GridActionsCellItem } from "@mui/x-data-grid"
import { useState, useMemo } from "react"
import DeleteIcon from "@mui/icons-material/Delete"
import { Typography, Input, Button } from "@mui/material"
import useGetCategories from "../hooks/useGetCategories"
import Loading from "../../../../common/components/Loading"

interface CategoryFetch {
    id: number,
    name: string,
    quantity: number,
}

export default function Category() {
    const { loading, categories, handleAddCategory, handleDeleteCategory } = useGetCategories()

    const [addCategoryName, setAddCategoryName] = useState<string>('')

    const columns: GridColDef[] = useMemo(() => [
        { field: 'id', headerName: 'ID', width: 70, align: 'left', headerAlign: 'left' },
        { field: 'name', headerName: 'Name', type: 'string', width: 280, align: 'left', headerAlign: 'left' },
        { field: 'quantity', headerName: 'Number of items in category', type: 'number', width: 280, align: 'left', headerAlign: 'left' },
        {
            field: "actions",
            headerName: "Actions",
            width: 100,
            align: "left",
            headerAlign: "left",
            type: "actions",
            getActions: ({ row }: GridRowParams<CategoryFetch>) => {
                return [
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="delete"
                        // @ts-expect-error
                        color="error"
                        onClick={handleDeleteCategory(row.id)}
                    />,]
            }
        }
    ], [categories])

    if (loading) { return <Loading /> }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'right', alignItems: 'center', margin: '2rem 0', gap: '1rem' }}>
                <Typography variant="body1">Name: </Typography>
                <Input value={addCategoryName} placeholder='Name' onChange={(e) => setAddCategoryName(e.target.value)} />
                <Button color='success' variant='contained' onClick={handleAddCategory(addCategoryName)}>Add Category</Button>
            </div>
            <DataGrid
                columns={columns}
                rows={categories}
            >
            </DataGrid>
        </div>
    )
}