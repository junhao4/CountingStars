import { styled } from '@mui/material/styles';
import type { DashboardOrgFetch } from './Dashboard';
import AddOrgPopup from './AddOrgPopup';
import EditOrgPopup from './EditOrgPopup';
import type { SetStateAction } from 'react';

export interface AddEditOrgProps {
    trigger: boolean
    closePopup: () => void
    setRefresh: React.Dispatch<SetStateAction<boolean>>
    refresh: boolean
    add: boolean
    org: DashboardOrgFetch | null
    setAdd: (add: boolean) => void
    imgUrl: string
}

export const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function AddEditOrg({ trigger, closePopup, setRefresh, refresh, add, org, setAdd, imgUrl }: AddEditOrgProps) {
    if (add == true) {
        return <AddOrgPopup trigger={trigger} closePopup={closePopup} setRefresh={setRefresh} refresh={refresh} add={add} org={org} setAdd={setAdd} imgUrl=''/>
    } else {
        return <EditOrgPopup trigger={trigger} closePopup={closePopup} setRefresh={setRefresh} refresh={refresh} add={add} org={org} setAdd={setAdd} imgUrl={imgUrl}/>
    }
}
