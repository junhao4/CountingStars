import type { SelectChangeEvent } from "@mui/material";
import type { GridRowSelectionModel } from "@mui/x-data-grid";
import type { AlertType } from "../../../../common/contexts/AlertContext";
import supabase from "../../../../helper/supabaseClient";
import type { Category, Item, ItemWithCategories, Organization } from "../../../../helper/types";
import { addLog, LogTypes } from "../../log/api/LogApi";

export type DisplayCategory = Omit<Category, "createdAt">

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


// Sets the item category
export const handleCategoryChange = (event: SelectChangeEvent<string[]>,
  setItemCategory: React.Dispatch<React.SetStateAction<string[]>>
) => {
  const {
    target: { value },
  } = event;
  setItemCategory(
    // On autofill we get a stringified value.
    typeof value === "string" ? [] : value
  );
};

//Fetches item data from supabase
export const fetchItems = async (organizationId: number) => {
  const { data, error } = await supabase
    .from("Items")
    .select(
      `id, name, quantity, description, lastModified:last_modified, expiryDate:expiry_date, 
            categories:Categories(id, name, createdAt:created_at)`
    )
    .eq("org_id", organizationId)
    .eq('deleted', false)

  if (error) {
    console.log(error.message);
    return [];
  } else if (!data) {
    return [];
  }

  const fixDate = data.map(item => {
    return {
      ...item, lastModified: item.lastModified!,
      expiryDate: item.expiryDate ? item.expiryDate : "-"
    }
  })

  return fixDate as ItemWithCategories[]
}

// Handles the deletion of the selected data rows in ItemTable, whhen the delete button in ModifyBar is pressed.
export const handleDelete = async (
  userId: string,
  organizationId: number,
  rowSelectionModel: GridRowSelectionModel,
) => {
  const res = await Promise.all(
    Array.of(...rowSelectionModel.ids).map(async (id) => {
      id = id as number
      const data = await supabase
        .from("Items")
        .update({ deleted: true })
        .eq("id", id)
        .single()
        .then(async (res) => {
          if (res.error) {
            console.log(res.error.message)
            return false
          }
          const data = await addLog(organizationId, LogTypes.DELETE, userId, id, {})
          if (!data) {
            return false
          }
          return true
        });
      return data;
    })
  )
  return res.reduce((prev, next) => prev && next, true)
}

export const handleAddItem = async (userId: string, item: Omit<Item, "id" | "lastModified"> & { categories: string[] },
  categoryOptions: DisplayCategory[], organizationId: number,
) => {
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
      const row = categoryOptions.find((cat) => cat.name === value);
      return row
        ? supabase
          .from("items_categories")
          .insert({ item_id: data.id, category_id: row.id })
          .then((res) => {
            if (res.error) {
              console.log(res.error.message);
              return false
            }
            return true
          })
        : Promise.resolve(true);
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

