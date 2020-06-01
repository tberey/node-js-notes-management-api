/* Server-Side Index Page */

import express, {Express} from 'express';
import http from 'http';
import bodyParser from "body-parser";
import {MongoClient, Db} from "mongodb";
import privateData from "./config/private.json";

export class Server {

    private port: string;
    private hostname: string;
    protected app: Express;
    private server: http.Server;
    //private dbClient: MongoClient
    protected db: Db;

    constructor(port:number, hostname:string) {
        this.port = process.env.PORT || port.toString();
        this.hostname = hostname;
        this.app = express();
        this.server = new http.Server(this.app);
        //this.dbClient = this.dbClientConnect();
        this.db = this.dbConnection();
        this.serverSetup();
    }

    /*private dbConnection():Db {
        if (this.dbClient) this.db = this.dbClient.db('NotesDB');
        return this.db;
    }
    private dbClientConnect():MongoClient {
        (async () => {
            try {
                this.dbClient = await MongoClient.connect(privateData.db, { useUnifiedTopology: true });
                console.log('Connected to DB Client');
            } catch (error) {
                console.log(error);
            }    
        })();
        return this.dbClient;
    }
    private dbClose():void {
        this.dbClient.close()
    }*/

    private dbConnection():Db {
        MongoClient.connect(privateData.db, { useUnifiedTopology: true }, (err:Error, client:MongoClient) => {
            if (err) throw err;
            this.db = client.db('NotesDB');
            console.log('Connected to DB Client');
        });         
        return this.db;
    }

    private serverSetup():void {

        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());

        this.app.set('view engine', 'ejs');
        this.app.use(express.static('public'));        
    }
    
    public startServer():void {   
        if (this.hostname) this.server.listen(parseInt(this.port), this.hostname, () => console.log(`Server started on http://${this.hostname}:${this.port}`));
        else this.server.listen(this.port, ():void => console.log(`Server started on http://localhost:${this.port}`));
    }
}