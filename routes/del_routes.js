// Global Dependancies. (Not to be exported).
const ObjectID = require("mongodb").ObjectID;

// Export as function.
module.exports = (app, db) => {

    app.delete('/notes/delete/all', (req, res) => { // Delete: DEL Request, of ALL the records.

        const filter = {'_id': {'$exists': true}}; // ID key exists.

        db.collection('notes').find(filter).toArray((err, results) => { //Find all records, matching criteria (id key exists).
            if (err) {
                res.send({'error':'Error Occurred: ' + err}); // Send response headers.
            } else {
                if (results.length) {
                    db.collection('notes').deleteMany(filter, (err) => { // Delete ALL existing records, matching criteria.
                        if (err) {
                            res.send({'error':'Error Occurred'}); // Send response headers.
                        } else {
                            res.send('Deleted All notes in db.'); // Send response headers.
                        }
                    });
                } else {
                    res.send('No Notes to delete - Notes database is already empty!'); // Send response headers.
                }
            }
        });
    });


    app.delete('/notes/delete/:id', (req, res) => { // Delete: DEL Request, of a single record by id.

        const id = req.params.id; // Store string id, got from request parameters.
        const filter = {'_id': new ObjectID(id)}; // Instance of note's assigned ID as ID object, required by mongodb to make query using ID info.

        db.collection('notes').findOne(filter, (err, results) => { // Query single record, by id in db.
            if (err) {
                res.send({'error':'Error Occurred: ' + err}); // Send response headers.
            } else if (results) {
                db.collection('notes').deleteOne(filter, (err) => { // Delete exisitng record, by in in the db.
                    if (err) {
                        res.send({'error':'Error Occurred: ' + err}); // Send response headers.
                    } else {
                        res.send('Note ' + id + ' successfully deleted!'); // Send response headers.
                    }
                });
            } else {
                res.send('Note ID: "' + id + '" not Found - Cannot delete!'); // Send response headers.
            }
        });
    });
}