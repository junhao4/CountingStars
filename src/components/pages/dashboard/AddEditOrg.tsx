import { styled } from '@mui/material/styles';
import type { OrganizationFetch } from './Dashboard';
import AddOrgPopup from './AddOrgPopup';
import EditOrgPopup from './EditOrgPopup';

export interface AddEditOrgProps {
    trigger: boolean
    closePopup: () => void
    setRefresh: (func0: (arg0:boolean) => boolean) => void
    refresh: boolean
    add: boolean
    org: OrganizationFetch | null
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
