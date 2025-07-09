import type { SelectChangeEvent } from "@mui/material";
import type { GridRowSelectionModel } from "@mui/x-data-grid";
import type { AlertType } from "../../../../common/contexts/AlertContext";
import type { OrgProps } from "../../../../common/contexts/OrgContext";
import supabase from "../../../../helper/supabaseClient";
import type { Session } from "@supabase/supabase-js";
import type { Inventory } from "../../../../helper/types";
import { addLog, LogTypes } from "../../log/api/LogApi";


export interface ItemFetch {
  id: number;
  name: string;
  quantity: number;
  last_modified: string | null;
  expiry_date: string | null;
  categories: CategoryFetch[] | null;
}

export interface CategoryFetch {
  id: number;
  name: string;
}


// Fetches the list of all categories for the given organization
export const fetchCategoryOptions = async (orgProps: OrgProps,
  createAlert: (arg0: AlertType, arg1: string) => void,
  setCategoryOptions: React.Dispatch<React.SetStateAction<CategoryFetch[]>>
) => {
  await supabase
    .from("Categories")
    .select(`id, name`)
    .eq("org_id", orgProps.id)
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
export const fetchItems = async (orgProps: OrgProps,
  createAlert: (arg0: AlertType, arg1: string) => void,
  setItems: React.Dispatch<React.SetStateAction<ItemFetch[]>>,
  category: CategoryFetch | null
) => {
  await supabase
    .from("Items")
    .select(
      `id, name, quantity, last_modified, expiry_date, categories:Categories(id, name)`
    )
    .eq("org_id", orgProps.id)
    .eq('deleted', false)
    .then((res) => {
      if (res.error) {
        createAlert('error', res.error.message);
        return;
      }

      const fixDate = res.data.map((item) => ({
        ...item,
        expiry_date: item.expiry_date
          ? item.expiry_date
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
  rowSelectionModel: GridRowSelectionModel,
  createAlert: (arg0: AlertType, arg1: string) => void,
  orgProps: OrgProps,
  session: Session,
  setRowSelectionModel: React.Dispatch<React.SetStateAction<GridRowSelectionModel>>,
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>
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
          const data = await addLog(orgProps.id, LogTypes.DELETE, session!.user.id, id, {})
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
    setRowSelectionModel({ type: "include", ids: new Set() });
    setRefresh((prev) => !prev);
  });
}

export const handleAddItem = async (userId: string, item: Omit<Inventory, "id"> & { categories: string[] },
  categoryOptions: CategoryFetch[], organizationId: number, createAlert: (arg0: AlertType, arg1: string) => void,
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
        createAlert('error', res.error.message);
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
          const data = await addLog(organizationId, LogTypes.INSERT_NEW, userId, res.data.id, {})
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

