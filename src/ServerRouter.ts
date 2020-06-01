import { Request, Response } from "express";
import { Server } from "./Server";
import { NewNote } from "./types/NewNote";
import { UpdateNote } from "./types/UpdateNote";

export class ServerRouter extends Server {
    
    constructor(port:number=3000, hostname:string='') {
        super(port,hostname);
        this.getRequests();
        this.postRequests();
        this.putRequests();
        this.deleteRequests();
    }


    private getRequests():void {
    
        // GET request route, to render and serve the client index login/register page. Include EJS vars placeholder (empty string).
        this.app.get('/', (req:Request,res:Response):void => res.status(200).render('index',{data:``}));


        this.app.get('/all', (req:Request, res:Response) => { // Read: GET Request, for querying ALL.
        
            const filter:object = {'_id':{'$exists': true}}; // All notes with an id.
    
            this.db.collection('notes').find(filter).toArray((err:Error, results:any) => { // Query ALL in db.
                
                if (err) res.status(500).send({'error':'DB Error Occurred: ' + err}); // Send response headers.
                if (err) throw err;

                if (!results.length) res.status(404).send('No Notes found - Notes database is empty!'); // Send response headers.
                else res.status(200).send(results); // Send response headers.
            });
        });


        this.app.get('/:id', (req:Request, res:Response) => { // Read: GET Request for querying one specific note id.
        
            const id:string = req.params.id; // Store string id, got from request parameters.
            const filter:object = { ['Note ID']: parseInt(id) }; // Parse note ID string as int, to filter our query to record with the specified note id.
            
            this.db.collection('notes').findOne(filter, (err:Error, results:any) => { // Query by id in db.
                
                if (err) res.status(500).send({'error':'DB Error Occurred: ' + err}); // Send response headers.
                if (err) throw err;
                
                res.status(200).send(results || 'Note ID: "' + id + '" not Found!'); // Send response headers.
            });
        });

         
        // Catch all/any unresolved url requests to no-man's land, and redirect to correct location.
        this.app.get('*', (req:Request, res:Response):void => res.status(404).redirect('/'));
    }


    private postRequests():void {
        this.app.post('/new', async(req:Request, res:Response):Promise<void> => { // Create: POST Request, to create a new record in db.
        
            // Set parameters, if none submitted with POST Request.
            if (!req.body.title) req.body.title = 'New Note ' + Math.floor(Math.random() * 99999);
            if (!req.body.note) req.body.note = '[Auto-Placeholder] Enter details or a description of your note here...';
    
            // Build new note as a object.
            const note:NewNote = {
                Title: req.body.title,
                Note: req.body.note,
                Date: (new Date()).toDateString(),
                Time: `${(new Date()).getHours()}:${(new Date()).getMinutes()}`,
                ['Note ID']: Math.floor(Math.random() * 99999),
                Done: false
            };
            
            this.db.collection('notes').insertOne(note, (err:Error, results:any) => { // Create new note in db.
                
                if (err) res.status(500).send({'error':'DB Error Occurred: ' + err}); // Send response headers.
                if (err) throw err;

                res.status(200).render('index', {data: results.ops[0]}); // Send response headers.
            });
        });
    }


    private putRequests():void {
        this.app.put('/:id', async(req:Request, res:Response):Promise<void> => { // Update: PUT Request, to update a single record by id. If PATCH, would nullify columns that aren't sent with the update.

            const id:string = req.params.id; // Store string id, got from request parameters.
            const filter:object = { ['Note ID']: parseInt(id) }; // Parse note ID string as int, to filter our query to record with the specified note id.
            
            this.db.collection('notes').findOne(filter, (err:Error, results:any) => { // Query single record, by id in db.
                
                if (err) res.status(500).send({'error':'DB Error Occurred: ' + err}); // Send response headers.
                if (err) throw err;
                
                if (!results) res.status(404).send('Note ID: "' + id + '" not Found - Cannot update!'); // Send response headers.
                else if (results) {
                    
                    // Store the note update from targetted key value pairs, sent with request body. Atomic operator ($set:) to read and write at same time.
                    const note:UpdateNote = {$set:
                        {
                            Title: req.body.title,
                            Note: req.body.note,
                            ['Last Updated']: `At ${(new Date()).getHours()}:${(new Date()).getMinutes()}, on ${(new Date()).toDateString()}.`
                        }
                    };
                    
                    // Update the already queried note, to display the full note in html on successful update.
                    results.Title = req.body.title;
                    results.Note = req.body.note;
                    
                    this.db.collection('notes').updateOne(filter, note, (err:Error) => { // Update exisitng record, by id, in the db.
                        
                        if (err) res.status(500).send({'error':'DB Error Occurred: ' + err}); // Send response headers.
                        if (err) throw err;
                        
                        res.status(200).send([note,results]); //Send array response headers, to display the full note in html.
                    });
                }
            });
        });
    }


    private deleteRequests():void {
        
        this.app.delete('/deleteAll', async(req:Request, res:Response):Promise<void> => { // Delete: DEL Request, of ALL the records.

            const filter:object = {'_id': {'$exists': true}}; // ID key exists.
    
            this.db.collection('notes').find(filter).toArray((err:Error, results:any) => { //Find all records, matching criteria (id key exists).
                
                if (err) res.status(500).send({'error':'DB Error Occurred: ' + err}); // Send response headers.
                if (err) throw err;
                
                if (!results.length) res.status(404).send('No Notes to delete - Notes database is already empty!'); // Send response headers.
                else if (results.length) {
                    
                    this.db.collection('notes').deleteMany(filter, (err:Error) => { // Delete ALL existing records, matching criteria.
                        
                        if (err) res.status(500).send({'error':'DB Error Occurred:' + err}); // Send response headers.
                        if (err) throw err;

                        res.status(200).send('Deleted All notes in db.'); // Send response headers.
                    });
                }
                
            });
        });

        
        this.app.delete('/:id', async(req:Request, res:Response):Promise<void> => { // Delete: DEL Request, of a single record by id.

            const id:string = req.params.id; // Store string id, got from request parameters.
            const filter:object = { ['Note ID']: parseInt(id) }; // Parse note ID string as int, to filter our query to record with the specified note id.
    
            this.db.collection('notes').findOne(filter, (err:Error, results:any) => { // Query single record, by id in db.
                
                if (err) res.status(500).send({'error':'DB Error Occurred: ' + err}); // Send response headers.
                if (err) throw err;

                if (!results) res.status(404).send('Note ID: "' + id + '" not Found - Cannot delete!'); // Send response headers.
                else if (results) {

                    this.db.collection('notes').deleteOne(filter, (err:Error) => { // Delete exisitng record, by in in the db.
                        
                        if (err) res.status(500).send({'error':'DB Error Occurred: ' + err}); // Send response headers.
                        if (err) throw err;
                        
                        res.status(200).send('Note ' + id + ' successfully deleted!'); // Send response headers.
                    });
                }
            });
        });    
    }
}