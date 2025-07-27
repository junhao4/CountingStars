import { generateFileName } from "../../../../common/functions/File";
import supabase from "../../../../helper/supabaseClient";
import { addLog } from "../../log/api/LogApi";
import type { UploadItem } from "../components/AddItem";

export const addItem = async (userId: string, item: UploadItem, organizationId: number) => {
  const imageFile = item.image ? generateFileName(item.image) : undefined

  // Add to Items table
  const { data, error } = await supabase
    .from("Items")
    .insert({
      folder_id: item.folderId,
      name: item.name,
      org_id: organizationId,
      quantity: item.quantity,
      description: item.description,
      expiry_date: item.expiryDate?.toDate().toDateString() || null,
      image_file: imageFile,
    })
    .select()
    .single()

  if (error) {
    console.log(error.message);
    return Promise.reject(false);
  }

  // Add to Image storage
  if (imageFile) {
    const res = await supabase.storage.from('item-images')
      .upload(imageFile, item.image!)
    if (res.error) console.log(res.error.message)
  }
  
await addLog(organizationId, "addItem", userId, data.id, { quantity: item.quantity })

  // Add to Item Categories table
  const res = await Promise.all(
    item.categories.map(async (value) => {
        return await addItemCategory(data.id, value, organizationId, userId)
    })
  ).then(async (b: boolean[]) => {
    if (b.reduce((prev, next) => prev && next, true)) {
      
      return true
    }
    return false
  })
  return res
};

const addItemCategory = async (itemId: number, categoryId: number, organizationId : number, userId : string) => {
  const {data, error} = await supabase
      .from("items_categories")
      .insert({ item_id: itemId, category_id: categoryId })
      .select("Categories(name)")
            
      if (error) {
          console.log(error.message);
          return false
      }
      const catName = data[0].Categories.name
      addLog(organizationId, "addItemCategory", userId, itemId, {categoryName: catName})
      return true
}

