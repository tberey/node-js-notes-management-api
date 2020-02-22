/*
Notes:
---------------------------------------------------------------------------

'npm run dev' to run & start watching for changes to the scripts/files.

Add a way to find id's/store/send to whom add notes.

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

    // Run server and listen for the completed connection.
    app.listen(port, () => {
        console.log('Running on Port: '+ port); // Informative only.
    });

    app.get("/test", (req, res) => { // Test end-point.
        res.json(["Item1","Item2","Item3"]); // Show some raw literal data, for testing.
        
    });

    app.get("/close", (req, res) => { // Close db connection end-point.
        client.close(true) // Close connection to db, using force (passing true).
        res.json('Closed DB Connection - CRUD operations no longer available, until reconnection.');
        
    });

    app.post('/notes', (req, res) => { // Create: POST Request.
        
        const note = { text: req.body.body, title: req.body.title }; // Store the note from targetted key value pairs, sent with request body.
        
        db.collection('notes').insertOne(note, (err, result) => { // Create new note in db.
            
            //console.log(req.body); // Debugging/Testing purposes. See new notes in request, in terminal.

            if (err) {         
                res.send({'error':'Error Occurred: ' + err}); // Send/set response headers.
            } else {        
                res.send(result.ops[0]); // Send/set response headers.
            }
        });
    });

    app.get('/notes/:id', (req, res) => { // Read: GET Request.
        
        const id = req.params.id; // Store string id, got from request parameters.
        const details = {'_id': new ObjectID(id)}; // Instance of note's assigned ID as ID object, required by mongodb to make request using ID info.

        db.collection('notes').findOne(details, (err, item) => { // Find item by id in db.
            
            if (err) {
                res.send({'error':'Error Occurred: ' + err}); // Send/set response headers.
            } else {
                res.send(item); // Send/set response headers.
            }
        });
    });

    app.put('/notes/:id', (req, res) => { // Update: PUT Request. -> Bug: If no title/body provided, will be nullified. Add conditional, to update fields only if non-empty.
    
        const id = req.params.id; // Store string id, got from request parameters.
        const details = { '_id': new ObjectID(id) }; // Instance of note's assigned ID as ID object, required by mongodb to make request using ID info.
        
        // Store the note update from targetted key value pairs, sent with request body. Atomic operator ($set:) to read and write at same time.
        const note = {$set:{ text: req.body.body, title: req.body.title }};
        
        db.collection('notes').updateOne(details, note, (err) => { // Update exisitng note, by id, in the db.
            
            if (err) {
                res.send({'error':'Error Occurred: ' + err}); // Send/set response headers
            } else {
                res.send(note); // Send/set response headers
            }
        });
    });

    app.delete('/notes/:id', (req, res) => { // Delete: DEL Request.

        const id = req.params.id; // Store string id, got from request parameters.
        const details = {'_id': new ObjectID(id)}; // Instance of note's assigned ID as ID object, required by mongodb to make request using ID info.
    
        db.collection('notes').deleteOne(details, (err) => { // Delete exisitng note, by id, in the db.
    
            if (err) {
                res.send({'error':'Error Occurred'}); // Send/set response headers
            } else {
                res.send('Note ' + id + ' deleted!'); // Send/set response headers
            }
        });
    });
});