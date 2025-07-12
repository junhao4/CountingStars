import { Chip, ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper } from "@mui/material";
import type { Category } from "../../../../helper/types";
import { useEffect, useRef, useState } from "react";
import useGetCategoryList from "../../inventory/hooks/useGetCategoryList";

interface CategoryChipsProps {
    categories: Category[]
    editMode: boolean
    handleDelete: (categoryId: number) => () => void
    handleAdd: (categoryId: number, categoryName: string) => () => void
}

export default function CategoryChips({ categories, editMode, handleDelete, handleAdd }: CategoryChipsProps) {
    const { categoryList } = useGetCategoryList()
    const [categoryMenuOpen, setCategoryMenuOpen] = useState(false)

    const anchorRef = useRef<HTMLDivElement>(null)

    const handleClose = (event: Event | React.SyntheticEvent) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)
        ) { return }
        setCategoryMenuOpen(false);
    };

    // useEffect to re-render (close) the anchorEl as otherwise the menu teleports to top-left of screen.
    useEffect(() => {
        setCategoryMenuOpen(prev => prev ? false : false)
    }, [categories.length])

    return (
        <div style={{display:'flex', gap:'0.5rem', flexWrap:'wrap', maxWidth:'17vw'}}>
            {categories.map(cat => {
                return <Chip key={cat.id} label={cat.name}
                    {...editMode ? { onDelete: handleDelete(cat.id) } : {}}></Chip>
            })}

            <Chip key={categories.length} label={"+"} ref={anchorRef} disabled={!editMode}
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
                                        return (<MenuItem key={index}
                                            onClick={handleAdd(cat.id, cat.name)}>{cat.name}</MenuItem>)
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