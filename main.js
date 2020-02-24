/*
Notes:
---------------------------------------------------------------------------

'npm run dev' to run & start watching for changes to the scripts/files.

Add a way to find id's/store/send to whom add notes.

Use object note project as bassline for front and back-end connection - Use the object note building to submit a post request for example.
*/

// Global Dependancies.
const express = require('express'); // Framework.
const bodyParser = require('body-parser'); // Parse incoming request body for middleware.
const MongoClient = require('mongodb').MongoClient; // Database client (mongodb).
var db = require('./config/db'); // Setup database connection infrastructure, by importing url here.

let test = {name:"test",number:1};

// Global Variables
const app = express(); // Init instance of express framework.
const port = 8080; // Set Port connection for server. http://localhost:8080/
app.use(bodyParser.urlencoded({ extended: true })); // Parse url encoded data. I.e. make url encoded readable in middleware.

// Connect to database, which CRUD operation performed against. (Part of database connection infrastructure).
MongoClient.connect(db.url, { useUnifiedTopology: true }, (err, client) => {
    
    db = client.db('NotesDB'); // Setup database infrastructure, by connecting to specific db collection.

    if (err) return console.log(err); // Error checking in the db connection.

    // Run server and listen for the completed connection.
    app.listen(port, () => {
        console.log('Running on Port: '+ port); // Informative only: Server init success.
    });

    // GET Request, to close db connection, and end all opertaions.
    app.get("/db/close", (req, res) => {
        client.close(true) // Close connection to db, using force (by passing true).
        res.json('Closed DB Connection - CRUD operations no longer available, until reconnection.');
    });

    // Import routing files, to perform all CRUD operations on db.
    require("./routes")(app, db, test); // Imported as funcs().
});