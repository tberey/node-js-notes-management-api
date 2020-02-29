/* NOTES:-

There are 7 functions in this file.
Function with the largest signature take 2 arguments, while the median is 2.
Largest function has 5 statements in it, while the median is 3.
The most complex function has a cyclomatic complexity value of 3 while the median is 2.

*/

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
        const filter = { [['Note ID']]: parseInt(id) }; // Parse note ID string as int, to filter our query to record with the specified note id.

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
};