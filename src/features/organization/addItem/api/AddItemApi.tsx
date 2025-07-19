import supabase from "../../../../helper/supabaseClient";
import { addLog, LogTypes } from "../../log/api/LogApi";

type UploadItem = {
    name: string;
    quantity: number;
    description: string;
    expiryDate: string | null;
    categories: number[]
}

export const addItem = async (userId: string, item: UploadItem, organizationId: number) => {
  const { data, error } = await supabase
    .from("Items")
    .insert({
      name: item.name,
      org_id: organizationId,
      quantity: item.quantity,
      description: item.description,
      expiry_date: item.expiryDate
    })
    .select()
    .single()
  if (error) {
    console.log(error.message);
    return Promise.reject(false);
  }

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
      await addLog(organizationId, LogTypes.INSERT_NEW, userId, data.id, {})
      return true
    }
    return false
  })
  return res
};