export const validateImageFile = (file: File) => {
    // Check that image size is < 2MB, type is correct
    if (!(file.type === "image/jpeg" || file.type === "image/png")) {
        alert("File type not accepted!");
        return false;
    }

    if (file.size > 2097152) {
        alert("Image size must be <= 2MB!");
        return false;
    }
    
    return true
}

export const generateFileName = (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    return fileName
}