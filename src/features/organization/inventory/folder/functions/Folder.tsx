export const validateAddFolderName = (folderName: string) => {
    if (folderName === "") {
        return {data: false, error: "Empty Folder Name"} as const
    }
    return {data: true, error: null} as const
}

export const validateMoveIntoFolder = (moveItem: string, folderId: number | null) => {
    const item = moveItem.split(',')

    // Do not move folder into itself
    if (item[0] === 'folder' && parseInt(item[1]) === folderId) {
        return {data: false, error: "Same folder objects"} as const
    }

    return {data: true, error: null} as const
}