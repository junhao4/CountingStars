import {
    Button,
    styled,
    Container,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import supabase from "../../../../helper/supabaseClient";
import { useOrgContext } from "../../../contexts/OrgContext";
import { useNavigate } from "react-router-dom";
import { useMessageContext } from "../../../contexts/MessageContext";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useSessionContext } from "../../../contexts/SessionContext";
import { usePageTitleContext } from "../../../contexts/PageTitleContext";

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

export default function OrgSettings() {
    const { getOrgContext } = useOrgContext();
    const orgProps = getOrgContext()!;
    const { createMessage } = useMessageContext();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [inputName, setInputName] = useState(orgProps.name);
    const [imageFile, setImageFile] = useState("");
    const [img, setImg] = useState<string>();
    const { session } = useSessionContext();
    const { setTitle } = usePageTitleContext();
    const { setOrgContext } = useOrgContext();

    //Delete Org
    const handleDelete = async () => {
        const confirm = window.confirm(
            "Are you sure you want to delete? This action is permanent!"
        );
        if (!confirm) {
            return;
        }

        await supabase
            .from("Organizations")
            .delete()
            .eq("id", orgProps.id)
            .then((res) => {
                if (res.error) {
                    createMessage("error", res.error.message);
                } else {
                    createMessage(
                        "success",
                        "Successfully deleted organization!"
                    );
                    navigate("/dashboard");
                }
            });
    };

    //Update org name
    const updateName = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Check that organization name is unique for the user
        const { data: org } = await supabase
            .from("Organizations")
            .select("id")
            .eq("name", inputName);

        if (inputName !== name && org?.length !== 0) {
            alert(
                "You already have an organization with the same name. Please choose another name."
            );
            return;
        }

        const { data } = await supabase
            .from("Organizations")
            .update({ name: inputName })
            .eq("id", orgProps.id)
            .select();

        if (data) {
            createMessage("success", inputName + " set as organization's name");
            setName(inputName);
            setOrgContext({
                id: orgProps.id,
                name: data[0].name,
                role: orgProps.role,
            });
        } else {
            createMessage("error", "could not update name");
        }
    };

    //Update org image
    const updateImage = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            createMessage("error", "You must select an image to upload.");
            return;
        }

        const file = e.target.files[0];
        // Check that image size is < 2MB, type is correct, and that organization name is not empty
        if (file.size > 2097152) {
            alert("Image size must be < 2MB!");
            return;
        }

        if (!(file.type === "image/jpeg" || file.type === "image/png")) {
            alert("File type not accepted!");
            return;
        }

        if (inputName === "") {
            alert("Organization name must not be empty!");
            return;
        }
        const fileExt = file.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const { error } = await supabase.storage
            .from("organization-images")
            .upload(fileName, file);
        if (error) {
            alert("upload error");
            console.log(error.message);
            return;
        } else {
            //remove old image from storage
            if (imageFile && imageFile !== "Stock Background.jpg") {
                const { error } = await supabase.storage
                    .from("organization-images")
                    .remove([imageFile]);

                if (error) {
                    createMessage('error', "Failed to delete old image: " + error.message);
                }
            }
            await supabase
                .from("Organizations")
                .update({ image_file: fileName })
                .eq("id", orgProps.id)
                .then((res) => { if (res.error) createMessage('error', res.error.message) });

            setImageFile(fileName);
            createMessage("success", "Organization image updated");
        }
    };

    const getOrg = async () => {
        const { data } = await supabase
            .from("Organizations")
            .select()
            .eq("id", orgProps.id)
            .single();

        if (data) {
            setName(data.name);
            if (data.image_file === null) {
                setImageFile("Stock Background.jpg");
            } else {
                setImageFile(data.image_file!);
            }
        } else {
            createMessage('error', "Error selecting org");
        }
    };

    useEffect(() => {
        getOrg();
    }, [session]);

    useEffect(() => {
        setTitle("Settings")
    })

    useEffect(() => {
        if (imageFile === "") return
        const downloadImage = async () => {
            const { data, error } = await supabase.storage
                .from("organization-images")
                .download(imageFile!);
            if (error) {
                createMessage('error', "Error downloading image: " + error.message);
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
                        {name}
                    </Typography>
                    <img src={img} width={400} height={400}></img>
                    <form onSubmit={updateName}>
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
                                    onChange={updateImage}
                                />
                            </Button>
                        </Stack>
                    </form>

                    <Button color='error' variant="contained" onClick={handleDelete}>Delete organization</Button>
                </Stack>
            </Container>
        </>
    );
}
