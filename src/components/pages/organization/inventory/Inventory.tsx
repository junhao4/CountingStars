import { useEffect, useState } from "react";
import { useOrgContext } from "../../../contexts/OrgContext";
import { usePageTitleContext } from "../../../contexts/PageTitleContext";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Item from "@mui/material/Grid";
import {
  Autocomplete,
  Box,
  Button,
  TextField,
  type AutocompleteRenderInputParams,
} from "@mui/material";
import supabase from "../../../../helper/supabaseClient";
import ItemTable from "./ItemTable";
import type { GridRowSelectionModel } from "@mui/x-data-grid/models";
import { useMessageContext } from "../../../contexts/MessageContext";
import { addLog, LogTypes } from "../Log";
import { useSessionContext } from "../../../contexts/SessionContext";

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

export default function OrgInventory() {
  const navigate = useNavigate();
  const { setTitle } = usePageTitleContext();
  const { getOrgContext } = useOrgContext();
  const orgProps = getOrgContext()!;
  const { session } = useSessionContext()!
  const { createMessage } = useMessageContext()

  // rowSelectionModel.ids contains the rows that are selected in ItemTable, used in handleDelete function.
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>({ type: "include", ids: new Set() });

  const [items, setItems] = useState<ItemFetch[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<CategoryFetch[]>([]);
  const [category, setCategory] = useState<CategoryFetch | null>(null);
  const [refresh, setRefresh] = useState<boolean>(true);

  // Fetches data to items
  const fetchItems = async () => {
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

        if (category) {
          setItems(
            res.data.filter(
              (items) =>
                items.categories.filter((cat) => cat.id === category.id)
                  .length > 0
            )
          );
          return;
        }

        setItems(res.data);
      });
  };

  // Fetches the list of all categories for the given organization
  const fetchCategoryOptions = async () => {
    await supabase
      .from("Categories")
      .select(`id, name`)
      .eq("org_id", orgProps.id)
      .then((res) => {
        if (res.error) {
          console.log(res.error.message);
          setCategoryOptions([]);
          return;
        }
        setCategoryOptions(res.data);
      });
  };

  // Handles the deletion of the selected data rows in ItemTable, whhen the delete button in ModifyBar is pressed.
  const handleDelete = async () => {
    Promise.all(
      Array.of(...rowSelectionModel.ids).map(async (id) => {

        const data = await supabase
          .from("Items")
          .update({deleted:true})
          .eq("id", parseInt(id.toString()))
          .single()
          .then((res) => {
            if (res.error) {
              createMessage('error', res.error.message)
              return false
            }
            addLog(orgProps.id, LogTypes.DELETE, session!.user.id, parseInt(id.toString()), {})
              .then(err => { if (err) { createMessage('error', err) } })
            return true
          });
        return data;
      })
    ).then((res) => {
      if (!res.reduce((prev, next) => prev && next, true)) {
        createMessage('error', "Delete error")
      }
      setRowSelectionModel({ type: "include", ids: new Set() });
      setRefresh((prev) => !prev);
    });
  };

  useEffect(() => {
    if (orgProps === null) navigate("/dashboard");
    setTitle(orgProps!.name);
  }, []);

  // Refresh the data grid items
  useEffect(() => {
    fetchItems();
    fetchCategoryOptions();
  }, [refresh]);

  return (
    <Box margin='1rem 4rem' bgcolor='primary.main' sx={{ outline: '2px solid black', borderRadius: '2px' }}>
      <QueryBar
        id={orgProps.id}
        categoryOptions={categoryOptions}
        setCategoryOptions={setCategoryOptions}
        category={category}
        setCategory={setCategory}
        fetchItems={fetchItems}
        fetchCategoryOptions={fetchCategoryOptions}
        handleDelete={handleDelete}
      />

      <ItemTable
        items={items}
        rowSelectionModel={rowSelectionModel}
        setRowSelectionModel={setRowSelectionModel}
      />
    </Box>
  );
}

// Query bar for the user to set search queries
interface QueryBarProps {
  id: number;
  categoryOptions: CategoryFetch[];
  setCategoryOptions: (arg0: CategoryFetch[]) => void;
  category: CategoryFetch | null;
  setCategory: (arg0: CategoryFetch | null) => void;
  fetchItems: () => void;
  fetchCategoryOptions: () => void;
  handleDelete: () => void;
}

function QueryBar({
  categoryOptions,
  category,
  setCategory,
  fetchItems,
  handleDelete,
}: QueryBarProps) {
  const navigate = useNavigate();
  return (
    <Grid container spacing={2} sx={{ padding: "16px" }}>
      <Grid size={4}>
        <Item>
          <Autocomplete
            size="small"
            renderInput={(params: AutocompleteRenderInputParams) => (
              <TextField {...params} label="Category" />
            )}
            options={categoryOptions.map((d) => {
              return d.name;
            })}
            value={category?.name || "No category selected"}
            onChange={(e, newValue) => {
              if (e)
                setCategory(
                  categoryOptions.find((pred) => pred.name === newValue) || null
                )
            }
            }
          />
        </Item>
      </Grid>
      <Grid size={8} gap="2rem" alignContent='center'>
        <Item display="flex" gap="2rem" justifySelf='left' width='100%'>
          <Button variant="contained" color='info' onClick={fetchItems} sx={{ marginRight: 'auto' }}>
            Search
          </Button>
          <Button variant="contained" color="secondary" onClick={() => navigate("add")}>
            Add Item
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete} sx={{ marginRight: '2rem' }}>
            Delete Selected
          </Button>
        </Item>
      </Grid>
    </Grid>
  );
}
