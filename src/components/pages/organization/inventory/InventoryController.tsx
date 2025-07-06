import type { SelectChangeEvent } from "@mui/material";
import supabase from "../../../../helper/supabaseClient";
import type { VariantType } from "../../../contexts/MessageContext";
import type { OrgProps } from "../../../contexts/OrgContext";
import type { Session } from "@supabase/supabase-js";
import { LogTypes, addLog } from "../log/LogController";
import type { GridRowSelectionModel } from "@mui/x-data-grid";


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
export  const fetchCategoryOptions = async (orgProps : OrgProps,
    createMessage : (arg0: VariantType, arg1: string) => void,
    setCategoryOptions : React.Dispatch<React.SetStateAction<CategoryFetch[]>>
) => {
    await supabase
      .from("Categories")
      .select(`id, name`)
      .eq("org_id", orgProps.id)
      .then((res) => {
        if (res.error) {
          createMessage("error", res.error.message);
          setCategoryOptions([]);
          return;
        }
        setCategoryOptions(res.data);
      });
  };


// Sets the item category
export const handleCategoryChange = (event: SelectChangeEvent<string[]>,
    setItemCategory : React.Dispatch<React.SetStateAction<string[]>>
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
export const fetchItems = async (orgProps : OrgProps,
     createMessage : (arg0: VariantType, arg1: string) => void,
     setItems : React.Dispatch<React.SetStateAction<ItemFetch[]>>,
     category : CategoryFetch | null
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
          createMessage('error', res.error.message);
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
    rowSelectionModel : GridRowSelectionModel,
    createMessage : (arg0: VariantType, arg1: string) => void,
    orgProps : OrgProps,
    session : Session,
    setRowSelectionModel : React.Dispatch<React.SetStateAction<GridRowSelectionModel>>,
    setRefresh : React.Dispatch<React.SetStateAction<boolean>>
  ) => {
      Promise.all(
        Array.of(...rowSelectionModel.ids).map(async (id) => {
          id = id as number
          const data = await supabase
            .from("Items")
            .update({ deleted: true })
            .eq("id", id)
            .single()
            .then((res) => {
              if (res.error) {
                createMessage('error', res.error.message)
                return false
              }
              addLog(orgProps.id, LogTypes.DELETE, session!.user.id, id, {})
                .then(err => { if (err) { createMessage('error', err) } })
              return true
            });
          return data;
        })
      ).then((res) => {
        if (!res.reduce((prev, next) => prev && next, true)) {
          createMessage('error', "Delete error")
        } else {
          createMessage('success', 'Successfully deleted items!')
        }
        setRowSelectionModel({ type: "include", ids: new Set() });
        setRefresh((prev) => !prev);
      });
    }



