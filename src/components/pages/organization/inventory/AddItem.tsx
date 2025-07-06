import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import {
  Button,
  Chip,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography
} from "@mui/material";
import supabase from "../../../../helper/supabaseClient";
import { useOrgContext } from "../../../contexts/OrgContext";
import type { Dayjs } from "dayjs";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useMessageContext } from "../../../contexts/MessageContext";
import { addLog, LogTypes } from "../log/LogController";
import { useSessionContext } from "../../../contexts/SessionContext";
import { fetchCategoryOptions, handleCategoryChange, type CategoryFetch } from "./InventoryController";

export default function OrgAddItem() {
  const { getOrgContext } = useOrgContext();
  const orgProps = getOrgContext()!;
  const navigate = useNavigate();
  const { createMessage } = useMessageContext();
  const { session } = useSessionContext();

  const [itemName, setItemName] = useState<string>("");
  const [itemQuantity, setItemQuantity] = useState<number>(1);
  const [itemDescription, setItemDescription] = useState<string>("");
  const [itemCategory, setItemCategory] = useState<string[]>([]);
  const [itemExpiry, setItemExpiry] = useState<Dayjs | null>(null); // In the format YYYY-MM-DD

  const [categoryOptions, setCategoryOptions] = useState<CategoryFetch[]>([]);

   const handleAddItem = async () => {
    await supabase
      .from("Items")
      .insert({
        name: itemName,
        org_id: orgProps.id,
        quantity: itemQuantity,
        description: itemDescription,
        expiry_date: itemExpiry?.toDate().toDateString(),
      })
      .select()
      .single()
      .then((res) => {
        if (res.error) {
          createMessage('error', res.error.message);
          return Promise.reject(false);
        }

        Promise.all(
          itemCategory.map(async (value) => {
            const row = categoryOptions.find((cat) => cat.name === value);
            return row
              ? supabase
                .from("items_categories")
                .insert({ item_id: res.data.id, category_id: row.id })
                .then((res) => {
                  if (res.error) {
                    createMessage('error', res.error.message);
                    return false
                  }
                  return true
                })
              : Promise.resolve(true);
          })
        ).then((b: boolean[]) => {
          if (b.reduce((prev, next) => prev && next, true)) {
            addLog(orgProps.id, LogTypes.INSERT_NEW, session?.user.id!, res.data.id, {})
              .then(err => {
                if (err) { createMessage('error', "Error adding insert item to logs") }
                else { createMessage('success', "Successfully added item!") }
              })
          }
          navigate("/dashboard/organization/inventory")
        });

      });
  };


  useEffect(() => {
    fetchCategoryOptions(orgProps, createMessage, setCategoryOptions);
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifySelf="center"
      alignItems="end"
      color="var(--foreground-text)"
      width="40%"
      sx={{ outline: "2px solid black", borderRadius: "2px", margin: "2rem" }}
    >
      <Typography
        variant="h6"
        sx={{
          padding: "1rem 0 1rem 0",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 1px 0 black",
        }}
      >
        Add Item
      </Typography>

      <Box
        display="flex"
        gap="2rem"
        alignItems="center"
        margin="1rem 2rem 0 2rem"
        width="75%"
      >
        <Typography>Name: </Typography>
        <Input
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="Name"
          sx={{ flexGrow: 1 }}
        />
      </Box>

      <Box
        display="flex"
        gap="2rem"
        alignItems="center"
        margin="1rem 2rem 0 2rem"
        width="79%"
      >
        <Typography>Quantity: </Typography>
        <Input
          value={itemQuantity}
          onChange={(e) => setItemQuantity(parseInt(e.target.value))}
          placeholder="Quantity"
          type="number"
          sx={{ flexGrow: 1 }}
        />
      </Box>

      <Box
        display="flex"
        gap="2rem"
        alignItems="center"
        margin="1rem 2rem 0 2rem"
        width="84%"
      >
        <Typography>Description: </Typography>
        <Input
          value={itemDescription}
          onChange={(e) => setItemDescription(e.target.value)}
          placeholder="Description"
          multiline
          rows={3}
          sx={{ flexGrow: 1 }}
        />
      </Box>

      <FormControl
        size="small"
        sx={{ m: "1rem 2rem 0 2rem", width: "80%", alignSelf: "center" }}
      >
        <InputLabel id="item-category-chip-label">Categories</InputLabel>
        <Select
          labelId="item-category-chip-label"
          id="item-category-chip"
          multiple
          value={itemCategory}
          onChange={(e) => handleCategoryChange(e, setItemCategory)}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => {
                return <Chip key={value} label={value} />;
              })}
            </Box>
          )}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 48 * 4.5 + 8,
                width: 250,
              },
            },
          }}
        >
          {categoryOptions.map((cat) => (
            <MenuItem
              key={cat.id}
              value={cat.name}
            // style={}
            >
              {cat.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <DatePicker
        value={itemExpiry}
        onChange={(e) => setItemExpiry(e)}
        label="Expiry Date of Item"
        slotProps={{ textField: { size: "small" } }}
        sx={{ m: "1rem 2rem 0 2rem", alignSelf: "center", width: "80%" }}
      />

      <Box>
        <Button
          variant="contained"
          color="info"
          onClick={() => navigate(-1)}
          children="Back"
        />
        <Button
          sx={{ m: "1rem 2rem" }}
          variant="contained"
          color='secondary'
          onClick={handleAddItem}
          children="Add"
        />
      </Box>
    </Box>
  );
}
