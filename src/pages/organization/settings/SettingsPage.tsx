import { Button, styled, Container, Stack, TextField, Typography } from "@mui/material";
import supabase from "../../../helper/supabaseClient";
import { useOrgContext, type ValidOrg } from "../../../common/contexts/OrgContext";
import { useAlertContext } from "../../../common/contexts/AlertContext";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { usePageTitleContext } from "../../../common/contexts/PageTitleContext";
import { deleteOrganization, fetchOrganizationImage, updateOrganizationImage, updateOrganizationName } from "../../../features/organization/settings/api/SettingsApi";
import { useNavigate } from "react-router-dom";
import { useSessionContext, type ValidSession } from "../../../common/contexts/SessionContext";
import { hasPermission } from "../../../helper/RolePermissions";
import type { UserOrganization } from "../../../helper/types";

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

export default function SettingsPage() {
    const { org, setOrg } = useOrgContext() as ValidOrg
    const { createAlert } = useAlertContext();
    const navigate = useNavigate()

    const [inputName, setInputName] = useState(org.name);
    const [imageFile, setImageFile] = useState("");
    const [img, setImg] = useState<string>();
    const { setTitle } = usePageTitleContext();
    const { user } = useSessionContext() as ValidSession
    const userWithOrganization = { userId: user.id, role: org.role, organizationId: org.id } as UserOrganization

    const onDeleteOrganization = async () => {
        if (!hasPermission(userWithOrganization, "organization", "delete")) {
            createAlert("error", "Only owners can delete organization")
            return
        }
        const success = await deleteOrganization(org.id)
        if (success) {
            createAlert("success", "Successfully deleted organization!");
            navigate('/dashboard')
        }
    }

    const onUpdateOrganizationName = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const success = await updateOrganizationName(inputName, org.id, createAlert)
        if (success) {
            setOrg({ ...org, name: inputName })
        }
    }

    const onUpdateOrganizationImage = async (e: ChangeEvent<HTMLInputElement>) => {
        const data = await updateOrganizationImage(org.id, e.target.files, imageFile, createAlert)
        if (data) setImageFile(data)
    }

    useEffect(() => {
        setTitle("Settings")
        
    })

    useEffect(() => {
        fetchOrganizationImage(org.id)
            .then(data => data && setImageFile(data))
        console.log("fetcting", imageFile)
        if (!hasPermission(userWithOrganization, "organization", "update")) {
            createAlert("info", "Members cannot edit organization settings")
        }
    }, [])

    useEffect(() => {
        if (imageFile === "") return
        const downloadImage = async () => {
            const { data, error } = await supabase.storage
                .from("organization-images")
                .download(imageFile);

            if (error) {
                createAlert('error', "Error downloading image: " + error.message);
            } else {
                const url = URL.createObjectURL(data);
                setImg(url);
            }
        };

        downloadImage();
    }, [imageFile]);

    return (
        <>
            <Container maxWidth="xl" sx={{ mt: 4 }}>
                <Stack spacing={3} alignItems="center">
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 600,
                            mt: 2,
                            mb: 1,
                            color: "text.primary",
                        }}
                    >
                        {org.name}
                    </Typography>
                    <img src={img} width={400} height={400}></img>
                    <form onSubmit={onUpdateOrganizationName}>
                        <Stack
                            spacing={2}
                            alignItems="center"
                            sx={{ mx: "auto", width: "300px" }}
                        >
                            <TextField
                                label="Organization Name"
                                value={inputName ?? ""}
                                onChange={(e) => setInputName(e.target.value)}
                                fullWidth
                                disabled={!hasPermission(userWithOrganization, "organization", "update")}
                            />
                            <Button type="submit" variant="contained" fullWidth 
                            disabled={!hasPermission(userWithOrganization, "organization", "update")}>
                                Save
                            </Button>

                            <Button
                                component="label"
                                color='secondary'
                                variant="outlined"
                                startIcon={<CloudUploadIcon />}
                                fullWidth
                            >
                                Upload Image (.jpg or .png, &lt; 2MB)
                                <VisuallyHiddenInput
                                    type="file"
                                    onChange={onUpdateOrganizationImage}
                                    disabled={!hasPermission(userWithOrganization, "organization", "update")}
                                />
                            </Button>
                        </Stack>
                    </form>

                    <Button color='error' variant="contained" onClick={onDeleteOrganization} 
                    disabled={!hasPermission(userWithOrganization, "organization", "delete")}>Delete organization</Button>
                </Stack>
            </Container>
        </>
    );
}
