const ObjectID = require("mongodb").ObjectID;

module.exports = (app, db) => {

    app.put('/notes/:id', (req, res) => { // Update: PUT Request. -> Bug: If no title/body provided, will be nullified. Add conditional, to update fields only if non-empty.
        
        const id = req.params.id; // Store string id, got from request parameters.
        const details = { '_id': new ObjectID(id) }; // Instance of note's assigned ID as ID object, required by mongodb to make request using ID info.
        
        // Store the note update from targetted key value pairs, sent with request body. Atomic operator ($set:) to read and write at same time.
        const note = {$set:{ text: req.body.body, title: req.body.title }}; // Atomic operator ($set:) to read and write at same time.
        
        db.collection('notes').updateOne(details, note, (err) => { // Update exisitng note, by id, in the db.
            
            if (err) {
                res.send({'error':'Error Occurred: ' + err}); // Send/set response headers
            } else {
                res.send(note); // Send/set response headers
            }
        });
    });
}