import type { CreateAlertType } from "../../../../common/contexts/AlertContext"
import supabase from "../../../../helper/supabaseClient"


export const fetchItemCategories = async (organizationId: number) => {
    const { data, error } = await supabase.from('Categories')
        .select('id, name')
        .eq('org_id', organizationId)

    if (error) {
        console.log(error.message)
        return []
    }
    else {
        const result = await Promise.all(data.map(async cat => {
            return { ...cat, quantity: await fetchNumberOfItemsWithCategory(cat.id), }
        }))
        return result
    }
}

const fetchNumberOfItemsWithCategory = async (categoryId: number) => {
    const { count, error } = await supabase.from('items_categories')
        .select('*', { count: 'exact' })
        .eq('category_id', categoryId)
    if (error) {
        console.log(error.message)
        return 0
    } else {
        return count || 0
    }
}

export const addItemCategory = async (organizationId: number, categoryName: string, createAlert: CreateAlertType) => {
    if (categoryName === '') {
        createAlert('error', "Name cannot be empty!")
        return null
    }
    const { data, error } = await supabase.from('Categories')
        .insert({ org_id: organizationId, name: categoryName })
        .select()

    if (error) {
        console.log(error.message)
        return null
    }
    else {
        return data.map(d => { return { ...d, quantity: 0 } })
    }
}