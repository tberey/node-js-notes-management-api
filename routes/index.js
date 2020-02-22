//Main Routing Traffic - Import CRUD Methods from their respective files, to export as nested functions.
const postRoutes = require("./post_routes");
const getRoutes = require("./get_routes");
const putRoutes = require("./put_routes");
const delRoutes = require("./del_routes");

module.exports = (app, db) => {
    postRoutes(app, db);
    getRoutes(app, db);
    putRoutes(app, db);
    delRoutes(app, db);

}

