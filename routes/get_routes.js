const ObjectID = require("mongodb").ObjectID;

module.exports = (app, db) => {
    
    app.get("/test", (req, res) => { // Test end-point.
        res.json(["Item1","Item2","Item3"]); // Show some raw literal data, for testing.
        
    });

    app.get("/close", (req, res) => { // Close db connection end-point.
        client.close(true) // Close connection to db, using force (by passing true).
        res.json('Closed DB Connection - CRUD operations no longer available, until reconnection.');
        
    });

    app.get('/notes/all', (req, res) => { // Read: GET Request for querying ALL.
        
        const details = {'_id':{'$exists': true}}; // All notes with an id.

        db.collection('notes').find(details).toArray((err, results) => { // Query ALL in db.
            
            if (err) {
                res.send({'error':'Error Occurred: ' + err}); // Send/set response headers.
            } else {
                res.send(results); // Send/set response headers.
            }
        });
    });

    app.get('/notes/deleteAll', (req, res) => { // Read: GET Request for deleting ALL.
        
        const details = {'_id':{'$exists': true}}; // All notes with an id.

        db.collection('notes').deleteMany(details, (err) => { // Delet ALL existing notes.

            if (err) {
                res.send({'error':'Error Occurred'}); // Send/set response headers
            } else {
                res.send('Deleted All notes in db.'); // Send/set response headers
            }
        });
    });

    app.get('/notes/:id', (req, res) => { // Read: GET Request for querying one specific id.
        
        const id = req.params.id; // Store string id, got from request parameters.
        const details = {'_id': new ObjectID(id)}; // Instance of note's assigned ID as ID object, required by mongodb to make request using ID info.

        db.collection('notes').findOne(details, (err, results) => { // Query by id in db.
            
            if (err) {
                res.send({'error':'Error Occurred: ' + err}); // Send/set response headers.
            } else {
                res.send(results); // Send/set response headers.
            }
        });
    });
}