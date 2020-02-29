/* NOTES:-

There are 3 functions in this file.
Function with the largest signature take 2 arguments, while the median is 2.
Largest function has 4 statements in it, while the median is 3.
The most complex function has a cyclomatic complexity value of 3 while the median is 2.

*/

// Export as function.
module.exports = (app, db) => {

    app.post('/notes/create/new', (req, res) => { // Create: POST Request, to create a new record in db.
        
        // Set parameters, if none submitted with POST Request.
        req.body.title = req.body.title || 'New Note ' + Math.floor(Math.random() * 99999); // I.e. "?title=<someTitle>".
        req.body.note = req.body.note || '[Auto-Placeholder] Enter details or a description of your note here...'; // I.e. "?note=<someTitle>".

        // Build new note as a object.
        const note = {
            Title: req.body.title,
            Note: req.body.note,
            Date: (new Date()).toDateString(),
            Time: `${(new Date()).getHours()}:${(new Date()).getMinutes()}`,
            ['Note ID']: Math.floor(Math.random() * 99999),
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
};