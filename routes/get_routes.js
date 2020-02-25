// Global Dependancies. (Not to be exported).
const ObjectID = require("mongodb").ObjectID;
const $ = require('jquery'); // jQuery module import.

// Export as function.
module.exports = (app, db, test) => {
    
    app.get("/notes", (req, res) => { // Test end-point.
        //res.send('Testing Zone.');
        res.sendFile('/home/tom/Node.js/src/contact-lookup-API-node/index.html');
        //res.jsonp(["Item1","Item2","Item3"]); // Show some raw literal data, for testing.
        //res.json(["Item1","Item2","Item3"]); // Show some raw literal data, for testing.
    });


    app.get('/notes/new', (req, res) => { // Read: GET Request, for creating new test note. Prefilled note. (No Querying).
        
        const filter = {'_id':{'$exists': true}}; // All notes with an id.
        
        // Set queries, if no query string submitted with URI in GET Request.
        req.query.title = req.query.title || 'New Note ' + Math.floor(Math.random() * 99999); // I.e. "?title=<someTitle>".
        req.query.note = req.query.note || '[Auto-Placeholder] Enter details or a description of your note here...'; // I.e. "?note=<someTitle>".

        // Build new note as object.
        const note = {
            Title: req.query.title,
            Note: req.query.note,
            Date: (new Date()).toDateString(),
            Time: `${(new Date()).getHours()}:${(new Date()).getMinutes()}`,
            ['Note Number']: Math.floor(Math.random() * 99999),
            Done: false
        };

        // Create the new note in the db.
        db.collection('notes').insertOne(note, (err, results) => {
            
            if (err) {
                res.send({'error':'Error Occurred: ' + err}); // Send response headers.
            } else {
                res.send(results.ops[0]); // Send response headers.
            }
        });
    });


    app.get(['/notes/seeAll','/notes/all'], (req, res) => { // Read: GET Request, for querying ALL.
        //console.log(JSON.stringify(test));
        const filter = {'_id':{'$exists': true}}; // All notes with an id.

        db.collection('notes').find(filter).toArray((err, results) => { // Query ALL in db.
            
            if (err) {
                res.send({'error':'Error Occurred: ' + err}); // Send response headers.
            } else {
                if (results.length) {
                    res.jsonp(results); // Send response headers.
                } else {
                    res.send('No Notes found - Notes database is empty!'); // Send response headers.
                }
            }
        });
    });


    app.get('/notes/delAll', (req, res) => { // Read: GET Request, for deleting ALL records in db.
        
        const filter = {'_id':{'$exists': true}}; // All notes with an id.

        // Query all records first, to check if any exist to delete.
        db.collection('notes').find(filter).toArray((err, results) => {
            
            if (err) {
                res.send({'error':'Error Occurred: ' + err}); // Send response headers.
            } else {
                if (results.length) {

                    db.collection('notes').deleteMany(filter, (err) => { // Delete ALL the existing notes.
                        
                        if (err) {
                            res.send({'error':'Error Occurred'}); // Send response headers
                        } else {
                            res.send('Deleted All notes in db.'); // Send response headers
                        }
                    });
                } else {
                    res.send('No Notes to delete - Notes database is already empty!'); // Send response headers.
                }
            }
        });
    });


    app.get('/notes/del', (req, res) => { // Delete: DEL Request, of a single record by id.
        
        const id = req.query.id; // Store string id, got from request query. Query key is "id". I.e. ?id=<someID>.
        const filter = {'_id': new ObjectID(id)}; // Instance of note's assigned ID as ID object, required by mongodb to make query using ID info.
        
        // Qeury the note user is attempting to delete first, to ensure it exists to del.
        db.collection('notes').findOne(filter, (err, results) => {
            
            if (err) {
                res.send({'error':'Error Occurred: ' + err}); // Send response headers.
            } else if (results) {
                
                db.collection('notes').deleteOne(filter, (err) => { // Delete the exisitng record, by in in the db.
                    
                    if (err) {
                        res.send({'error':'Error Occurred: ' + err}); // Send response headers.
                    } else {
                        res.send('Note successfully deleted!'); // Send response headers.
                    }
                });
            } else {
                res.send('Note ID: "' + id + '" not Found - Cannot delete!'); // Send response headers.
            }
        });
    });


    app.get('/notes/update', (req, res) => { // Update: PUT Request, to update a single record by id. If PATCH, would nullify columns that aren't sent with the update.
        
        const id = req.query.id; // Store string id, got from request query. Query key is "id". I.e. ?id=<someID>.
        const filter = {'_id': new ObjectID(id)}; // Instance of note's assigned ID as ID object, required by mongodb to make query using ID info.
        
        // Query the record id first, to make sure it exists to update.
        db.collection('notes').findOne(filter, (err, results) => {
            
            if (err) {
                res.send({'error':'Error Occurred: ' + err}); // Send response headers.
            } else if (results) {
                console.log(results.Title);
                // Set fields to their existing data, if no key/value query is submitted in the URI. Avoids nullifying field that aren't being updated.
                req.query.title = req.query.title || results.Title; // I.e. "?title=<someTitle>".
                req.query.note = req.query.note || results.Note; // I.e. "?note=<someTitle>".

                // Build note used to update record. Data is pulled from the query string. I.e. "?title=<someTitle>".
                const note = {$set:{ // Atomic operator ($set:) to read and write at same time. Any not set in query string are nulled.
                    Title: req.query.title,
                    Note: req.query.note,
                    ['Last Updated']: `At ${(new Date()).getHours()}:${(new Date()).getMinutes()}, on ${(new Date()).toDateString()}.`
                }};

                db.collection('notes').updateOne(filter, note, (err) => { // Update  the exisitng record, by id, in the db.
                    
                    if (err) {
                        res.send({'error':'Error Occurred: ' + err}); // Send response headers.
                    } else {
                        res.send(note); // Send response headers.
                    }
                });
            } else {
                res.send('Note ID: "' + id + '" not Found - Cannot update!'); // Send response headers.
            }
        });
    });


    app.get('/notes/:id', (req, res) => { // Read: GET Request for querying one specific id.
        
        const id = req.params.id; // Store string id, got from request parameters. I.e. "/notes/<someID>".
        const details = {'_id': new ObjectID(id)}; // Instance of note's assigned ID as ID object, required by mongodb to make request using ID info.
        
        db.collection('notes').findOne(details, (err, results) => { // Query by id in db.
            
            if (err) {
                res.send({'error':'Error Occurred: ' + err}); // Send response headers.
            } else {
                res.send(results || 'Note ID: "' + id + '" not Found!'); // Send response headers.
            }
        });
    });
}