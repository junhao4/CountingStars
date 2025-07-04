import { useEffect, useState } from "react";
import { useOrgContext } from "../../../contexts/OrgContext";
import { usePageTitleContext } from "../../../contexts/PageTitleContext";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Item from "@mui/material/Grid";
import {
  Autocomplete,
  Button,
  TextField,
  type AutocompleteRenderInputParams,
} from "@mui/material";
import ItemTable from "./ItemTable";
import type { GridRowSelectionModel } from "@mui/x-data-grid/models";
import { useMessageContext } from "../../../contexts/MessageContext";
import { useSessionContext } from "../../../contexts/SessionContext";
import { fetchCategoryOptions, fetchItems, handleDelete, type CategoryFetch, type ItemFetch } from "./InventoryController";

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

  const handleDel = () => {
    return handleDelete(rowSelectionModel, createMessage, orgProps, session!, setRowSelectionModel, setRefresh)
  }

  useEffect(() => {
    if (orgProps === null) navigate("/dashboard");
    setTitle(orgProps!.name);
  }, []);

  // Refresh the data grid items
  useEffect(() => {
    fetchItems(orgProps, createMessage, setItems, category);
    fetchCategoryOptions(orgProps, createMessage, setCategoryOptions);
  }, [refresh]);

  return (
    <div style={{ maxWidth: '70%', margin: '1rem 0' }}>
      <QueryBar
        id={orgProps.id}
        categoryOptions={categoryOptions}
        setCategoryOptions={setCategoryOptions}
        category={category}
        setCategory={setCategory}
        fetchItems={() => fetchItems(orgProps, createMessage, setItems, category)}
        fetchCategoryOptions={() => fetchCategoryOptions(orgProps, createMessage, setCategoryOptions)}
        handleDelete={handleDel}
      />

      <ItemTable
        items={items}
        rowSelectionModel={rowSelectionModel}
        setRowSelectionModel={setRowSelectionModel}
      />
    </div>
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
    <Grid container spacing={2} sx={{ padding: "1rem" }}>
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
            Add New Item
          </Button>
          <Button variant="contained" color="info" onClick={() => navigate("categories")}>
            Modify Categories
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete} sx={{ marginRight: '2rem' }}>
            Delete Selected
          </Button>
        </Item>
      </Grid>
    </Grid>
  );
}
