import supabase from "../../../../helper/supabaseClient"


export const fetchCategories = async (organizationId: number) => {
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
    const { data, error } = await supabase.from('items_categories')
        .select('Items(deleted)', { count: 'exact' })
        .eq('category_id', categoryId)
    if (error) {
        console.log(error.message)
        return 0
    } else {
        return data.filter(d => !d.Items.deleted).length || 0
    }
}

export const addCategory = async (organizationId: number, categoryName: string) => {
    const { data, error } = await supabase.from('Categories')
        .insert({ org_id: organizationId, name: categoryName })
        .select()

    if (error) {
        console.log(error.message)
        return "categoryError"
    }

     return data.map(d => { return { ...d, quantity: 0 } })
}

export const updateCategoryName = async (categoryId: number, categoryName: string) => {
    const { error } = await supabase.from('Categories')
        .update({ name: categoryName })
        .eq('id', categoryId)
        .single()

    if (error) {
        console.log(error.message)
        return false
    }
    return true
}

export const deleteCategory = async (categoryId: number) => {
    const { error } = await supabase.from('Categories')
        .delete()
        .eq('id', categoryId)

    if (error) {
        console.log(error.message)
        return "categoryError"
    }

    const { error: error2 } = await supabase.from('items_categories')
        .delete()
        .eq('category_id', categoryId)

    if (error2) {
        console.log(error2.message)
        return "itemCategoryError"
    }
    
    return true
}