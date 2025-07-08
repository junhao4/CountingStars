import { useEffect } from "react";
import { usePageTitleContext } from "../../common/contexts/PageTitleContext";
import Dashboard from "../../features/dashboard/components/Dashboard";


export default function DashboardPage() {
    const { setTitle } = usePageTitleContext()
    useEffect(() => {
        setTitle("Dashboard");
    }, [])

    return (
        <Dashboard />
    )
}