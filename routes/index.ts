// Main Routing Traffic - Import CRUD Methods from their respective files, to export as nested functions.
import postRoutes from "./post_routes";
import getRoutes from "./get_routes";
import putRoutes from "./put_routes";
import delRoutes from "./del_routes";

// Import type.
import {Express} from "express";

// Export used types for routing.
export interface note {
    Title: string,
    Note: string,
    Date: string,
    Time: string,
    ['Note ID']: number,
    Done: boolean
}

export interface noteUpdate {
    ['$set']: updateData
}
interface updateData {
    Title: string,
    Note: string,
    ['Last Updated']: string
}

// Exports each function as a single function to be exported.
export default (app:Express, db:object) => {
    postRoutes(app, db);
    getRoutes(app, db);
    putRoutes(app, db);
    delRoutes(app, db);
}