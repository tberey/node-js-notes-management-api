# [ALPHA 0.0.1] Contact Lookup API (Node.js) - Early Build


***


## A RESTful Contact Lookup API, made in Node, that allows users to performs CRUD operations on a MongoDB Database.

### <i> At the moment this API is setup to allow the four basic crud operation for notes. I.e. {"title": "Test Title of Note", "body": "Test body of the note."} key-value pair, sent in the body of a POST/PUT request, to Create/Update a note in the DB, (in a x-www-form-urlencode). Notes are associated by ID for now.


***


#### List of URL(http://localhost:8080/) + URN (End-points), for GET Requests against a MongoDB, that are currently available:

| URN | Action on DB | Full URI (Using port 8080, GET Request only) |
|:---|:---|
| <ul><li>"/notes/all"</li><li>"/notes/seeAll"</li><li>"/notes/<\noteID>\"</li></ul> | <b><u>READ</u></b> | <ul><li>"http://localhost:8080/notes/all"</li><li>"http://localhost:8080/notes/seeAll"</li><li>"http://localhost:8080/notes/<\noteID>\"</li></ul> |
| <ul><li>"/notes/new"</li></ul> | <b><u>CREATE</u></b> | <ul><li>"http://localhost:8080/notes/new"</li></ul> |
| <ul><li>"/notes/del?id=<\noteId>\"</li><li>"/notes/delAll"</li></ul> | <b><u>DELETE</u></b> | <ul><li>"http://localhost:8080/notes/del?id=<\noteId>\"</li><li>"http://localhost:8080/notes/delAll"</li></ul> |

##### POST/PUT/DELETE requests also available, with an app like Postman, or other middleware.


***
***


|Version| Changes|
|:---|:---|
|Version 0.0.1 [2020-02-22]|<ul><li>Initial Commit.</li><li>Add "main.js" file, node project.</li><li>Add README.md</li><li>Make new dir "Screenshots".</li><li>Add some screenshots to "Screenshots" dir.</li></ul>|
|Version 0.0.2 [2020-02-22]|<ul><li>Split methods into routes, with a new "routes" dir, and a route script file for each CRUD Method. (Using modules/exports).</li><li>Add new DEL & GET methods to respective route script files.</li><li>Update POST method in POST script file, to add more data into the note records going into db.</li><li>Update README.md</li></ul>|
|Version 0.1.0 [2020-02-23]|<ul><li>Big Update... more info coming.</li><li>Update README.md</li></ul>|