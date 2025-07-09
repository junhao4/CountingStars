import { useEffect, useState } from "react"

function getSavedValue<T>(key: string, initialValue: T): T {
    const value = localStorage.getItem(key)
    if (value) return JSON.parse(value)
    return initialValue
}

export default function useLocalStorageSingle<T>(key: string, initialValue: T, fetchValue?: (() => Promise<T>)) {
    const isSet = localStorage.getItem(key)

    const [value, setValue] = useState<T>(() => {
        // Getting data from local storage
        return getSavedValue(key, initialValue)
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