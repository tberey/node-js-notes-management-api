/* NOTES:-

The main Node.JS file, that is to be called upon initialisation, and starts up the server & db infrastructure.

-------------------------------------------------------------------------------------------------------------------

There are 3 functions in this file.
Function with the largest signature take 2 arguments, while the median is 2.
Largest function has 5 statements in it, while the median is 2.
The most complex function has a cyclomatic complexity value of 2 while the median is 1.

-------------------------------------------------------------------------------------------------------------------
*/

// Global Dependancies.
import express from "express"; // Framework.
import bodyParser from "body-parser"; // Parse incoming request body for middleware.
import {MongoClient} from "mongodb"; // Database client (mongodb).
import privateData from "./config/private.json"; // Data imported for database connection infrastructure.
import appRouting from "./routes";

// Global Variables
const app:any = express(); // Init instance of express framework.
const port:string = process.env.PORT || '8080'; // Set Port connection for server. http://localhost:8080/

app.use(bodyParser.urlencoded({ extended: true })); // Parse url encoded data. I.e. make url encoded readable in middleware.

// Connect to database, which CRUD operation performed against. (Part of database connection infrastructure).
MongoClient.connect(privateData.db, { useUnifiedTopology: true }, (err:object, client:any) => {
    
    const db:object = client.db('NotesDB'); // Setup database infrastructure, by connecting to specific db collection.

    if (err) return console.log(err); // Error checking on the db connection.

    // Run server and listen for the completed connection.
    app.listen(port, () => {
        console.log('Running on Port: '+ port); // Informative only: Server init success.
    });

    // GET Request, to close db connection, and end all opertaions.
    app.get("/db/close", (req:object, res:any) => {
        client.close(true); // Close connection to db, using force (by passing true).
        res.json('Closed DB Connection - CRUD operations no longer available, until reconnection.');
    });

    // Import routing files, to perform all CRUD operations on db.
    appRouting(app, db); // Call imported functions.
});