import supabase from "../../../../helper/supabaseClient";
import type { Item, ItemWithCategories } from "../../../../helper/types";
import { addLog } from "../../log/api/LogApi";


// ITEM INFO

export const fetchItem = async (itemId: number) => {
    const { data, error } = await supabase
        .from("Items")
        .select(
            `id, name, quantity, description, lastModified:last_modified, expiryDate:expiry_date, 
            categories:Categories(id, name, createdAt:created_at)`
        )
        .eq("id", itemId)
        .eq('deleted', false)
        .maybeSingle()

    if (error) {
        console.log(error.message);
        return null;
    } else if (!data) {
        return null;
    }

    const fixDate = {
        ...data, lastModified: data.lastModified!,
        expiryDate: data.expiryDate,
    }

    return fixDate as ItemWithCategories
}

export const updateItem = async (newItem: Item) => {
    const { error } = await supabase
        .from("Items")
        .update({
            name: newItem.name, description: newItem.description, quantity: newItem.quantity,
            expiry_date: newItem.expiryDate, last_modified: new Date(Date.now()).toISOString()
        })
        .eq('id', newItem.id)
    if (error) {
        console.log(error.message);
        return null;
    }

    return newItem
}

export const deleteItem = async (itemId: number, userId: string, organizationId: number) => {
    const { data, error } = await supabase.from("Items")
        .update({deleted: true, last_modified: new Date(Date.now()).toDateString()})
        .eq('id', itemId)
        .select()
        .single()

    if (error) {
        console.log(error)
        return "itemError"
    }

    const res = await addLog(organizationId, "removeItem", userId, itemId, {quantity : data.quantity})

    return res ? true : "logError"
}

// Fetches the list of all categories for the given organization
export const fetchCategoryOptions = async (organizationId: number) => {
    const { data, error } = await supabase
        .from("Categories")
        .select(`id, name`)
        .eq("org_id", organizationId)
    if (error) {
        console.log("error", error.message);
        return []
    }
    return data
};






export const fetchItemLogs = async (itemId: number) => {
    const { data, error } = await supabase.from('Logs')
        .select('id, Items(name), type, Users(name), created_at, metadata')
        .eq('item_id', itemId)

    if (error) { console.log(error.message) }

    return data?.map(d => { return { ...d, item_name: d.Items.name, user_name: d.Users.name || "DELETED USER" } }) || []
}

// ITEM IMAGES

export const fetchItemImage = async (itemId: number) => {
    const { data, error } = await supabase.from('Items')
        .select('image_file')
        .eq('id', itemId)
        .single()

    if (error) {
        console.log(error.message)
        return null
    }

    const { data: image, error: error2 } = await supabase.storage
        .from('item-images')
        .download(data.image_file)

    if (error2) {
        console.log(error2.message)
        return null
    }
    return { imageFile: data.image_file, imageBlob: image }
}

export const updateItemImage = async (itemId: number, oldImageName: string, imageFile: File) => {
    if (oldImageName !== 'default_item.jpg') {
        const { error } = await supabase.storage
            .from('item-images')
            .remove([oldImageName])

        if (error) {
            console.log(error.message)
            return
        }
    }

    const { error: storageError } = await supabase.storage
        .from('item-images')
        .upload(imageFile.name, imageFile)

    if (storageError) {
        console.log(storageError.message)
        return
    }

    const { error } = await supabase.from('Items')
        .update({ image_file: imageFile.name })
        .eq('id', itemId)
        .single()

    if (error) {
        console.log(error.message)
        return null
    }
    return true
}

// Removes old image, sets to default item image, and returns that blob
export const setDefaultItemImage = async (itemId: number, oldImageName: string) => {
    const { error: storageError } = await supabase.storage
        .from('item-images')
        .remove([oldImageName])

    if (storageError) {
        console.log(storageError.message)
        return null
    }

    const { error } = await supabase.from('Items')
        .update({ image_file: "default_item.jpg" })
        .eq('id', itemId)
        .single()

    if (error) {
        console.log(error.message)
        return null
    }

    const { data, error: downloadError } = await supabase.storage
        .from('item-images')
        .download("default_item.jpg")

    if (downloadError) {
        console.log(downloadError.message)
        return null
    }
    return data
}

export const deleteItemCategory = async (userId: string, organizationId: number, itemId: number, 
    _itemName: string,  categoryId: number, categoryName: string,) => {
    const { error } = await supabase.from('items_categories')
        .delete()
        .eq('item_id', itemId)
        .eq('category_id', categoryId)

    if (error) {
        console.log(error.message)
        return null
    }

    return await addLog(organizationId, "removeItemCategory", userId, itemId, { categoryName })
}

// ITEM CATEGORY

export const addItemCategory = async (userId: string, organizationId: number, itemId: number,
    _itemName: string, categoryId: number, categoryName: string) => {
    const { error } = await supabase.from('items_categories')
        .insert({ item_id: itemId, category_id: categoryId })

    if (error) {
        console.log(error.message)
        return null
    }

    return await addLog(organizationId, "addItemCategory", userId, itemId, { categoryName })
}