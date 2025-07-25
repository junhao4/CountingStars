import { TextField } from "@mui/material"

interface SearchBarProps {
    handleSearch: (arg0: string) => void
}

export default function SearchBar({ handleSearch }: SearchBarProps) {
    return (
        <>
            <TextField 
                variant="outlined"
                placeholder={"Search Messages"}
                label={"Search Messages"} 
                sx={{ margin: '2rem 2rem 3rem 2rem' }}
                onChange={e => handleSearch(e.target.value)} />
        </>
    )
}