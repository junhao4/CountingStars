import { type GridColDef, type GridEventListener, type GridRenderEditCellParams, type GridRowModel, type GridRowModesModel, type GridRowParams, DataGrid, GridActionsCellItem, GridRowEditStopReasons, GridRowModes } from "@mui/x-data-grid"
import { useState } from "react"
import { Typography, Input, Button, TextField } from "@mui/material"
import useGetCategories from "../hooks/useGetCategories"
import Loading from "../../../../common/components/Loading"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveAltIcon from '@mui/icons-material/SaveAlt'
import { updateCategoryName } from "../api/CategoriesApi"
import { useAlertContext } from "../../../../common/contexts/AlertContext"

interface CategoryFetch {
    id: number,
    name: string,
    quantity: number,
}

export default function Category() {
    const { createAlert } = useAlertContext()
    const { loading, categories, setCategories, handleAddCategory, handleDeleteCategory } = useGetCategories()

    const [addCategoryName, setAddCategoryName] = useState<string>('')

    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const handleRowEditStop: GridEventListener<"rowEditStop"> = (params, event) => {
        // If focus is outside, do not automatically commit row edit changes yet
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    }
    const onProcessRowUpdate = async (newRow: GridRowModel<CategoryFetch>, oldRow: GridRowModel<CategoryFetch>) => {
        if (newRow.name === oldRow.name) return oldRow
        const res = await updateCategoryName(newRow.id, newRow.name)
        if (!res) {
            createAlert("error", "Failed to update name")
            return oldRow
        }
        createAlert("success", "Successfully updated name!")
        setCategories(categories.map(cat => cat.id === newRow.id ? newRow : cat))
        return newRow
    }


    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70, align: 'left', headerAlign: 'left' },
        {
            field: 'name', headerName: 'Name', type: 'string', width: 280, align: 'left', headerAlign: 'left', editable: true,
            renderEditCell: (param: GridRenderEditCellParams<CategoryFetch, string>) => {
                return <TextField value={param.row.name} size="small"
                    onChange={e => param.api.setEditCellValue({id: param.id, value: e.target.value, field: 'name'})}/>
            }
        },
        { field: 'quantity', headerName: 'Number of items in category', type: 'number', width: 280, align: 'left', headerAlign: 'left' },
        {
            field: "actions",
            headerName: "Actions",
            width: 100,
            align: "left",
            headerAlign: "left",
            type: "actions",
            getActions: ({ id, row }: GridRowParams<CategoryFetch>) => {
                const handleEditClick = () => {
                    setRowModesModel({
                        ...rowModesModel,
                        [id]: { mode: GridRowModes.Edit },
                    });
                }
                const handleSaveClick = async () => {
                    setRowModesModel({
                        ...rowModesModel,
                        [id]: { mode: GridRowModes.View },
                    });
                };
                const handleCancelClick = () => {
                    setRowModesModel({
                        ...rowModesModel,
                        [id]: { mode: GridRowModes.View, ignoreModifications: true },
                    });
                };
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveAltIcon />}
                            label="save"
                            // @ts-expect-error
                            color="info"
                            onClick={handleSaveClick}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="cancel"
                            // @ts-expect-error
                            color="error"
                            onClick={handleCancelClick}
                        />
                    ]
                }
                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="edit"
                        // @ts-expect-error
                        color="info"
                        onClick={handleEditClick}
                    />
                    ,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="delete"
                        // @ts-expect-error
                        color="error"
                        onClick={() => confirm("Are you sure you want to delete the category?") && handleDeleteCategory(row.id)()}
                    />]
            }
        }
    ]

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
                editMode="row"
                getRowId={(row: CategoryFetch) => row.id}
                rowModesModel={rowModesModel}
                processRowUpdate={onProcessRowUpdate}
                onRowModesModelChange={(newRowMode) => setRowModesModel(newRowMode)}
                onRowEditStop={handleRowEditStop}
            >
            </DataGrid>
        </div>
    )
}