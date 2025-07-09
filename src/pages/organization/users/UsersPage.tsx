import {
  DataGrid, GridActionsCellItem, GridRowEditStopReasons, GridRowModes,
  type GridColDef, type GridEventListener, type GridRenderCellParams, type GridRowModel, type GridRowModesModel,
  type GridRowParams, type GridRowsProp,
} from "@mui/x-data-grid";
import { useOrgContext } from "../../../common/contexts/OrgContext";
import { useEffect, useState } from "react";
import supabase from "../../../helper/supabaseClient";
import { Avatar, Box, Button, FormControl, Input, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { usePageTitleContext } from "../../../common/contexts/PageTitleContext";
import Loading from "../../../common/components/Loading";
import { useSessionContext, type ValidSession } from "../../../common/contexts/SessionContext";
import { useNavigate } from "react-router-dom";
import { useAlertContext } from "../../../common/contexts/AlertContext";
import type { OrganizationRolesType } from "../../../helper/types";
import { addNotification } from "../../../features/notifications/api/NotificationsApi";
import { addOrganizationUser, fetchOrganizationUsers } from "../../../features/organization/users/api/UsersApi";

interface UserFetch {
  id: string;
  name: string | null;
  role: OrganizationRolesType;
  image_file: string;
  email: string | null;
}

export default function UsersPage() {
  const { user } = useSessionContext() as ValidSession
  const { getOrgContext } = useOrgContext();
  const orgProps = getOrgContext()!;
  const { setTitle } = usePageTitleContext();
  const navigate = useNavigate();
  const { createAlert } = useAlertContext();
  const { setOrgContext } = useOrgContext();

  const [email, setEmail] = useState<string>('')
  const [role, setRole] = useState<string>('member')



  const onAddOrganizationUser = async () => {
    const res = await addOrganizationUser(user.id, orgProps.id, email, role, createAlert)
    if (res) {
      setRefresh(prev => !prev)
    }
  }

  const [loading, setLoading] = useState<boolean>(true);

  const [rows, setRows] = useState<GridRowsProp<UserFetch>>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const numOwners = rows.filter((row) => row.role === "owner").length;

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    // If focus is outside, do not automatically commit row edit changes yet
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  // Commits any changes to supabase + update table view
  const processRowUpdate = (newRow: GridRowModel<UserFetch>) => {
    const oldRow = rows.find((row) => row.id === newRow.id);
    if (
      oldRow?.role === "owner" &&
      newRow.role !== "owner" &&
      numOwners === 1
    ) {
      createAlert("error", "The organization needs at least 1 owner!");
      return oldRow;
    } else if (oldRow?.role === newRow.role) {
      return oldRow
    }

    setRows(rows.map((row) => (row.id === newRow.id ? newRow : row)));
    new Promise(() =>
      supabase
        .from("users_organizations")
        .update({ role: newRow.role })
        .eq("user_id", newRow.id)
        .eq("organization_id", orgProps.id)
        .single()
        .then((res) => {
          if (res.error) {
            createAlert('error', res.error.message);
          } else {
            createAlert('success', 'Successfully updated user role!')
          }
        })
    );

    if (newRow.id === user.id) {
      setOrgContext({
        id: orgProps.id,
        name: orgProps.name,
        role: newRow.role,
      });
    }

    //notify user of role change
    addNotification(user.id, newRow.id, orgProps.id, 4);
    return newRow;
  };

  const roleToValue = (v: string) => {
    switch (v) {
      case "owner":
        return 2;
      case "admin":
        return 1;
      case "member":
      case "pending":
        return 0;

      default:
        return 0;
    }
  };

  const roleSortComparator = (v1: string, v2: string) => {
    return roleToValue(v1) - roleToValue(v2);
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "User ID",
      width: 140,
      align: "left",
      headerAlign: "left",
      type: "string",
    },
    {
      field: "name",
      headerName: "Name",
      width: 280,
      align: "left",
      headerAlign: "left",
      type: "string",
      renderCell: (params: GridRenderCellParams<UserFetch, string>) => {
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
      field: "role",
      headerName: "Role",
      width: 280,
      align: "left",
      headerAlign: "left",
      type: "singleSelect",
      valueOptions: ["owner", "admin", "member"],
      renderCell: (param: GridRenderCellParams<UserFetch, string>) =>
        param.value!.charAt(0).toUpperCase() + param.value!.slice(1),
      sortComparator: roleSortComparator,
      editable: true,
    },
    {
      field: "email",
      headerName: "Email",
      width: 280,
      align: "left",
      headerAlign: "left",
      type: "string",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      align: "left",
      headerAlign: "left",
      type: "actions",
      getActions: ({ id, row }: GridRowParams<UserFetch>) => {
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

        const handleDeleteClick = async () => {
          await supabase
            .from("users_organizations")
            .delete()
            .eq("user_id", row.id)
            .eq("organization_id", orgProps.id)
            .then((res) => {
              if (res.error) console.log(res.error.message);
              else {
                setRows(rows.filter((row) => row.id !== id));
                //notify user of deletion
                addNotification(user.id, row.id, orgProps.id, 2);
              }
            });

          if (row.id == user.id) {
            navigate("/dashboard");
          }
        };

        const handleCancelClick = () => {
          setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
          });
        };

        // Prevent deletion of user if user's role is higher than current user's role.
        // Or if there will be no 'owner' roles remaining after the deletion.
        const isDisabled =
          roleSortComparator(row.role, orgProps.role) >= 0 ||
          (numOwners === 1 && row.role === "owner");

        const editDisabled =
          roleSortComparator(row.role, orgProps.role) >= 0 &&
          orgProps.role !== "owner";

        const acceptPendingUser = async () => {
          const newUser = rows.find((row) => row.id === id)!;
          setRows([
            ...rows.filter((row) => row.id !== id),
            { ...newUser, role: "member" },
          ]);
          await supabase
            .from("users_organizations")
            .update({ role: "member" })
            .eq("user_id", row.id)
            .eq("organization_id", orgProps.id)
            .single()
            .then((res) => {
              if (res.error) {
                console.log(res.error.message);
              }
            });

          addNotification(user.id, row.id, orgProps.id, 5)
        };

        const rejectPendingUser = async () => {
          setRows(rows.filter((row) => row.id !== id));
          await supabase
            .from("users_organizations")
            .delete()
            .eq("user_id", row.id)
            .eq("organization_id", orgProps.id)
            .single()
            .then((res) => {
              if (res.error) {
                console.log(res.error.message);
              }
            });
          addNotification(user.id, row.id, orgProps.id, 6)
        };

        if (row.role === "pending") {
          return [
            <GridActionsCellItem
              icon={<CheckCircleIcon />}
              label="save"
              // @ts-expect-error
              color="info"
              onClick={acceptPendingUser}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="save"
              // @ts-expect-error
              color="info"
              onClick={rejectPendingUser}
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
            disabled={editDisabled}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="save"
            // @ts-expect-error
            color="info"
            onClick={handleDeleteClick}
            disabled={isDisabled}
          />,
        ];
      },
    },
  ];

  const [refresh, setRefresh] = useState<boolean>(true);
  useEffect(() => {
    fetchOrganizationUsers(orgProps.id).then(res => {
      if (res) setRows(res)
      setLoading(false)
    })
  }, [refresh]);

  useEffect(() => {
    setTitle(orgProps.name + " Users");
  }, []);

  return loading ? (
    <Loading></Loading>
  ) : (
    <div style={{ width: '70%', maxWidth: '70%', margin: '1rem 0' }}>
      <Box hidden={!(orgProps.role === "owner" || orgProps.role === "admin")}
        sx={{ display: 'flex', flexWrap: 'nowrap', justifyContent: 'right', gap: '4rem', alignItems: 'center', p: '1rem' }}
        bgcolor='transparent'>
        <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '2rem', alignItems: 'center' }}>
          <Typography>Email: </Typography>
          <Input value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder='Email' />
        </div>
        <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '2rem', alignItems: 'center' }}>
          <Typography>Role: </Typography>
          <FormControl size="small">
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              id="role-select"
              value={role}
              label="Role"
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value={'owner'}>Owner</MenuItem>
              <MenuItem value={'admin'}>Admin</MenuItem>
              <MenuItem value={'member'}>Member</MenuItem>
            </Select>
          </FormControl>
        </div>
        <Button variant="contained" color='secondary' onClick={onAddOrganizationUser}>
          Add user
        </Button>
      </Box>
      <DataGrid
        columns={columns}
        rows={rows.map((user) => {
          return { ...user, name: user.name + "," + user.image_file };
        })}
        editMode="row"
        getRowId={(row: UserFetch) => row.id}
        getRowHeight={() => "auto"}
        rowModesModel={rowModesModel}
        onRowModesModelChange={(newRowMode) => setRowModesModel(newRowMode)}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        initialState={{
          sorting: {
            sortModel: [{ field: "role", sort: "desc" }],
          },
        }}
      ></DataGrid>
    </div>
  );
}
