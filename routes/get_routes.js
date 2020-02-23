// Global Dependancies. (Not to be exported).
const ObjectID = require("mongodb").ObjectID;
const $ = require('jquery'); // jQuery module import.

// Export as function.
module.exports = (app, db) => {
    
    app.get("/test-api", (req, res) => { // Test end-point.
        res.send('Testing Zone.');
        //res.jsonp(["Item1","Item2","Item3"]); // Show some raw literal data, for testing.
        //res.json(["Item1","Item2","Item3"]); // Show some raw literal data, for testing.
    });


    app.get(['/notes/seeAll','/notes/all'], (req, res) => { // Read: GET Request, for querying ALL.
        
        const filter = {'_id':{'$exists': true}}; // All notes with an id.

        db.collection('notes').find(filter).toArray((err, results) => { // Query ALL in db.
            
            if (err) {
                res.send({'error':'Error Occurred: ' + err}); // Send/set response headers.
            } else {
                if (results.length) {
                    res.send(results); // Send/set response headers.
                } else {
                    res.send('No Notes found - Notes database is empty!'); // Send/set response headers.
                }
            }
        });
    });


    app.get('/notes/new', (req, res) => { // Read: GET Request, for querying one specific id.
        
        let tDate = new Date();
        req.query.title = 'Test Title [' + tDate.getSeconds() + tDate.getMilliseconds() + ']';
        req.query.note = 'Test note body';

        const note = {title: req.query.title, note: req.query.note, Date: (new Date()).toDateString(), Done: false}; // Store the note from targetted key value pairs, sent with request body.
        
        db.collection('notes').insertOne(note, (err, results) => { // Create new note in db.
            
            //console.log(req.body); // Debugging/Testing purposes. See new notes in request, in terminal.

            if (err) {
                res.send({'error':'Error Occurred: ' + err}); // Send/set response headers.
            } else {
                res.send(results.ops[0]); // Send/set response headers.
            }
        });
    });


    app.get('/notes/delAll', (req, res) => { // Read: GET Request, for deleting ALL records in db.
        
        const filter = {'_id':{'$exists': true}}; // All notes with an id.

        db.collection('notes').find(filter).toArray((err, results) => {
            
            if (err) {

                res.send({'error':'Error Occurred: ' + err}); // Send/set response headers.

            } else {
                
                if (results.length) {

                    db.collection('notes').deleteMany(filter, (err) => { // Delete ALL existing notes.

                        if (err) {
                            res.send({'error':'Error Occurred'}); // Send/set response headers
                        } else {
                            res.send('Deleted All notes in db.'); // Send/set response headers
                        }

                    });

                } else {

                    res.send('No Notes to delete - Notes database is already empty!');

                }
            }
        });
    });


    app.get('/notes/del', (req, res) => { // Delete: DEL Request, of a single record by id.

        //const id = req.params.id; // Store string id, got from request parameters.
        const filter = {'_id': new ObjectID(req.query.id)}; // Instance of note's assigned ID as ID object, required by mongodb to make query using ID info.

        db.collection('notes').findOne(filter, (err, results) => { // Query single record, by id in db.
            if (err) {
                res.send({'error':'Error Occurred: ' + err}); // Send response headers.
            } else if (results) {
                db.collection('notes').deleteOne(filter, (err) => { // Delete exisitng record, by in in the db.
                    if (err) {
                        res.send({'error':'Error Occurred: ' + err}); // Send response headers.
                    } else {
                        res.send('Note successfully deleted!'); // Send response headers.
                    }
                });
            } else {
                res.send('Note not Found - Cannot delete!'); // Send response headers.
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
                res.send(results || 'Note [' + id + '] not Found!'); // Send/set response headers.
                
            }
        });
    });
}

/* Helpful Code:
$.ajax({
    url:"/alert",
    method: "POST",
    data : {
        data : "Data want to send",
        put : "All goes here",
        title : "some data",
        body : "body fo data"
    },
    cache : false,
    success : function (data) {
        // data is the object that you send form the server by 
        // res.jsonp();
        // here data = {success : true}
        // validate it
        if(data['success']){
            alert("Msg to alert");
        }
    },
    error : function () {
        // some error handling part
        alert("Error -Something went wrong.");
    }
});
*/