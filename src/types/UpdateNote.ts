// Export used types for routing.
export interface UpdateNote {
    ['$set']: updateData
}
interface updateData {
    Title: string,
    Note: string,
    ['Last Updated']: string
}