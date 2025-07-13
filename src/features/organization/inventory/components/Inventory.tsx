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
import { fetchCategoryOptions, fetchItems, handleDelete, type DisplayCategory } from "../api/InventoryApi";
import type { ItemWithCategories } from "../../../../helper/types";
import useGetCategoryList from "../hooks/useGetCategoryList";
import Loading from "../../../../common/components/Loading";

export default function Inventory() {
  const { org } = useOrgContext() as ValidOrg
  const { user } = useSessionContext() as ValidSession
  const { loading, categoryList, setCategoryList } = useGetCategoryList()
  const { createAlert } = useAlertContext()

  // rowSelectionModel.ids contains the rows that are selected in ItemTable, used in handleDelete function.
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>({ type: "include", ids: new Set() });

  const [items, setItems] = useState<ItemWithCategories[]>([]);
  const [category, setCategory] = useState<DisplayCategory | null>(null);
  const [refresh, setRefresh] = useState<boolean>(true);

  const onHandleDelete = async () => {
    const res = await handleDelete(user.id, org.id, rowSelectionModel)
    if (res) {
      createAlert("success", "Successfully deleted item!")
    } else {
      createAlert("error", "Failed to delete item!")
    }
    setRowSelectionModel({ type: "include", ids: new Set() });
    setRefresh((prev) => !prev);
  }

  // Refresh the data grid items
  useEffect(() => {
    fetchItems(org.id)
    .then(data => setItems(data))
  }, [refresh]);

  if (loading) {return <Loading />}

  return (
    <div style={{ maxWidth: '70%', margin: '1rem 0' }}>
      <QueryBar
        id={org.id}
        categoryOptions={categoryList}
        setCategoryOptions={setCategoryList}
        category={category}
        setCategory={setCategory}
        fetchItems={() => fetchItems(org.id)}
        fetchCategoryOptions={() => fetchCategoryOptions(org.id).then(data => setCategoryList(data))}
        handleDelete={onHandleDelete}
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
  categoryOptions: DisplayCategory[];
  setCategoryOptions: (arg0: DisplayCategory[]) => void;
  category: DisplayCategory | null;
  setCategory: (arg0: DisplayCategory | null) => void;
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
