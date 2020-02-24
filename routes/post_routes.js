// Export as function.
module.exports = (app, db) => {

    app.post('/notes/create/new', (req, res) => { // Create: POST Request, to create a new record in db.
            
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

/* Helpful Code:
https://stackoverflow.com/questions/44915831/how-to-use-nodejs-pop-up-a-alert-window-in-browser

router.post('/path', function(req, res){
   //do something
   res.jsonp({success : true})
});

$.ajax({
    url:"/alert",
    method: "POST",
    data : {
        data : "Data want to send",
        put : "All goes here",
        title : "some data",
        body : "body fo data"
    },
    cache : false,
    success : function (data) {
        // data is the object that you send form the server by 
        // res.jsonp();
        // here data = {success : true}
        // validate it
        if(data['success']){
            alert("Msg to alert");
        }
    },
    error : function () {
        // some error handling part
        alert("Error -Something went wrong.");
    }
});
*/