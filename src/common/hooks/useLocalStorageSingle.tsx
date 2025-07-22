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
        fetchValue()
            .then(data => (setValue(data), console.log(key)))
    }

    useEffect(() => {
        // Setting data in local storage
        if (value) localStorage.setItem(key, JSON.stringify(value))
        else localStorage.removeItem(key)
    }, [value, key])


    return { value, setValue }
}