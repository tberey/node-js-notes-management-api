/*
Notes:
---------------------------------------------------------------------------

'npm run dev' to run & start watching for changes to the scripts/files.

Add a way to find id's/store/send to whom add notes.

USe gets to do actions through url, then find way to target query string for the information to post/put. See 'app.get('/notes/:id', (req, res) => {' for a start.

*/

// Dependancies
const express = require('express'); // framework.
const MongoClient = require('mongodb').MongoClient; // database (mongodb).
const ObjectID = require('mongodb').ObjectID; // Object ID to make requests using IDs (mongodb).
const bodyParser = require('body-parser'); // Parse incoming request body for middleware (vs-code log).
var db = require('./config/db'); // Setup database connection infrastructure, imported url.

const app = express(); // Init instance of express framework.
const port = 8080; // Set Port connection for server. http://localhost:8080/

app.use(bodyParser.urlencoded({ extended: true })); // Parse url encoded data/forms. I.e. make url encoded stuff readable, for example POST key value pair data, passed with url request.

MongoClient.connect(db.url, { useUnifiedTopology: true }, (err, client) => { // Connect to database, which CRUD operation performed against. (Part of database connection infrastructure).
    
    db = client.db('NotesDB'); // Setup database infrastructure.

    if (err) return console.log(err); // Error checking in the db connection.
    
    // Require routing files, for CRUD operations on db.
    require("./routes")(app, db);

    // Run server and listen for the completed connection.
    app.listen(port, () => {
        console.log('Running on Port: '+ port); // Informative only.
    });
});