import { Button, styled, Container, Stack, TextField, Typography } from "@mui/material";
import supabase from "../../../helper/supabaseClient";
import { useOrgContext } from "../../../common/contexts/OrgContext";
import { useAlertContext } from "../../../common/contexts/AlertContext";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { usePageTitleContext } from "../../../common/contexts/PageTitleContext";
import { deleteOrganization, fetchOrganizationImage, updateOrganizationImage, updateOrganizationName } from "../../../features/organization/settings/api/SettingsApi";
import { useNavigate } from "react-router-dom";

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
    const { getOrgContext, setOrgContext } = useOrgContext();
    const orgProps = getOrgContext()!;
    const { createAlert } = useAlertContext();
    const navigate = useNavigate()

    const [inputName, setInputName] = useState(orgProps.name);
    const [imageFile, setImageFile] = useState("");
    const [img, setImg] = useState<string>();
    const { setTitle } = usePageTitleContext();

    const onDeleteOrganization = async () => {
        const success = await deleteOrganization(orgProps.id)
        if (success) {
            createAlert("success", "Successfully deleted organization!");
            navigate('/dashboard')
        }
    }

    const onUpdateOrganizationName = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const success = await updateOrganizationName(inputName, orgProps.id, createAlert)
        if (success) {
            setOrgContext({ ...orgProps, name: inputName })
        }
    }

    const onUpdateOrganizationImage = async (e: ChangeEvent<HTMLInputElement>) => {
        const data = await updateOrganizationImage(orgProps.id, e.target.files, imageFile, createAlert)
        if (data) setImageFile(data)
    }

    useEffect(() => {
        setTitle("Settings")
    })

    useEffect(() => {
        fetchOrganizationImage(orgProps.id)
            .then(data => data && setImageFile(data))
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
                        {orgProps.name}
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
                            />
                            <Button type="submit" variant="contained" fullWidth>
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
                                />
                            </Button>
                        </Stack>
                    </form>

                    <Button color='error' variant="contained" onClick={onDeleteOrganization}>Delete organization</Button>
                </Stack>
            </Container>
        </>
    );
}
