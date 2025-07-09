import type { CreateAlertType } from "../../../../common/contexts/AlertContext";
import supabase from "../../../../helper/supabaseClient";

export const fetchOrganizationImage = async (organizationId: number) => {
    const { data, error } = await supabase.from('Organizations')
        .select("image_file")
        .eq('id', organizationId)
        .single()

    if (error) {
        console.log(error.message)
        return null
    } else {
        return data.image_file
    }
}

//Delete Org
export const deleteOrganization = async (organizationId: number) => {
    const confirm = window.confirm(
        "Are you sure you want to delete? This action is permanent!"
    );
    if (!confirm) {
        return false;
    }

    const { data, error } = await supabase
        .from("Organizations")
        .delete()
        .eq("id", organizationId)

    if (error) {
        console.log(error.message)
        return false
    } else {
        return true
    }
};

//Update org name
export const updateOrganizationName = async (newName: string, organizationId: number, createAlert: CreateAlertType) => {
    // Check that organization name is unique for the user
    const { data: org } = await supabase
        .from("Organizations")
        .select("id")
        .eq("name", newName)
        .maybeSingle()

    if (org) {
        createAlert("warning", "You already have an organization with the same name. Please choose another name.");
        return false;
    }

    const { data } = await supabase
        .from("Organizations")
        .update({ name: newName })
        .eq("id", organizationId)
        .select();

    if (data) {
        createAlert("success", newName + " set as organization's name");
        return false
    } else {
        createAlert("error", "could not update name")
        return true
    }
};

//Update org image
export const updateOrganizationImage = async (organizationId: number, files: FileList | null,
    oldFileName: string, createAlert: CreateAlertType) => {

    if (!files || files.length === 0) {
        createAlert("error", "You must select an image to upload.");
        return;
    }

    const file = files[0];
    // Check that image size is < 2MB, type is correct, and that organization name is not empty
    if (file.size > 2097152) {
        alert("Image size must be < 2MB!");
        return;
    }

    if (!(file.type === "image/jpeg" || file.type === "image/png")) {
        alert("File type not accepted!");
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
        if (oldFileName && oldFileName !== "Stock Background.jpg") {
            const { error } = await supabase.storage
                .from("organization-images")
                .remove([oldFileName]);

            if (error) {
                createAlert('error', "Failed to delete old image: " + error.message);
            }
        }
        const { error } = await supabase
            .from("Organizations")
            .update({ image_file: fileName })
            .eq("id", organizationId)
        if (error) {
            createAlert('error', error.message)
            return
        }

        createAlert("success", "Organization image updated");
        return fileName
    }
};