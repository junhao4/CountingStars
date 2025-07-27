import { MenuItem, Select } from "@mui/material";
import type { Action, UploadItem } from "../components/AddItem";
import Loading from "../../../../common/components/Loading";
import { useState } from "react";
import useGetFolderDirectory from "../hooks/useGetFolderDirectory";

interface FolderSelectProps {
    state: UploadItem,
    dispatch: React.ActionDispatch<[action: Action]>,
}



export function FolderSelect({state, dispatch}: FolderSelectProps) {

    const [open, setOpen] = useState(false)

    const { loading, folders } = useGetFolderDirectory()

    if (loading) {
        return (<Loading />)
    }

    return (
        <div style={{display:'flex', alignItems:'center', width: '40%'}}>
            <p>Select Folder:&ensp;</p>
            <Select value={folders.find(folder => folder.id === state.folderId)?.name || "ROOT"} open={open} onOpen={() => setOpen(true)}
                onClose={e => (e.currentTarget.tagName === "DIV" && setOpen(false))}
                sx={{flexGrow:1}}>
                {[
                    <MenuItem key={"ROOT"} value={"ROOT"}
                        onClick={() => dispatch({type:'SET_FOLDERID', value: folders.find(folder => folder.id === state.folderId)?.parentId || null})}
                        sx={{ display: state.folderId === null ? 'none' : 'block' }}><p>{state.folderId === null ? "Root" : '..'}</p></MenuItem>,
                    folders.map(folder => {
                        return <MenuItem key={folder.id} value={folder.name}
                            onClick={() => dispatch({type:"SET_FOLDERID", value: folder.id})}
                            sx={{ display: state.folderId === folder.parentId ? "block" : 'none' }}>
                            {folder.name}
                        </MenuItem>
                    })
                ]}
            </Select>
        </div>
    )
}