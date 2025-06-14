import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import { useOrgContext } from "../../contexts/OrgContext";
import { useEffect, useMemo, useState } from "react";
import supabase from "../../../helper/supabaseClient";
import { Avatar, Box, Typography } from "@mui/material";
import { usePageTitleContext } from "../../contexts/PageTitleContext";

interface UserFetch {
    id: string,
    name: string | null,
    role: string,
    image_file: string,
    email: string | null,
}

export default function OrgUsers() {
    const { getOrgContext } = useOrgContext(); const orgProps = getOrgContext()!
    const { setTitle } = usePageTitleContext()

    const [users, setUsers] = useState<UserFetch[]>([])
    const [loading, setLoading] = useState<boolean>(true)

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
                    <Box sx={{display:'flex', flexDirection:'row', justifyContent:'left', gap:'16px'}}>
                        <Avatar src={val[1]}></Avatar>
                        <Typography sx={{alignSelf:'center'}}>{val[0]}</Typography>
                    </Box>)
            },
        },
        { field: 'role', headerName: 'Role', width: 280, align: 'left', headerAlign: 'left', type: 'string', 
            renderCell: ((param: GridRenderCellParams<any, string>) => param.value!.charAt(0).toUpperCase() + param.value!.slice(1))
        },
        { field: 'email', headerName: 'Email', width: 280, align: 'left', headerAlign: 'left', type: 'string' },
    ]

    const fetchUsers = async () => {
        setUsers(() => [])
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

                    return { id: user.user_id, name: data.name, role: user.role, image_file: imageURL, email: data.email }
                })

                Promise.all(promises).then(data => {
                    if (data) { 
                        setUsers(data.filter(d => !!d))
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
    })

    return (
        loading
            ? <>Loading...</>
            : <>
                {
                    ['owner', 'admin'].includes(orgProps!.role)
                        ? ModifyUsers(users, columns)
                        : ViewUsers(users, columns)
                }
            </>
    )
}

function ViewUsers(users: UserFetch[], columns: GridColDef[]) {
    const rows = users.map(user => {
        return { ...user, name: user.name + ',' + user.image_file }
    })
    return (
        <>
            {<DataGrid
                columns={columns}
                rows={rows}
                getRowId={(row) => row.id}
                getRowHeight={() => 'auto'}
            >

            </DataGrid>}
        </>
    )
}

function ModifyUsers(users: UserFetch[], columns: GridColDef[]) {
    const rows = users.map(user => {
        return { ...user, name: user.name + ',' + user.image_file }
    })
    return (
        <>
            {<DataGrid
                columns={columns}
                rows={rows}
                getRowId={(row) => row.id}
                getRowHeight={() => 'auto'}
            >

            </DataGrid>}
        </>
    )
}