import supabase from "../../../../../helper/supabaseClient"
import type { Item, ItemFolder, ItemWithCategories } from "../../../../../helper/types"


export const fetchFolders = async (organizationId: number, folderId: number | null) => {
    const { data, error } = await supabase.from('Folders')
        .select(`id, parentId:parent_id, name, description, 
            lastModified:last_modified, createdAt:created_at, deleted`)
        .filter('parent_id', folderId ? 'eq' : 'is', folderId)
        .eq("organization_id", organizationId)

    if (error) {
        console.log(error.message)
        return []
    }
    return data
        .map(item => { return { ...item, lastModified: new Date(item.lastModified).toDateString() } }) as ItemFolder[]
}

export const fetchAllFolders = async (organizationId: number) => {
    const { data, error } = await supabase.from('Folders')
        .select(`id, parentId:parent_id, name, description, 
            lastModified:last_modified, createdAt:created_at, deleted`)
        .eq("organization_id", organizationId)

    if (error) {
        console.log(error.message)
        return []
    }
    return data
        .map(item => { return { ...item, lastModified: new Date(item.lastModified).toDateString() } }) as ItemFolder[]
}

export const fetchItems = async (organizationId: number, folderId: number | null) => {
    const { data, error } = await supabase.from('Items')
        .select('id, folderId:folder_id, name, quantity, description, lastModified:last_modified, expiryDate:expiry_date')
        .filter('folder_id', folderId ? 'eq' : 'is', folderId)
        .eq('deleted', false)
        .eq("org_id", organizationId)

    if (error) {
        console.log(error.message)
        return []
    }

    return await Promise.all(data
        .map(item => { return { ...item, lastModified: new Date(item.lastModified).toDateString() } })
        .map(async item => await fetchCategories(item as Item))) as ItemWithCategories[]
}

const fetchCategories = async (item: Item) => {
    const { data, error } = await supabase.from('items_categories')
        .select('id:category_id, Categories(name), createdAt:created_at')
        .match({ item_id: item.id })

    if (error) {
        console.log(error.message)
        return { ...item, categories: [] } as ItemWithCategories
    }
    return { ...item, categories: data.map(cat => { return { ...cat, name: cat.Categories.name } }) } as ItemWithCategories
}

export const addNewFolder = async (organizationId: number, parentFolder: number | 'root', folderName: string) => {
    const { data, error } = await supabase.from("Folders")
        .insert({ ...{ organization_id: organizationId, name: folderName }, ...(parentFolder === 'root' ? {} : { parent_id: parentFolder }) })
        .select("*")
        .single()

    if (error) {
        console.log(error)
        return null
    }
    return transformFolder(data)
}

export const fetchCurrentFolder = async (itemId: number) => {
    const { data, error } = await supabase
        .from("Items")
        .select("Folders(name)")
        .eq("id", itemId)
        .maybeSingle();

    if (error) {
        console.log(error)
        return 'itemError'
    }
    else return data
}

export const moveItemIntoFolder = async (itemType: 'item' | 'folder', itemId: number, folderId: number | null) => {
    if (itemType === 'item') {


        const { error } = await supabase.from("Items")
            .update({ folder_id: folderId })
            .eq('id', itemId)
            .single()

        if (error) {
            console.log(error.message)
            return false
        }
    } else {
        const { error } = await supabase.from("Folders")
            .update({ parent_id: folderId })
            .eq('id', itemId)
            .single()

        if (error) {
            console.log(error.message)
            return false
        }
    }
    return true
}




// Used for FolderRow
export const deleteFolder = async (folderId: number) => {
    const { error } = await supabase.from('Folders')
        .delete()
        .eq('id', folderId)
        .single()

    if (error) {
        console.log(error.message)
        return false
    }
    return true
}



// Used for Inventory Breadcrumbs
export const fetchParentFolders = async (folderId: number | 'root') => {
    var currentId = folderId
    const folderIdArr: { id: number | 'root', name: string }[] = []

    while (currentId !== 'root') {
        const { data, error } = await supabase.from('Folders')
            .select('parent_id, name')
            .match({ id: currentId })
            .single()

        if (error) {
            console.log(error)
            return folderIdArr
        }

        folderIdArr.push({ id: currentId, name: data.name })

        if (data.parent_id) {
            currentId = data.parent_id
        } else {
            currentId = 'root'
        }
    }

    folderIdArr.push({ id: 'root', name: 'Root' })

    return folderIdArr.reverse()
}

const transformFolder = (folder: {
    created_at: string,
    deleted: boolean,
    description: string,
    id: number,
    last_modified: string,
    name: string,
    organization_id: number,
    parent_id: number | null,
}) => {
    return {
        ...folder, lastModified: folder.last_modified, createdAt: folder.created_at,
        organizationId: folder.organization_id, parentId: folder.parent_id
    } as ItemFolder
}