import { useEffect, useState } from "react";
import supabase from "../../../helper/supabaseClient";
import type { User } from "@supabase/auth-js";
import { type Database, type Tables } from '../../../helper/types.ts'
import './Organizations.css'

interface OrganizationsProps {
    user: User | null
}

interface Table {
    id: string;
    organization: string | null;
}

function Organizations({ user }: OrganizationsProps) {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<Table[] | null>(null)

    useEffect(() => {
        setTimeout(async () => {

            const { data, error } = await supabase
                .from('Organizations')
                .select('*')

            console.log(error?.message)
            console.log(data)
            setLoading(false)
            setData(data)

        }, 0)
    }, [])

    return loading
        ? (<>
            <div className="organization-loading">Loading...</div>
        </>)
        : (<div className="organization-container">
            {data?.filter(index => index.organization).map((key, index) =>
                <div key={index} className="organization-component">
                    <p>{key.organization!}</p>
                    <div className="organization-component-buttons">
                        <button>Edit</button>
                        <button>Delete</button>
                    </div>
                </div>)}
        </div>)
}

export default Organizations