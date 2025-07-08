import { useEffect, useState } from "react"

function getSavedValue<T>(key: string): T[] {
    const value = localStorage.getItem(key)
    if (value) return JSON.parse(value)
    else return []
}

export default function useLocalStorage<T>(key: string, fetchValue?: (() => Promise<T[]>)) {
    const isSet = localStorage.getItem(key)

    const [value, setValue] = useState<T[]>(() => {
        // Getting data from local storage
        return getSavedValue(key)
    })

    if (!isSet && fetchValue) {
        new Promise(async () => {
            const data = await fetchValue()
            if (data) setValue(data)
        })
    }

    useEffect(() => {
        // Setting data in local storage
        if (value) localStorage.setItem(key, JSON.stringify(value))
    }, [value, key])


    return { value, setValue }
}