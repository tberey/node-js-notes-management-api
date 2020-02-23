// Export as function.
module.exports = (app, db) => {

    app.post('/notes/create/new', (req, res) => { // Create: POST Request, to create a new record in db.
            
        const note = {title: req.body.title, note: req.body.note, Date: (new Date()).toDateString(), Done: false}; // Store the note from targetted key value pairs, sent with request body.
        
        db.collection('notes').insertOne(note, (err, results) => { // Create new note in db.
            if (err) {
                res.send({'error':'Error Occurred: ' + err}); // Send response headers.
            } else {
                res.send(results.ops[0]); // Send response headers.
            }
        });
    });
}