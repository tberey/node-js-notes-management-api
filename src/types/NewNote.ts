// Export used types for routing.
export interface NewNote {
    Title: string,
    Note: string,
    Date: string,
    Time: string,
    ['Note ID']: number,
    Done: boolean
}