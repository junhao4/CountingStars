import { TextField } from "@mui/material"

interface SearchBarProps {
    handleSearch: (arg0: string) => void
}

export default function SearchBar({ handleSearch }: SearchBarProps) {
    return (
        <>
            <TextField 
                placeholder={"Search Messages"} 
                sx={{ margin: '2rem 2rem 0 2rem' }}
                onChange={e => handleSearch(e.target.value)} />
        </>
    )
}