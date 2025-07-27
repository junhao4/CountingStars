import { Box, Typography, Button, Stack } from "@mui/material";
import type { Dayjs } from "dayjs";
import { useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { useAlertContext } from "../../../../common/contexts/AlertContext";
import { useOrgContext, type ValidOrg } from "../../../../common/contexts/OrgContext";
import { useSessionContext, type ValidSession } from "../../../../common/contexts/SessionContext";
import { addItem } from "../api/AddItemApi";
import { CategoryField, ExpiryDateField, ImageNameQuantityDescriptionField } from "./ComponentFields";
import { hasPermission } from "../../../../helper/RolePermissions";
import { FolderSelect } from "./FolderSelect";

export type UploadItem = {
    folderId: number | null;
    name: string;
    quantity: number;
    description: string;
    expiryDate: Dayjs | null;
    categories: number[];
    image: File | undefined;
    imageBlobUrl: string | undefined;
}

export type Action =
    | { type: 'SET_NAME', value: string }
    | { type: 'SET_QUANTITY', value: number }
    | { type: 'SET_DESCRIPTION', value: string }
    | { type: 'SET_EXPIRY_DATE', value: Dayjs | null }
    | { type: 'SET_CATEGORIES', value: number[] }
    | { type: 'SET_IMAGE', value: File | undefined }
    | { type: 'SET_FOLDERID', value: number | null}

const itemReducer = (state: UploadItem, action: Action) => {
    switch (action.type) {
        case 'SET_NAME':
            return { ...state, name: action.value }
        case 'SET_QUANTITY':
            return { ...state, quantity: action.value }
        case 'SET_DESCRIPTION':
            return { ...state, description: action.value }
        case 'SET_EXPIRY_DATE':
            return { ...state, expiryDate: action.value }
        case 'SET_CATEGORIES':
            return { ...state, categories: action.value }
        case 'SET_IMAGE':
            return action.value 
                ? { ...state, image: action.value, imageBlobUrl: URL.createObjectURL(action.value)}
                : { ...state, image: undefined, imageBlobUrl: undefined }
        case 'SET_FOLDERID':
            return {...state, folderId: action.value}
        default:
            return state
    }
}

const initialState = {
    folderId: null,
    name: "",
    quantity: 0,
    description: "",
    expiryDate: null,
    categories: [],
    image: undefined,
    imageBlobUrl: undefined
}

export default function AddItem() {
    const navigate = useNavigate()

    const { org } = useOrgContext() as ValidOrg
    const { createAlert } = useAlertContext();
    const { user } = useSessionContext() as ValidSession
    const userWithOrg = { userId: user.id, organizationId: org.id, role: org.role }

    const [state, dispatch] = useReducer(itemReducer, initialState)

    const handleAddItem = async () => {
        const res = await addItem(user.id, state, org.id)
        if (res) {
            createAlert("success", "Successfully added item!")
        } else {
            createAlert("error", "Failed to add item")
        }
        navigate(-1)
    }

    return (
        <Box width="60%" sx={{ outline: "2px solid black", borderRadius: "2px", margin: "2rem" }}>
            <Stack sx={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>

                <Typography variant="h6" sx={{ p: '1rem 0', width: "100%", textAlign: "center", boxShadow: "0 1px 0 black" }}>
                    Add Item
                </Typography>

                <FolderSelect state={state} dispatch={dispatch} />

                <ImageNameQuantityDescriptionField state={state} dispatch={dispatch} />

                <CategoryField state={state} dispatch={dispatch} />

                <ExpiryDateField state={state} dispatch={dispatch} />

                <Box>
                    <Button variant="contained" color="info" onClick={() => navigate(-1)} children="Back" />
                    <Button disabled={!hasPermission(userWithOrg, "inventory", "update")} sx={{ m: "1rem 2rem" }} variant="contained" color='secondary' onClick={handleAddItem} children="Add" />
                </Box>
            </Stack>
        </Box>
    );
}