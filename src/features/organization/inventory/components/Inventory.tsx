import { useState } from "react";
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
import useGetCategoryList from "../hooks/useGetCategoryList";
import Loading from "../../../../common/components/Loading";
import useGetTableItems from "../hooks/useGetTableItems"

export default function Inventory() {
  const { org } = useOrgContext() as ValidOrg

  const { loading, categoryList } = useGetCategoryList()
  const { loading: inventoryLoading, filteredItems, handleFilterItems,
    handleDeleteItems, rowSelectionModel, setRowSelectionModel } = useGetTableItems()

  if (loading || inventoryLoading) { return <Loading /> }

  return (
    <div style={{ maxWidth: '70%', margin: '1rem 0' }}>
      <QueryBar
        id={org.id}
        categoryOptions={categoryList.map(cat => cat.name)}
        handleDelete={handleDeleteItems}
        handleFilter={handleFilterItems}
      />

      <ItemTable
        items={filteredItems}
        rowSelectionModel={rowSelectionModel}
        setRowSelectionModel={setRowSelectionModel}
      />
    </div>
  );
}

// Query bar for the user to set search queries
interface QueryBarProps {
  id: number;
  categoryOptions: string[]
  handleFilter: (cats: string[]) => () => void;
  handleDelete: () => void;
}

function QueryBar({ categoryOptions, handleFilter, handleDelete }: QueryBarProps) {
  const navigate = useNavigate();

  const [filterCategories, setFilterCategories] = useState<string[]>([])

  return (
    <Grid container spacing={2} sx={{ padding: "1rem" }}>
      <Grid size={4}>
        <Item>
          <Autocomplete
            size="small" multiple
            renderInput={(params: AutocompleteRenderInputParams) => (
              <TextField {...params} label="Category" />
            )}
            options={categoryOptions}
            value={filterCategories}
            onChange={(e, newValue) => {
              if (e) setFilterCategories(newValue)
            }
            }
          />
        </Item>
      </Grid>
      <Grid size={8} gap="2rem" alignContent='center'>
        <Item display="flex" gap="2rem" justifySelf='left' width='100%'>
          <Button variant="contained" color='info' onClick={handleFilter(filterCategories)} sx={{ marginRight: 'auto' }}>
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
