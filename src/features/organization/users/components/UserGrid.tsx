import { type GridRowsProp, type GridRowModesModel, type GridEventListener, GridRowEditStopReasons, type GridRowModel, GridActionsCellItem, type GridColDef, type GridRenderCellParams, type GridRenderEditCellParams, GridRowModes, type GridRowParams, DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { OrganizationRoles, type OrganizationRolesType, type User, type UserOrganization } from "../../../../helper/types";
import { useNavigate } from "react-router-dom";
import { useOrgContext } from "../../../../common/contexts/OrgContext";
import { useSessionContext, type ValidSession } from "../../../../common/contexts/SessionContext";
import { updateUserRole, deleteUser, acceptPendingUser, rejectPendingUser, fetchOrganizationUsers } from "../api/UserGridApi";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Avatar, Typography, Autocomplete, TextField } from "@mui/material";
import { compareRolesTo, hasPermission } from "../../../../helper/RolePermissions";
import Loading from "../../../../common/components/Loading";

type UserGridData = Omit<User, "createdAt"> & { role: OrganizationRolesType }

interface UserGridProps {
    refresh: boolean
}

export default function UserGrid({refresh}: UserGridProps) {
    const { user } = useSessionContext() as ValidSession
    const { getOrgContext } = useOrgContext();
    const orgProps = getOrgContext()!;
    const userWithOrganization = { userId: user.id, role: orgProps.role, organizationId: orgProps.id } as UserOrganization
    const navigate = useNavigate();
    const { setOrgContext } = useOrgContext();

    const [loading, setLoading] = useState<boolean>(true);

    const [rows, setRows] = useState<GridRowsProp<UserGridData>>([]);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const countOfOwners = rows.filter((row) => row.role === "owner").length;

    const handleRowEditStop: GridEventListener<"rowEditStop"> = (params, event) => {
        // If focus is outside, do not automatically commit row edit changes yet
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    // When row is updated, update the target user's role. Does not fire if no changes are made.
    const onProcessRowUpdate = async (newRow: GridRowModel<UserGridData>) => {
        await updateUserRole(user.id, newRow.id, orgProps.id, newRow.role)
        if (newRow.id === user.id) {
            setOrgContext({ ...orgProps, role: newRow.role });
        }
        setRows(rows.map((row) => (row.id === newRow.id ? newRow : row)))
        return newRow
    }

    const columns: GridColDef[] = [
        { field: "id", headerName: "User ID", width: 140, align: "left", headerAlign: "left", type: "string" },
        {
            field: "name", headerName: "Name", width: 280, align: "left", headerAlign: "left", type: "string",
            renderCell: (params: GridRenderCellParams<UserGridData, string>) => {
                if (!params.value) {
                    return "NULL";
                }
                const val = params.value.split(",");
                return (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "left",
                            gap: "16px",
                        }}
                    >
                        <Avatar src={val[1]}></Avatar>
                        <Typography sx={{ alignSelf: "center" }}>{val[0]}</Typography>
                    </div>
                );
            },
        },
        {
            field: "role", headerName: "Role", width: 280, align: "left", headerAlign: "left", type: "singleSelect", display: 'flex',
            valueOptions: ["owner", "admin", "member"], sortComparator: compareRolesTo, editable: true,

            // Capitalizes the first letter of role
            renderCell: (param: GridRenderCellParams<UserGridData, string>) =>
                param.value!.charAt(0).toUpperCase() + param.value!.slice(1),

            // Render a custom Select component with role options, disabled based on permissions. 
            renderEditCell: (param: GridRenderEditCellParams<UserGridData, string>) => {
                return <Autocomplete disableClearable value={param.value as OrganizationRolesType} fullWidth
                    options={OrganizationRoles.slice(0, 3)} getOptionLabel={(option: string) => option}
                    onChange={(event: any, newValue: string) => {
                        if (event) { }
                        param.api.setEditCellValue({ id: param.id, field: "role", value: newValue as OrganizationRolesType })
                    }}
                    getOptionDisabled={(option) => !hasPermission(userWithOrganization, "users", option === "owner" ? "changeToOwner"
                        : option === "admin" ? "changeToAdmin" : "changeToMember",
                        { userId: param.row.id, organizationId: orgProps.id, role: param.row.role, countOfOwners }
                    )}
                    renderInput={(params) => (
                        <TextField {...params} variant="standard" />
                    )}
                />
            }
        },
        { field: "email", headerName: "Email", width: 280, align: "left", headerAlign: "left", type: "string", display: 'flex' },
        {
            field: "actions", headerName: "Actions", width: 100, align: "left", headerAlign: "left", type: "actions",

            // Returns the actionable buttons, depending on VIEW/EDIT state and role.
            getActions: ({ id, row }: GridRowParams<UserGridData>) => {
                const handleEditClick = () => {
                    setRowModesModel({
                        ...rowModesModel,
                        [id]: { mode: GridRowModes.Edit },
                    });
                };

                const handleSaveClick = async () => {
                    setRowModesModel({
                        ...rowModesModel,
                        [id]: { mode: GridRowModes.View },
                    });
                };

                const handleDeleteUser = async () => {
                    await deleteUser(user.id, row.id, orgProps.id)
                    setRows(rows.filter((row) => row.id !== id));
                    if (row.id == user.id) {
                        navigate("/dashboard");
                    }
                }

                const handleCancelClick = () => {
                    setRowModesModel({
                        ...rowModesModel,
                        [id]: { mode: GridRowModes.View, ignoreModifications: true },
                    });
                };

                const handleAcceptPendingUser = async () => {
                    await acceptPendingUser(user.id, row.id, orgProps.id)

                    const newUser = rows.find((row) => row.id === id)!;
                    setRows([
                        ...rows.filter((row) => row.id !== id),
                        { ...newUser, role: "member" },
                    ]);
                }

                const handleRejectPendingUser = async () => {
                    await rejectPendingUser(user.id, row.id, orgProps.id)
                    setRows(rows.filter((row) => row.id !== id));
                }

                if (row.role === "pending") {
                    return [
                        <GridActionsCellItem
                            icon={<CheckCircleIcon />}
                            label="save"
                            // @ts-expect-error
                            color="info"
                            onClick={handleAcceptPendingUser}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="save"
                            // @ts-expect-error
                            color="info"
                            onClick={handleRejectPendingUser}
                        />,
                    ];
                }

                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveAltIcon />}
                            label="save"
                            // @ts-expect-error
                            color="info"
                            onClick={handleSaveClick}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="save"
                            // @ts-expect-error
                            color="info"
                            onClick={handleCancelClick}
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="save"
                        // @ts-expect-error
                        color="info"
                        onClick={handleEditClick}
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="save"
                        // @ts-expect-error
                        color="info"
                        onClick={handleDeleteUser}
                        disabled={hasPermission<"users">(userWithOrganization,
                            "users", "remove", { userId: row.id, organizationId: orgProps.id, role: row.role, countOfOwners: 0 })}
                    />,
                ];
            },
        },
    ];

    useEffect(() => {
        fetchOrganizationUsers(orgProps.id).then(data => {
            if (data) setRows(data)
            setLoading(false)
        })
    }, [refresh]);

    if (loading) return <Loading />

    return (
        <DataGrid
            columns={columns}
            rows={rows.map((user) => {
                return { ...user, name: user.name + "," + user.imageFile };
            })}
            editMode="row"
            getRowId={(row: UserGridData) => row.id}
            getRowHeight={() => "auto"}
            rowModesModel={rowModesModel}
            onRowModesModelChange={(newRowMode) => setRowModesModel(newRowMode)}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={onProcessRowUpdate}
            initialState={{
                sorting: {
                    sortModel: [{ field: "role", sort: "desc" }],
                },
            }} />
    )
}