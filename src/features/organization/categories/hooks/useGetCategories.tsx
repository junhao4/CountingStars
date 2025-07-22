import { useEffect, useState } from "react"
import { useAlertContext } from "../../../../common/contexts/AlertContext"
import { deleteCategory, addCategory, fetchCategories } from "../api/CategoriesApi"
import { useOrgContext, type ValidOrg } from "../../../../common/contexts/OrgContext"
import { handleGenerateAlert } from "../../../../common/functions/ErrorAlerts"

interface CategoryFetch {
    id: number,
    name: string,
    quantity: number,
}

export const validateCategoryName = (name: string, categoryList: CategoryFetch[]) => {
    if (name === "") {
        return "emptyName"
    } else if (categoryList.find(cat => cat.name === name)) {
        return "duplicateName"
    }
    return true
}

const validateCategoryId = (id: number, categoryList: CategoryFetch[]) => {
    if (categoryList.find(cat => cat.id === id)) {
        return true
    } else {
        return "emptyName"
    }
}

export default function useGetCategories() {
    const { org } = useOrgContext() as ValidOrg
    const { createAlert } = useAlertContext()

    const [categories, setCategories] = useState<CategoryFetch[]>([])
    const [loading, setLoading] = useState(true)

    const handleDeleteCategory = (categoryId: number) => async () => {
        if (validateCategoryId(categoryId, categories) === "emptyName") {
            handleGenerateAlert("emptyName", createAlert)
            return
        }

        const res = await deleteCategory(categoryId)
        if (typeof res === 'string') {
            handleGenerateAlert(res, createAlert)
            return
        }

        setCategories(categories.filter(cat => cat.id !== categoryId))
        createAlert("success", "Successfully deleted category!")
    }

    const handleAddCategory = (newName: string) => async () => {
        const valid = validateCategoryName(newName, categories)
        if (typeof valid === 'string') {
            handleGenerateAlert(valid, createAlert)
            return
        }

        const res = await addCategory(org.id, newName)
        if (typeof res === 'string') {
            handleGenerateAlert(res, createAlert)
            return
        }

        setCategories([...categories, ...res])
        createAlert("success", "Successfully added category!")

    }

    useEffect(() => {
        fetchCategories(org.id)
            .then(data => setCategories(data))
            .then(() => setLoading(false))
    }, [])

    return { loading, categories, setCategories, handleAddCategory, handleDeleteCategory }
}