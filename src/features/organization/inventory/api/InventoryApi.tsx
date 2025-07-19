import type { SelectChangeEvent } from "@mui/material";
import type { GridRowSelectionModel } from "@mui/x-data-grid";
import type { AlertType, CreateAlertType } from "../../../../common/contexts/AlertContext";
import supabase from "../../../../helper/supabaseClient";
import type { Category, Item, Organization } from "../../../../helper/types";
import { addLog, LogTypes } from "../../log/api/LogApi";

export type DisplayCategory = Omit<Category, "createdAt">

// Fetches the list of all categories for the given organization
export const fetchCategoryOptions = async (org: Organization,
  createAlert: (arg0: AlertType, arg1: string) => void,
  setCategoryOptions: React.Dispatch<React.SetStateAction<DisplayCategory[]>>
) => {
  await supabase
    .from("Categories")
    .select(`id, name`)
    .eq("org_id", org.id)
    .then((res) => {
      if (res.error) {
        createAlert("error", res.error.message);
        setCategoryOptions([]);
        return;
      }
      setCategoryOptions(res.data);
    });
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
export const fetchItems = async (org: Organization,
  createAlert: (arg0: AlertType, arg1: string) => void,
  setItems: React.Dispatch<React.SetStateAction<Item[]>>,
  category: DisplayCategory | null
) => {
  await supabase
    .from("Items")
    .select(
      `id, name, quantity, description, lastModified:last_modified, expiryDate:expiry_date, categories:Categories(id, name, createdAt:created_at)`
    )
    .eq("org_id", org.id)
    .eq('deleted', false)
    .then((res) => {
      if (res.error) {
        createAlert('error', res.error.message);
        return;
      }

      const fixDate = res.data.map((item) => ({
        ...item,
        description: item.description || "",
        expiryDate: item.expiryDate
          ? item.expiryDate
          : "-",
      }));
      if (category) {
        setItems(
          fixDate.filter(
            (items) =>
              items.categories.filter((cat) => cat.id === category.id)
                .length > 0
          )
        );
        return;
      }

      setItems(fixDate);
    });
};

// Handles the deletion of the selected data rows in ItemTable, whhen the delete button in ModifyBar is pressed.
export const handleDelete = async (
  userId: string,
  organizationId: number,
  rowSelectionModel: GridRowSelectionModel,
  createAlert: CreateAlertType,
) => {
  Promise.all(
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
          const data = await addLog(organizationId, "removeItem", userId, id, {})
          if (!data) {
            return false
          }
          return true
        });
      return data;
    })
  ).then((res) => {
    if (!res.reduce((prev, next) => prev && next, true)) {
      createAlert('error', "Delete error")
    } else {
      createAlert('success', 'Successfully deleted items!')
    }
  });
}

export const handleAddItem = async (userId: string, item: Omit<Item, "id"> & { categories: string[] },
  categoryOptions: DisplayCategory[], organizationId: number, createAlert: (arg0: AlertType, arg1: string) => void,
) => {
  await supabase
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
    .then((res) => {
      if (res.error) {
        console.log(res.error.message);
        return Promise.reject(false);
      }

      Promise.all(
        item.categories.map(async (value) => {
          const row = categoryOptions.find((cat) => cat.name === value);
          return row
            ? supabase
              .from("items_categories")
              .insert({ item_id: res.data.id, category_id: row.id })
              .then((res) => {
                if (res.error) {
                  createAlert('error', res.error.message);
                  return false
                }
                return true
              })
            : Promise.resolve(true);
        })
      ).then(async (b: boolean[]) => {
        if (b.reduce((prev, next) => prev && next, true)) {
          const data = await addLog(organizationId, "addItem", userId, res.data.id, {})
          if (!data) {
            createAlert('error', "Error adding insert item to logs")
            return null
          }
          else {
            createAlert('success', "Successfully added item!")
            return true
          }
        }
      });

    });
};

