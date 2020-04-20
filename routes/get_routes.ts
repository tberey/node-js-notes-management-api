/* NOTES:-

There are 18 functions in this file.
Function with the largest signature take 2 arguments, while the median is 2.
Largest function has 8 statements in it, while the median is 3.
The most complex function has a cyclomatic complexity value of 5 while the median is 2.

*/

// Import used types.
import {Request, Response, Express} from "express";

// Global Dependancies.
import {ObjectID} from "mongodb";
import path from "path";
import {note, noteUpdate} from "./index"

// Export as function.
export default (app:Express, db:any) => {
    
    // Seperate GET request after loading of front-end "index.html", for the page to request the "requests.js" file.
    app.get('/scripts/requests.js', (req:Request, res:Response) => {
        res.sendFile('requests.js', { root: path.join(__dirname, '../../scripts') });// Serve "requests.js" to html. Specify root (where file sits from currently executing script).
    });

    // Home-page, front-end for notes management system.
    app.get("/notes", (req:Request, res:Response) => {
        res.sendFile('index.html', { root: path.join(__dirname, '../../') });// Serve "index.html". Specify root (where file sits from currently executing script).

        //res.jsonp(["Item1","Item2","Item3"]); // Show some raw literal data, for testing.
        //res.json(["Item1","Item2","Item3"]); // Show some raw literal data, for testing.
    });


    app.get('/notes/new', (req:Request, res:Response) => { // Read: GET Request, for creating new test note. Prefilled note. (No Querying).
        
        // Set queries, if no query string submitted with URI in GET Request.
        req.query.title = req.query.title || 'New Note ' + Math.floor(Math.random() * 99999); // I.e. "?title=<someTitle>".
        req.query.note = req.query.note || '[Auto-Placeholder] Enter details or a description of your note here...'; // I.e. "?note=<someTitle>".

        // Build new note as object.
        const note:note = {
            Title: `${req.query.title}`,
            Note: `${req.query.note}`,
            Date: (new Date()).toDateString(),
            Time: `${(new Date()).getHours()}:${(new Date()).getMinutes()}`,
            ['Note ID']: Math.floor(Math.random() * 99999),
            Done: false
        };

        // Create the new note in the db.
        db.collection('notes').insertOne(note, (err:string, results:any) => {
            
            if (err) {
                res.send({'error':'Error Occurred: ' + err}); // Send response headers.
            } else {
                res.send(results.ops[0]); // Send response headers.
            }
        });
    });


    app.get(['/notes/seeAll','/notes/all'], (req:Request, res:Response) => { // Read: GET Request, for querying ALL.
        
        const filter:object = {'_id':{'$exists': true}}; // All notes with an id.

        db.collection('notes').find(filter).toArray((err:string, results:any) => { // Query ALL in db.
            
            if (err) {
                res.send({'error':'Error Occurred: ' + err}); // Send response headers.
            } else {
                if (results.length) {
                    res.jsonp(results); // Send response headers.
                } else {
                    res.send('No Notes found - Notes database is empty!'); // Send response headers.
                }
            }
        });
    });


    app.get('/notes/delAll', (req:Request, res:Response) => { // Read: GET Request, for deleting ALL records in db.
        
        const filter:object = {'_id':{'$exists': true}}; // All notes with an id.

        // Query all records first, to check if any exist to delete.
        db.collection('notes').find(filter).toArray((err:string, results:any) => {
            
            if (err) {
                res.send({'error':'Error Occurred: ' + err}); // Send response headers.
            } else {
                if (results.length) {

                    db.collection('notes').deleteMany(filter, (err:string) => { // Delete ALL the existing notes.
                        
                        if (err) {
                            res.send({'error':'Error Occurred'}); // Send response headers
                        } else {
                            res.send('Deleted All notes in db.'); // Send response headers
                        }
                    });
                } else {
                    res.send('No Notes to delete - Notes database is already empty!'); // Send response headers.
                }
            }
        });
    });


    app.get('/notes/del', (req:Request, res:Response) => { // Delete: DEL Request, of a single record by id.
        
        const id:number = parseInt(`${req.query.id}`); // Store string id, got from request query. Query key is "id". I.e. ?id=<someID>.
        const filter:object = {'_id': new ObjectID(id)}; // Instance of note's assigned ID as ID object, required by mongodb to make query using ID info.
        
        // Qeury the note user is attempting to delete first, to ensure it exists to del.
        db.collection('notes').findOne(filter, (err:string, results:object) => {
            
            if (err) {
                res.send({'error':'Error Occurred: ' + err}); // Send response headers.
            } else if (results) {
                
                db.collection('notes').deleteOne(filter, (err:string) => { // Delete the exisitng record, by in in the db.
                    
                    if (err) {
                        res.send({'error':'Error Occurred: ' + err}); // Send response headers.
                    } else {
                        res.send('Note successfully deleted!'); // Send response headers.
                    }
                });
            } else {
                res.send('Note ID: "' + id + '" not Found - Cannot delete!'); // Send response headers.
            }
        });
    });


    app.get('/notes/update', (req:Request, res:Response) => { // Update: PUT Request, to update a single record by id. If PATCH, would nullify columns that aren't sent with the update.
        
        const id:number = parseInt(`${req.query.id}`); // Store string id, got from request query. Query key is "id". I.e. ?id=<someID>.
        const filter:object = {'_id': new ObjectID(id)}; // Instance of note's assigned ID as ID object, required by mongodb to make query using ID info.
        
        // Query the record id first, to make sure it exists to update.
        db.collection('notes').findOne(filter, (err:string, results:any) => {
            
            if (err) {
                res.send({'error':'Error Occurred: ' + err}); // Send response headers.
            } else if (results) {
                
                // Set fields to their existing data, if no key/value query is submitted in the URI. Avoids nullifying field that aren't being updated.
                req.query.title = req.query.title || results.Title; // I.e. "?title=<someTitle>".
                req.query.note = req.query.note || results.Note; // I.e. "?note=<someTitle>".

                // Build note used to update record. Data is pulled from the query string. I.e. "?title=<someTitle>".
                const note:noteUpdate = {$set:{ // Atomic operator ($set:) to read and write at same time. Any not set in query string are nulled.
                    Title: `${req.query.title}`,
                    Note: `${req.query.note}`,
                    ['Last Updated']: `At ${(new Date()).getHours()}:${(new Date()).getMinutes()}, on ${(new Date()).toDateString()}.`
                }};

                db.collection('notes').updateOne(filter, note, (err:string) => { // Update  the exisitng record, by id, in the db.
                    
                    if (err) {
                        res.send({'error':'Error Occurred: ' + err}); // Send response headers.
                    } else {
                        res.send(note); // Send response headers.
                    }
                });
            } else {
                res.send('Note ID: "' + id + '" not Found - Cannot update!'); // Send response headers.
            }
        });
    });


    app.get('/notes/:id', (req:Request, res:Response) => { // Read: GET Request for querying one specific note id.
        
        const id:string = req.params.id; // Store string id, got from request parameters.
        const filter:object = { ['Note ID']: parseInt(id) }; // Parse note ID string as int, to filter our query to record with the specified note id.
        
        db.collection('notes').findOne(filter, (err:string, results:object) => { // Query by id in db.
            
            if (err) {
                res.send({'error':'Error Occurred: ' + err}); // Send response headers.
            } else {
                res.send(results || 'Note ID: "' + id + '" not Found!'); // Send response headers.
            }
        });
    });

    app.get('*', (req:Request, res:Response) => res.status(404).redirect('/notes')); // Error-handling: GET request, to catch any user error, or incorrect get attempts.
};