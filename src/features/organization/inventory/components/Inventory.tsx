import { useEffect, useState } from "react";
import { useOrgContext, type ValidOrg } from "../../../../common/contexts/OrgContext";
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
import { useAlertContext } from "../../../../common/contexts/AlertContext";
import { useSessionContext, type ValidSession } from "../../../../common/contexts/SessionContext";
import { fetchCategoryOptions, fetchItems, handleDelete, type CategoryFetch, type ItemFetch } from "../api/InventoryApi";

export default function Inventory() {
  const { org } = useOrgContext() as ValidOrg
  const { session } = useSessionContext() as ValidSession
  const { createAlert } = useAlertContext()

  // rowSelectionModel.ids contains the rows that are selected in ItemTable, used in handleDelete function.
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>({ type: "include", ids: new Set() });

  const [items, setItems] = useState<ItemFetch[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<CategoryFetch[]>([]);
  const [category, setCategory] = useState<CategoryFetch | null>(null);
  const [refresh, setRefresh] = useState<boolean>(true);

  const handleDel = () => {
    return handleDelete(rowSelectionModel, createAlert, org, session!, setRowSelectionModel, setRefresh)
  }

  // Refresh the data grid items
  useEffect(() => {
    fetchItems(org, createAlert, setItems, category);
    fetchCategoryOptions(org, createAlert, setCategoryOptions);
  }, [refresh]);

  return (
    <div style={{ maxWidth: '70%', margin: '1rem 0' }}>
      <QueryBar
        id={org.id}
        categoryOptions={categoryOptions}
        setCategoryOptions={setCategoryOptions}
        category={category}
        setCategory={setCategory}
        fetchItems={() => fetchItems(org, createAlert, setItems, category)}
        fetchCategoryOptions={() => fetchCategoryOptions(org, createAlert, setCategoryOptions)}
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
