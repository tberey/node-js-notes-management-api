/* NOTES:-

There are 4 functions in this file.
Function with the largest signature take 2 arguments, while the median is 2.
Largest function has 7 statements in it, while the median is 3.
The most complex function has a cyclomatic complexity value of 3 while the median is 1.5.

*/

// Export as function.
module.exports = (app, db) => {

    app.put('/notes/update/:id', (req, res) => { // Update: PUT Request, to update a single record by id. If PATCH, would nullify columns that aren't sent with the update.

        const id = req.params.id; // Store string id, got from request parameters.
        const filter = { [['Note ID']]: parseInt(id) }; // Parse note ID string as int, to filter our query to record with the specified note id.
        
        db.collection('notes').findOne(filter, (err, results) => { // Query single record, by id in db.
            if (err) {
                res.send({'error':'Error Occurred: ' + err}); // Send response headers.
            } else if (results) {
                
                // Store the note update from targetted key value pairs, sent with request body. Atomic operator ($set:) to read and write at same time.
                const note = {$set:{Title: req.body.title, Note: req.body.note}};
                
                // Update the already queried note, to display in html on successful update.
                results.Title = req.body.title;
                results.Note = req.body.note;
                
                db.collection('notes').updateOne(filter, note, (err) => { // Update exisitng record, by id, in the db.
                    if (err) {
                        res.send({'error':'Error Occurred: ' + err}); // Send response headers.
                    } else {
                        res.send([note,results]); //Send array response headers, to display the full note in html.
                    }
                });
            } else {
                res.send('Note ID: "' + id + '" not Found - Cannot update!'); // Send response headers.
            }
        });
    });
};