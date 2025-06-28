import {
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridRowModes,
  type GridColDef,
  type GridComparatorFn,
  type GridEventListener,
  type GridRenderCellParams,
  type GridRowId,
  type GridRowModel,
  type GridRowModesModel,
  type GridRowParams,
  type GridRowsProp,
} from "@mui/x-data-grid";
import {
  useOrgContext,
  type OrgProps,
  type UserRoles,
} from "../../../contexts/OrgContext";
import { useEffect, useMemo, useState, type SetStateAction } from "react";
import supabase from "../../../../helper/supabaseClient";
import {
  Avatar,
  Box,
  Button,
  MenuItem,
  Select,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { usePageTitleContext } from "../../../contexts/PageTitleContext";
import Loading from "../../../general/Loading";
import { useSessionContext } from "../../../contexts/SessionContext";
import AddUserPopup from "./AddUserPopup";
import { useNavigate } from "react-router-dom";
import { useMessageContext } from "../../../contexts/MessageContext";
import { addNotification } from "../../notifications/Notifications";

interface UserFetch {
  id: string;
  name: string | null;
  role: UserRoles;
  image_file: string;
  email: string | null;
}

export default function OrgUsers() {
  const { session } = useSessionContext();
  const { getOrgContext } = useOrgContext();
  const orgProps = getOrgContext()!;
  const { setTitle } = usePageTitleContext();
  const navigate = useNavigate();
  const { createMessage } = useMessageContext();
  const { setOrgContext } = useOrgContext();

  const [loading, setLoading] = useState<boolean>(true);
  const [addUserTrigger, setAddUserTrigger] = useState(false);

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
  const processRowUpdate = (newRow: GridRowModel<UserFetch>) => {
    const oldRow = rows.find((row) => row.id === newRow.id);
    if (
      oldRow?.role === "owner" &&
      newRow.role !== "owner" &&
      numOwners === 1
    ) {
      createMessage("error", "The organization needs at least 1 owner!");
      return oldRow;
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
            console.log(res.error.message);
          }
        })
    );

    if (newRow.id === session?.user.id) {
      setOrgContext({
        id: orgProps.id,
        name: orgProps.name,
        role: newRow.role,
      });
    }
    
    //notify user of role change
    addNotification(session!.user.id, newRow.id, orgProps.id, 4);
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "left",
              gap: "16px",
            }}
          >
            <Avatar src={val[1]}></Avatar>
            <Typography sx={{ alignSelf: "center" }}>{val[0]}</Typography>
          </Box>
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
      width: 280,
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
                addNotification(session!.user.id, row.id, orgProps.id, 2);
              }
            });

          if (row.id == session?.user.id) {
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
          
           addNotification(session?.user.id!, row.id, orgProps.id, 5) 
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
            addNotification(session?.user.id!, row.id, orgProps.id, 6)
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

  const fetchUsers = async () => {
    await supabase
      .from("users_organizations")
      .select("user_id, role")
      .eq("organization_id", orgProps.id)
      .then((res) => {
        if (res.error) {
          console.log(res.error.message);
          return null;
        }
        const promises = res.data.map(async (user) => {
          const { data, error } = await supabase
            .from("Users")
            .select("user_id, name, image_file, email")
            .eq("user_id", user.user_id)
            .single();

          if (error) {
            console.log(error.message);
            return null;
          }

          var imageURL = "";
          if (data.image_file) {
            const { data: img, error: e } = await supabase.storage
              .from("profile-images")
              .download(data.image_file);

            if (e) {
              console.log(e.message);
            } else {
              imageURL = URL.createObjectURL(img);
            }
          }
          const result = {
            id: user.user_id,
            name: data.name,
            role: user.role as UserRoles,
            image_file: imageURL,
            email: data.email,
          };
          return result;
        });

        Promise.all(promises).then((data) => {
          if (data) {
            setRows(data.filter((d) => !!d));
            setLoading(false);
          }
        });
      });
  };

  const [refresh, setRefresh] = useState<boolean>(true);
  useEffect(() => {
    fetchUsers();
  }, [refresh]);

  useEffect(() => {
    setTitle(orgProps.name + " Users");
  }, []);

  return loading ? (
    <Loading></Loading>
  ) : (
    <Box>
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

      <div hidden={!(orgProps.role === "owner" || orgProps.role === "admin")}>
        <Button variant="contained" onClick={() => setAddUserTrigger(true)}>
          Add user
        </Button>
        <AddUserPopup
          trigger={addUserTrigger}
          closePopup={() => {
            setAddUserTrigger(false);
          }}
          setRefresh={setRefresh}
        />
      </div>
    </Box>
  );
}
