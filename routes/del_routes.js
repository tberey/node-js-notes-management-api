const ObjectID = require("mongodb").ObjectID;

module.exports = (app, db) => {

    app.delete('/notes/delAll', (req, res) => { // Delete: DEL Request of ALL data.

        const details = {'_id': {'$exists': true}}; // notes where ID key exists.

        db.collection('notes').deleteMany(details, (err) => { // Delet ALL existing notes.

            if (err) {
                res.send({'error':'Error Occurred'}); // Send/set response headers
            } else {
                res.send('Deleted All notes in db.'); // Send/set response headers
            }
        });
    });

    app.delete('/notes/:id', (req, res) => { // Delete: DEL Request by id.

        const id = req.params.id; // Store string id, got from request parameters.
        const details = {'_id': new ObjectID(id)}; // Instance of note's assigned ID as ID object, required by mongodb to make request using ID info.

        db.collection('notes').deleteOne(details, (err) => { // Delete exisitng note by id, in the db.

            if (err) {
                res.send({'error':'Error Occurred'}); // Send/set response headers
            } else {
                res.send('Note successfully' + id + ' deleted.'); // Send/set response headers
            }
        });
    });
}