import { createContext, useContext, useEffect, useState } from "react"
import { downloadProfileImage, fetchProfileImage } from "../api/UserApi"
import { useSessionContext } from "./SessionContext"

export interface ProfileProps {
    fileName: string | undefined
    blobUrl: string | undefined
    setFileName: (arg0: string) => void
}


export const ProfileContext =
    createContext<ProfileProps>({
        fileName: undefined,
        blobUrl: undefined,
        setFileName: () => null,
    })


export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useSessionContext()
    const [fileName, setFileName] = useState<string>()
    const [blobUrl, setBlobUrl] = useState<string>()

    useEffect(() => {
        user ? fetchProfileImage(user.id)
            .then(data => setFileName(data || "Default_pfp.jpg"))
            : setFileName(undefined)
    }, [user])

    useEffect(() => {
        fileName
            ? downloadProfileImage(fileName)
                .then(data => data && setBlobUrl(URL.createObjectURL(data)))
            : setBlobUrl(undefined)
    }, [fileName])

    return (
        <ProfileContext.Provider value={{ fileName, blobUrl, setFileName }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfileContext = () => useContext(ProfileContext);


