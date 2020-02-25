// Export as function.
module.exports = (app, db) => {

    app.post('/notes/create/new', (req, res) => { // Create: POST Request, to create a new record in db.
        
        // Build new note as a object.
        const note = {
            Title: req.query.title,
            Note: req.query.note,
            Date: (new Date()).toDateString(),
            Time: `${(new Date()).getHours()}:${(new Date()).getMinutes()}`,
            ['Note Number']: Math.floor(Math.random() * 99999),
            Done: false
        };
        
        db.collection('notes').insertOne(note, (err, results) => { // Create new note in db.
            if (err) {
                res.send({'error':'Error Occurred: ' + err}); // Send response headers.
            } else {
                res.send(results.ops[0]); // Send response headers.
            }
        });
    });
}
