import { Chip, ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper } from "@mui/material";
import type { Category } from "../../../../helper/types";
import { useRef, useState } from "react";
import useGetCategoryList from "../hooks/useGetCategoryList";

interface CategoryChipsProps {
    categories: Category[]
    selected: number[]
    editMode: boolean
    handleRemove: (categoryId: number) => () => void
    handleAdd: (categoryId: number, categoryName: string) => () => void
}

export default function CategoryChips({ categories, selected, editMode, handleRemove, handleAdd }: CategoryChipsProps) {
    const { categoryList } = useGetCategoryList()
    const [categoryMenuOpen, setCategoryMenuOpen] = useState(false)

    const anchorRef = useRef<HTMLDivElement>(null)

    const handleClose = (event: Event | React.SyntheticEvent) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)
        ) { return }
        setCategoryMenuOpen(false);
    };

    return (
        <div style={{display:'flex', gap:'0.5rem', flexWrap:'wrap', maxWidth:'17vw'}}>
            {categories.map(cat => {
                return <Chip key={cat.id} label={cat.name} onClick={() => {}}
                    {...editMode ? { onDelete: handleRemove(cat.id) } : {}}></Chip>
            })}

            <Chip key={0} label={"+"} ref={anchorRef} disabled={!editMode}
                onClick={() => setCategoryMenuOpen(prev => !prev)} />

            <Popper
                open={categoryMenuOpen}
                anchorEl={anchorRef.current}
                placement="bottom-start"
                role={undefined}
                transition>
                {({ TransitionProps, placement }) => (
                    <Grow {...TransitionProps}
                        style={{
                            transformOrigin:
                                placement === 'bottom-start' ? 'left top' : 'left bottom',
                        }}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList
                                    autoFocusItem={categoryMenuOpen}>
                                    {categoryList.map((cat, index) => {
                                        const isSelected = selected.includes(cat.id)
                                        return (<MenuItem key={index} selected={isSelected}
                                            onClick={isSelected ? handleRemove(cat.id) : handleAdd(cat.id, cat.name)}
                                            >{cat.name}</MenuItem>)
                                    })}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </div>
    )
}