import { DataGrid, GridActionsCellItem, type GridColDef, type GridRowParams } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { useOrgContext } from "../../../contexts/OrgContext";
import supabase from "../../../../helper/supabaseClient";
import { useMessageContext } from "../../../contexts/MessageContext";
import DeleteIcon from '@mui/icons-material/Delete';
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import { Typography } from "@mui/material";
import { usePageTitleContext } from "../../../contexts/PageTitleContext";

interface CategoryFetch {
    id: number,
    name: string,
    quantity: number,
}

export default function OrgCategories() {
    const { setTitle } = usePageTitleContext()
    const { getOrgContext } = useOrgContext()!
    const orgProps = getOrgContext()!
    const { createMessage } = useMessageContext()

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

                    if (error) { createMessage('error', error.message) }
                    else {
                        console.log(categories)
                        setCategories(categories.filter(cat => cat.id !== row.id))
                        createMessage("success", "Successfully deleted category!")
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

    const fetchCategories = async () => {
        await supabase.from('Categories')
            .select('id, name')
            .eq('org_id', orgProps.id)
            .then(res => {
                if (res.error) {createMessage('error', res.error.message)}
                else {
                    Promise.all(res.data.map(async cat => {
                        const { count, error } = await supabase.from('items_categories')
                            .select('*', { count:'exact' })
                            .eq('category_id', cat.id)

                        if (error) { createMessage('error', error.message); return {...cat, quantity: 0} }
                        else {
                            return {...cat, quantity: count || 0}
                        }
                    }))
                    .then(res => {
                        setCategories(res)
                    })
                }
            })
    }

    const [addCategoryName, setAddCategoryName] = useState<string>('')
    const handleAddCategory = async () => {
        if (addCategoryName === '') {
            createMessage('error', "Name cannot be empty!")
            return
        }
        const { data, error } = await supabase.from('Categories')
            .insert({ org_id: orgProps.id, name: addCategoryName })
            .select()

        if (error) { createMessage('error', error.message) }
        else {
            setCategories([...categories, ...data.map(d => {return {...d, quantity: 0}})])
            createMessage('success', "Successfully added category!")
        }
    }

    useEffect(() => {
        fetchCategories()
        setTitle(orgProps.name)
    }, [])

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'right', alignItems: 'center', margin: '2rem 0', gap: '1rem' }}>
                <Typography variant="body1">Name: </Typography>
                <Input value={addCategoryName} placeholder='Name' onChange={(e) => setAddCategoryName(e.target.value)} />
                <Button color='success' variant='contained' onClick={handleAddCategory}>Add Category</Button>
            </div>
            <DataGrid
                columns={columns}
                rows={categories}
            >
            </DataGrid>
        </div>
    )
}