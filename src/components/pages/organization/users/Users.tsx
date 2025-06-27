import { DataGrid, GridActionsCellItem, GridRowEditStopReasons, GridRowModes, type GridColDef, type GridComparatorFn, type GridEventListener, type GridRenderCellParams, type GridRowId, type GridRowModel, type GridRowModesModel, type GridRowsProp } from "@mui/x-data-grid";
import { useOrgContext, type OrgProps, type UserRoles } from "../../../contexts/OrgContext";
import { useEffect, useMemo, useState, type SetStateAction } from "react";
import supabase from "../../../../helper/supabaseClient";
import { Avatar, Box, Button, MenuItem, Select, Typography, type SelectChangeEvent } from "@mui/material";
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import { usePageTitleContext } from "../../../contexts/PageTitleContext";
import Loading from "../../../general/Loading";
import { useSessionContext } from "../../../contexts/SessionContext";
import AddUserPopup from "./AddUserPopup";

interface UserFetch {
    id: string,
    name: string | null,
    role: UserRoles,
    image_file: string,
    email: string | null,
}

export default function OrgUsers() {
    const { session } = useSessionContext()
    const { getOrgContext } = useOrgContext()
    const orgProps = getOrgContext()!
    const { setTitle } = usePageTitleContext()

    const [loading, setLoading] = useState<boolean>(true)
    const [addUserTrigger, setAddUserTrigger] = useState(false)

    const [rows, setRows] = useState<GridRowsProp<UserFetch>>([])
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        // If focus is outside, do not automatically commit row edit changes yet
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };
    const processRowUpdate = (newRow: GridRowModel<UserFetch>) => {
        setRows(rows.map((row) => (row.id === newRow.id ? newRow : row)));
        return newRow;
    }

    const roleSortComparator: GridComparatorFn<string> = (v1, v2) => {
        return v1 === v2
            ? 0
            : v1 === 'pending'
                ? 1
                : v2 === 'pending'
                    ? -1
                    : v1 === 'owner'
                        ? 1
                        : v2 === 'owner'
                            ? -1
                            : v1 === 'admin'
                                ? 1
                                : -1
    }

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'User ID', width: 140, align: 'left', headerAlign: 'left', type: 'string' },
        {
            field: 'name', headerName: 'Name', width: 280, align: 'left', headerAlign: 'left', type: 'string',
            renderCell: (params: GridRenderCellParams<UserFetch, string>) => {
                if (!params.value) {
                    return 'NULL'
                }
                const val = params.value.split(',')
                return (
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', gap: '16px' }}>
                        <Avatar src={val[1]}></Avatar>
                        <Typography sx={{ alignSelf: 'center' }}>{val[0]}</Typography>
                    </Box>)
            },
        },
        {
            field: 'role', headerName: 'Role', width: 280, align: 'left', headerAlign: 'left', type: 'singleSelect', valueOptions: ['owner', 'admin', 'member'],
            renderCell: ((param: GridRenderCellParams<UserFetch, string>) => param.value!.charAt(0).toUpperCase() + param.value!.slice(1)),
            sortComparator: roleSortComparator,
            editable: true,

        },
        { field: 'email', headerName: 'Email', width: 280, align: 'left', headerAlign: 'left', type: 'string' },
        {
            field: 'actions', headerName: 'Actions', width: 280, align: 'left', headerAlign: 'left', type: 'actions',
            getActions: ({ id }) => {
                const handleEditClick = (id: GridRowId) => () => {
                    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
                };

                const handleSaveClick = (id: GridRowId) => () => {
                    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
                }

                const handleDeleteClick = (id: GridRowId) => async () => {
                    setRows(rows.filter((row) => row.id !== id))
                    // await supabase.from('users_organizations')
                    //     .delete()
                    //     .eq('user_id', session!.user.id)
                    //     .eq('organization_id', orgProps.id)
                    // setRefresh(prev => !prev)
                }

                const handleCancelClick = (id: GridRowId) => () => {
                    setRowModesModel({
                        ...rowModesModel,
                        [id]: { mode: GridRowModes.View, ignoreModifications: true },
                    });
                }


                // const isDisabled = roles.indexOf(userRole) < roles.indexOf(params.row.role)
                //     || userId === params.row.id

                const acceptPendingUser = async () => {
                    await supabase.from("users_organizations")
                        .update({ role: 'member' })
                        .then(res => { if (res.error) { console.log(res.error.message) } })
                }

                const rejectPendingUser = async () => {
                    await supabase.from("users_organizations")
                        .delete()
                        .eq('user_id', session!.user.id)
                        .eq('organization_id', orgProps.id)
                }

                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveAltIcon />}
                            label='save'
                            // @ts-expect-error
                            color='info'
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label='save'
                            // @ts-expect-error
                            color='info'
                            onClick={handleSaveClick(id)}
                        />,
                    ]
                }
                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label='save'
                        // @ts-expect-error
                        color='info'
                        onClick={handleEditClick(id)}
                    />,
                ]
            }
        },
    ]

    const fetchUsers = async () => {
        await supabase.from('users_organizations')
            .select('user_id, role')
            .eq('organization_id', orgProps.id)
            .then(res => {
                if (res.error) {
                    console.log(res.error.message)
                    return null
                }
                const promises = res.data.map(async user => {
                    const { data, error } = await supabase.from("Users")
                        .select('user_id, name, image_file, email')
                        .eq('user_id', user.user_id)
                        .single()

                    if (error) {
                        console.log(error.message)
                        return null
                    }

                    var imageURL = ''
                    if (data.image_file) {
                        const { data: img, error: e } = await supabase.storage.from('profile-images')
                            .download(data.image_file)

                        if (e) { console.log(e.message) }
                        else { imageURL = URL.createObjectURL(img) }
                    }
                    const result = { id: user.user_id, name: data.name, role: user.role as UserRoles, image_file: imageURL, email: data.email }
                    return result
                })

                Promise.all(promises).then(data => {
                    if (data) {
                        setRows(data.filter(d => !!d))
                        setLoading(false)
                    }
                })
            })

    }

    const [refresh, setRefresh] = useState<boolean>(true)
    useEffect(() => {
        fetchUsers()
    }, [refresh])

    useEffect(() => {
        setTitle(orgProps.name + " Users")
    }, [])

    return (
        loading
            ? <Loading></Loading>
            : <Box>
                <UserTable orgProps={orgProps} users={rows} columns={columns} processRowUpdate={processRowUpdate}
                    handleRowEditStop={handleRowEditStop} rowModesModel={rowModesModel} setRowModesModel={setRowModesModel} />

                <div hidden={!(orgProps.role === 'owner' || orgProps.role === 'admin')}>
                    <Button variant='contained' onClick={() => setAddUserTrigger(true)}>Add user</Button>
                    <AddUserPopup trigger={addUserTrigger} closePopup={() => { setAddUserTrigger(false) }} setRefresh={setRefresh} />
                </div>
            </Box>
    )
}

interface UserTableProps {
    orgProps: OrgProps
    users: GridRowsProp<UserFetch>
    columns: GridColDef[]
    processRowUpdate: (newRow: GridRowModel<UserFetch>) => UserFetch
    handleRowEditStop: GridEventListener<'rowEditStop'>
    rowModesModel: GridRowModesModel
    setRowModesModel: React.Dispatch<SetStateAction<GridRowModesModel>>
}

function UserTable({ orgProps, users, columns, processRowUpdate, handleRowEditStop, rowModesModel, setRowModesModel }: UserTableProps) {
    const rows = users.map(user => {
        return { ...user, name: user.name + ',' + user.image_file }
    })
    return (
        <>
            {<DataGrid
                columns={columns}
                rows={rows}
                editMode="row"
                getRowId={(row: UserFetch) => row.id}
                getRowHeight={() => 'auto'}
                rowModesModel={rowModesModel}
                onRowModesModelChange={newRowMode => setRowModesModel(newRowMode)}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                initialState={{
                    sorting: {
                        sortModel: [{ field: 'role', sort: 'desc' }]
                    }
                }}
            >

            </DataGrid>}
        </>
    )
}