import { useEffect, useState } from "react"
import { useOrgContext } from "../../../contexts/OrgContext"
import { usePageTitleContext } from "../../../contexts/PageTitleContext"
import { useNavigate } from "react-router-dom"
import Grid from "@mui/material/Grid"
import Item from "@mui/material/Grid"
import { Autocomplete, Box, Button, TextField, type AutocompleteRenderInputParams } from "@mui/material"
import supabase from "../../../../helper/supabaseClient"
import OrgAddItemPopup from "../AddItemPopup"
import ItemTable from "./ItemTable"
import type { GridRowSelectionModel } from "@mui/x-data-grid/models"

export interface ItemFetch {
    id: number,
    name: string,
    quantity: number,
    description: string | null,
    last_modified: string | null,
    expiry_date: string | null,
    categories: CategoryFetch[] | null,
}

export interface CategoryFetch {
    id: number,
    name: string
}

export default function OrgInventory() {
    const navigate = useNavigate()
    const { setTitle } = usePageTitleContext()
    const { getOrgContext } = useOrgContext(); const orgProps = getOrgContext()!

    // rowSelectionModel.ids contains the rows that are selected in ItemTable, used in handleDelete function.
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>({ type: 'include', ids: new Set() })

    const [items, setItems] = useState<ItemFetch[]>([])
    const [categoryOptions, setCategoryOptions] = useState<CategoryFetch[]>([])
    const [category, setCategory] = useState<CategoryFetch | null>(null)
    const [triggerAddItem, setTriggerAddItem] = useState<boolean>(false)
    const [refresh, setRefresh] = useState<boolean>(true)

    // Fetches data to items
    const fetchItems = async () => {
        await supabase.from('Items')
            .select(`id, name, quantity, description, last_modified, expiry_date, categories:Categories(id, name)`)
            .eq('org_id', orgProps.id)
            .then(res => {
                if (res.error) {
                    console.log(res.error.message)
                    return
                }

                if (category) {
                    setItems(res.data.filter(items => items.categories.filter(cat => cat.id === category.id).length > 0))
                    return
                }

                setItems(res.data)
            })
    }

    // Fetches the list of all categories for the given organization
    const fetchCategoryOptions = async () => {
        await supabase.from('Categories')
            .select(`id, name`)
            .eq('org_id', orgProps.id)
            .then(res => {
                if (res.error) {
                    console.log(res.error.message)
                    setCategoryOptions([])
                    return
                }
                setCategoryOptions(res.data)
            })
    }

    // Handles the deletion of the selected data rows in ItemTable, whhen the delete button in ModifyBar is pressed.
    const handleDelete = async () => {
        Promise.all(Array.of(...rowSelectionModel.ids).map(async id => {
            const data = await supabase.from('Items')
                .delete()
                .eq('id', parseInt(id.toString()))
                .then(res => { if (res.error) { console.log(res.error.message); return false } return true })
            return data
        })).then(res => {
            if (!(res.reduce((prev, next) => prev && next, true))) { console.log(false) }
            setRowSelectionModel({ type: 'include', ids: new Set() })
            setRefresh(prev => !prev)
        })
    }

    useEffect(() => {
        if (orgProps === null) navigate('/dashboard')
        fetchItems()
        fetchCategoryOptions()
        setTitle(orgProps!.name)
    }, [])

    // Refresh the data grid items
    useEffect(() => {
        fetchItems()
        fetchCategoryOptions()
    }, [refresh])

    return (
        <>
            <QueryBar id={orgProps.id} categoryOptions={categoryOptions} setCategoryOptions={setCategoryOptions}
                category={category} setCategory={setCategory}
                fetchItems={fetchItems} fetchCategoryOptions={fetchCategoryOptions} />

            <ItemTable items={items} categoryOptions={categoryOptions} rowSelectionModel={rowSelectionModel}
                setRowSelectionModel={setRowSelectionModel} fetchItems={fetchItems} fetchCategoryOptions={fetchCategoryOptions} />

            <ModifyBar setTrigger={setTriggerAddItem} handleDelete={handleDelete} />

            {triggerAddItem
                ? <OrgAddItemPopup trigger={triggerAddItem} closePopup={() => setTriggerAddItem(false)} setRefresh={setRefresh}
                    categoryList={categoryOptions} />
                : null}
        </>
    )
}

// Query bar for the user to set search queries
interface QueryBarProps {
    id: number,
    categoryOptions: CategoryFetch[],
    setCategoryOptions: (arg0: CategoryFetch[]) => void,
    category: CategoryFetch | null,
    setCategory: (arg0: CategoryFetch | null) => void,
    fetchItems: () => void,
    fetchCategoryOptions: () => void,
}

function QueryBar({ id, categoryOptions, category, setCategory, fetchItems }: QueryBarProps) {
    return (
        <Grid container spacing={2} sx={{ padding: '16px' }}>
            <Grid size={4}>
                <Item>
                    <Autocomplete renderInput={(params: AutocompleteRenderInputParams) => <TextField {...params} label='Category' />}
                        options={categoryOptions.map(d => { return d.name })} value={category?.name || "No category selected"}
                        onChange={(e, newValue) => setCategory(categoryOptions.find(pred => pred.name === newValue) || null)} />
                </Item>
            </Grid>
            <Grid size={4}>
                <Item>
                    <Button variant='contained' onClick={fetchItems}>Search</Button>
                </Item>
            </Grid>
        </Grid>
    )
}

// Footer bar for adding items and deleting selected items
interface ModifyBarProps {
    setTrigger: (arg0: boolean) => void,
    handleDelete: () => void,
}

function ModifyBar({ setTrigger, handleDelete }: ModifyBarProps) {
    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: '64px', padding: '32px' }}>
                <Button variant='contained' onClick={e => setTrigger(true)}>Add Item</Button>
                <Button variant='contained' onClick={handleDelete}>Delete Selected</Button>
            </Box>
        </>
    )
}

