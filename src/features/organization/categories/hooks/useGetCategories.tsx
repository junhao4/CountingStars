import { useEffect, useState } from "react"
import { useAlertContext } from "../../../../common/contexts/AlertContext"
import { deleteCategory, addCategory, fetchCategories } from "../api/CategoriesApi"
import { useOrgContext, type ValidOrg } from "../../../../common/contexts/OrgContext"

interface CategoryFetch {
    id: number,
    name: string,
    quantity: number,
}

export default function useGetCategories() {
    const { org } = useOrgContext() as ValidOrg
    const { createAlert } = useAlertContext()

    const [categories, setCategories] = useState<CategoryFetch[]>([])
    const [loading, setLoading] = useState(true)

    const handleDeleteCategory = (categoryId: number) => async () => {
        const res = await deleteCategory(categoryId)
        if (res) {
            setCategories(categories.filter(cat => cat.id !== categoryId))
            createAlert("success", "Successfully deleted category!")
        } else {
            createAlert("error", "Failed to delete category")
        }
    }

    const handleAddCategory = (newName: string) => async () => {
        if (newName === '') {
            createAlert('error', "Name cannot be empty!")
            return
        }
        
        if (categories.find(cat => cat.name === newName)) {
            createAlert('warning', "Duplicate category name!")
            return
        }

        const res = await addCategory(org.id, newName)
        if (res) {
            setCategories([...categories, ...res])
            createAlert("success", "Successfully added category!")
        } else {
            createAlert("error", "Failed to add category")
        }
    }

    useEffect(() => {
        fetchCategories(org.id)
            .then(data => setCategories(data))
            .then(() => setLoading(false))
    }, [])

    return { loading, categories, setCategories, handleAddCategory, handleDeleteCategory}
}