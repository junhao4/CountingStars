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
  

  // Add to Item Categories table
  const res = await Promise.all(
    item.categories.map(async (value) => {
      return supabase
          .from("items_categories")
          .insert({ item_id: data.id, category_id: value })
          .then((res) => {
            if (res.error) {
              console.log(res.error.message);
              return false
            }
            return true
          })
    })
  ).then(async (b: boolean[]) => {
    if (b.reduce((prev, next) => prev && next, true)) {
      // await addLog(organizationId, LogTypes.INSERT_NEW, userId, data.id, {})
      return true
    }
    return false
  })
  return res
};