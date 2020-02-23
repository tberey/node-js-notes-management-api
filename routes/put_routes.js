// Global Dependancies. (Not to be exported).
const ObjectID = require("mongodb").ObjectID;

// Export as function.
module.exports = (app, db) => {

    app.put('/notes/update/:id', (req, res) => { // Update: PUT Request, to update a single record by id. If PATCH, would nullify columns that aren't sent with the update.

        const id = req.params.id; // Store string id, got from request parameters.
        const filter = {'_id': new ObjectID(id)}; // Instance of note's assigned ID as ID object, required by mongodb to make query using ID info.
    
        db.collection('notes').findOne(filter, (err, results) => { // Query single record, by id in db.
            if (err) {
                res.send({'error':'Error Occurred: ' + err}); // Send response headers.
            } else if (results) {
                
                // Store the note update from targetted key value pairs, sent with request body. Atomic operator ($set:) to read and write at same time.
                const note = {$set:{title: req.body.title, note: req.body.note}}; // Atomic operator ($set:) to read and write at same time.
                
                db.collection('notes').updateOne(filter, note, (err) => { // Update exisitng record, by id, in the db.
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
}