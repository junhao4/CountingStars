import { DataGrid, GridActionsCellItem, type GridColDef, type GridRowParams } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { useOrgContext, type ValidOrg } from "../../../common/contexts/OrgContext";
import supabase from "../../../helper/supabaseClient";
import { useAlertContext } from "../../../common/contexts/AlertContext";
import DeleteIcon from '@mui/icons-material/Delete';
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import { Typography } from "@mui/material";
import { usePageTitleContext } from "../../../common/contexts/PageTitleContext";
import { fetchItemCategories, addItemCategory } from "../../../features/organization/categories/api/CategoriesApi";

interface CategoryFetch {
    id: number,
    name: string,
    quantity: number,
}

export default function CategoriesPage() {
    const { setTitle } = usePageTitleContext()
    const { org } = useOrgContext() as ValidOrg
    const { createAlert } = useAlertContext()

    const [categories, setCategories] = useState<CategoryFetch[]>([])

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
                const deleteCategory = async () => {
                    const { error } = await supabase.from('Categories')
                        .delete()
                        .eq('id', row.id)

                    if (error) { createAlert('error', error.message) }
                    else {
                        console.log(categories)
                        setCategories(categories.filter(cat => cat.id !== row.id))
                        createAlert("success", "Successfully deleted category!")
                    }
                }

                return [
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="delete"
                        // @ts-expect-error
                        color="error"
                        onClick={deleteCategory}
                    />,]
            }
        }
    ], [categories])

    const [addCategoryName, setAddCategoryName] = useState<string>('')

    const onAddItemCategory = async () => {
        const res = await addItemCategory(org.id, addCategoryName, createAlert)
        if (res) {
            setCategories({...categories, ...res})
            createAlert("success", "Successfully added category!")
        }
    }

    useEffect(() => {
        fetchItemCategories(org.id).then(data => {
            setCategories(data)
        })
        setTitle(org.name)
    }, [])

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'right', alignItems: 'center', margin: '2rem 0', gap: '1rem' }}>
                <Typography variant="body1">Name: </Typography>
                <Input value={addCategoryName} placeholder='Name' onChange={(e) => setAddCategoryName(e.target.value)} />
                <Button color='success' variant='contained' onClick={onAddItemCategory}>Add Category</Button>
            </div>
            <DataGrid
                columns={columns}
                rows={categories}
            >
            </DataGrid>
        </div>
    )
}