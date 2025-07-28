import { useEffect } from "react";
import { usePageTitleContext } from "../../common/contexts/PageTitleContext";
import { useSessionContext } from "../../common/contexts/SessionContext";
import Profile from "../../features/profile/components/Profile";


export default function ProfilePage() {
    const { session, user } = useSessionContext()
    if (session === null || user === null) {
        throw new Error("")
    }

    //Set header title to Login
    const { setTitle } = usePageTitleContext();

    useEffect(() => {
        setTitle("Profile");
    }, []);

    return (
        <Profile />
    );
}