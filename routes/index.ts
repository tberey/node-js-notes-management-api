// Main Routing Traffic - Import CRUD Methods from their respective files, to export as nested functions.
import postRoutes from "./post_routes";
import getRoutes from "./get_routes";
import putRoutes from "./put_routes";
import delRoutes from "./del_routes";

// Exports each function as a single function to be exported.
export default (app:object, db:object) => {
    postRoutes(app, db);
    getRoutes(app, db);
    putRoutes(app, db);
    delRoutes(app, db);
}