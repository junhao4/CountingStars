import { useEffect, useMemo, useState } from "react";
import { fetchItemImage, setDefaultItemImage, updateItemImage } from "../api/ItemApi";
import type { ItemImage } from "../../../../helper/types";
import { useAlertContext } from "../../../../common/contexts/AlertContext";


export default function useGetItemImage(itemId: number) {
    const { createAlert } = useAlertContext()

    const [loading, setLoading] = useState(true)
    const [image, setImage] = useState<ItemImage>()

    useEffect(() => {
        fetchItemImage(itemId).then(data => {
            if (data) {
                setImage({id: itemId, imageFile: data.imageFile, imageBlobUrl: URL.createObjectURL(data.imageBlob)})
            }
            setLoading(false)
        })
    }, [])

    const handleSetImage = async (file: FileList) => {
        if (!file[0]) {
            createAlert('info', "No file selected")
            return 
        }
        const res = await updateItemImage(itemId, image!.imageFile, file[0])
        if (res) {
            setImage({id: itemId, imageFile: file[0].name, imageBlobUrl: URL.createObjectURL(file[0])})
            createAlert('success', "Successfully updated item image!")
        } else {
            createAlert("error", "Something went wrong.")
        }
    }

    const handleRemoveImage = async () => {
        if (image!.imageFile === "default_item.jpg") {
            return
        }

        const res = await setDefaultItemImage(itemId, image!.imageFile)
        if (res) {
            setImage({id: itemId, imageFile: 'default_image.jpg', imageBlobUrl: URL.createObjectURL(res)})
            createAlert('success', "Successfully updated item image!")
        } else {
            createAlert('error', "Something went wrong.")
        }
    }

    return { loading, image, setImage:handleSetImage, removeImage:handleRemoveImage }
}