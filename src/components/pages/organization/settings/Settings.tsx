import {
  Button,
  Card,
  CardMedia,
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
  const [inputName, setInputName] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [img, setImg] = useState("");
  const { session } = useSessionContext();
  const [message, setMessage] = useState("");
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
          createMessage("failure", res.error.message);
        } else {
          createMessage("success", "Successfully deleted organization!");
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
    console.log("org", org);
    console.log("inputName", inputName)
    console.log("name", name)
    if (inputName !== name && org?.length !== 0) {
      alert(
        "You already have an organization with the same name. Please choose another name."
      );
      return;
    }

    const { data, error } = await supabase
      .from("Organizations")
      .update({ name: inputName })
      .eq("id", orgProps.id)
      .select();

    if (data) {
      createMessage("success", inputName + " set as organization's name");
      setName(inputName);
      setTitle(inputName)
      setOrgContext( {
        id: orgProps.id,
        name: data[0].name,
        role: orgProps.role
      })
      console.log(orgProps.name)
    } else {
      createMessage("failure", "error");
      console.log(error);
    }
  };

  //Update org image
  const updateImage = async (e: ChangeEvent<HTMLInputElement>) => {
    console.log("Updating image");

    if (!e.target.files || e.target.files.length === 0) {
      createMessage("failure", "You must select an image to upload.");
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
    console.log("File", file.name, file.size, file.type);
    const { error } = await supabase.storage
      .from("organization-images")
      .upload(fileName, file);
    if (error) {
      alert("upload error");
      console.log(error.message);
      return;
    } else {
      console.log("uploaded img");

      await supabase
        .from("Organizations")
        .update({ image_file: fileName })
        .eq("id", orgProps.id)
        .then((res) => console.log(res.error));

      setImgUrl(fileName);
      createMessage("success", "Organization image updated")
    }
  };

  const getOrg = async () => {
    const { data, error } = await supabase
      .from("Organizations")
      .select()
      .eq("id", orgProps.id)
      .single();

    if (data) {
      setName(data.name);
      if (data.image_file === null) {
        setImgUrl('Stock Background.jpg')
      } else {
      setImgUrl(data.image_file!);
      }
    } else {
      console.log("Error selecting org");
    }
  };

  useEffect(() => {
    getOrg();
  }, [session]);

  useEffect(() => {
    const downloadImage = async () => {
      const { data, error } = await supabase.storage
        .from("organization-images")
        .download(imgUrl!);
      if (error) {
        console.error("Error downloading image:", error.message);
      } else {
        const url = URL.createObjectURL(data);
        setImg(url);
      }
    };

    downloadImage();
  }, [imgUrl]);

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
          <Card sx={{ width: "400px" }}>
            <CardMedia sx={{ height: "300px" }} image={img} />
          </Card>
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
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                fullWidth
              >
                Upload Image (.jpg or .png, &lt; 2MB)
                <VisuallyHiddenInput type="file" onChange={updateImage} />
              </Button>
            </Stack>
          </form>


          <Button onClick={handleDelete}>Delete organization</Button>
        </Stack>
      </Container>
    </>
  );
}
