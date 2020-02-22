module.exports = (app, db) => {

    app.post('/notes', (req, res) => { // Create: POST Request.
            
        const note = {Title: req.body.Title, Note: req.body.Body, Date: (new Date()).toDateString(), Done: false}; // Store the note from targetted key value pairs, sent with request body.
        
        db.collection('notes').insertOne(note, (err, results) => { // Create new note in db.
            
            //console.log(req.body); // Debugging/Testing purposes. See new notes in request, in terminal.

            if (err) {
                res.send({'error':'Error Occurred: ' + err}); // Send/set response headers.
            } else {
                res.send(results.ops[0]); // Send/set response headers.
            }
        });
    });
}